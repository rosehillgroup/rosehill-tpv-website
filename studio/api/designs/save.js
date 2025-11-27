// TPV Studio - Save/Update Design (Vercel)
// Saves a complete design with all state for future loading

import { getAuthenticatedClient, getSupabaseServiceClient } from '../_utils/supabase.js';
import { ensureOwnership } from '../_utils/authorization.js';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated client and user
    const { client, user } = await getAuthenticatedClient(req);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - please sign in' });
    }

    const {
      id, // For updates only
      name,
      description,
      project_id,
      tags,
      design_data,
      is_public,
      thumbnail_url // For sports designs
    } = req.body;

    // Validate required fields
    if (!name || !design_data) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'design_data']
      });
    }

    // Determine design type and validate accordingly
    const isSportsDesign = design_data.type === 'sports_surface';

    if (isSportsDesign) {
      // Validate sports surface design
      if (!design_data.surface || !design_data.dimensions) {
        return res.status(400).json({
          error: 'Invalid sports design_data',
          required_fields: ['surface', 'dimensions']
        });
      }
    } else {
      // Validate playground design
      const { input_mode, dimensions, original_svg_url } = design_data;

      if (!input_mode || !dimensions || !original_svg_url) {
        return res.status(400).json({
          error: 'Invalid design_data',
          required_fields: ['input_mode', 'dimensions', 'original_svg_url']
        });
      }
    }

    // Prepare design record based on design type
    let designRecord;

    if (isSportsDesign) {
      // Sports surface design - store complete design_data as JSON
      designRecord = {
        user_id: user.id,
        name,
        description: description || null,
        project_id: project_id || null,
        tags: tags || [],
        is_public: is_public || false,

        // Sports-specific storage
        input_mode: 'sports_surface',
        dimensions: design_data.dimensions, // { width_mm, length_mm }
        design_data: design_data, // Store complete sports design as JSONB

        // Sports designs generate thumbnails client-side
        original_svg_url: 'sports_surface',
        original_png_url: null,
        thumbnail_url: thumbnail_url || null,

        // No color recipes (sports uses TPV colors directly)
        blend_recipes: null,
        solid_recipes: null,
        color_mapping: null,
        solid_color_mapping: null,
        solid_color_edits: {},
        blend_color_edits: {},
        final_blend_svg_url: null,
        final_solid_svg_url: null,
        preferred_view_mode: null,
        aspect_ratio_mapping: null,
        job_id: null,

        updated_at: new Date().toISOString()
      };
    } else {
      // Playground design - existing field mapping
      designRecord = {
        user_id: user.id,
        name,
        description: description || null,
        project_id: project_id || null,
        tags: tags || [],
        is_public: is_public || false,

        // Input data
        input_mode: design_data.input_mode,
        prompt: design_data.prompt || null,
        uploaded_file_url: design_data.uploaded_file_url || null,
        dimensions: design_data.dimensions, // JSONB: { widthMM, lengthMM }

        // Generated outputs
        original_svg_url: design_data.original_svg_url,
        original_png_url: design_data.original_png_url || null,
        thumbnail_url: design_data.thumbnail_url || null,

        // Color recipes
        blend_recipes: design_data.blend_recipes || null,
        solid_recipes: design_data.solid_recipes || null,
        color_mapping: design_data.color_mapping || null,
        solid_color_mapping: design_data.solid_color_mapping || null,

        // User edits
        solid_color_edits: design_data.solid_color_edits || {},
        blend_color_edits: design_data.blend_color_edits || {},

        // Final outputs
        final_blend_svg_url: design_data.final_blend_svg_url || null,
        final_solid_svg_url: design_data.final_solid_svg_url || null,
        preferred_view_mode: design_data.preferred_view_mode || 'solid',

        // Aspect ratio
        aspect_ratio_mapping: design_data.aspect_ratio_mapping || null,

        // Link to job
        job_id: design_data.job_id || null,

        updated_at: new Date().toISOString()
      };
    }

    let result;

    if (id) {
      // UPDATE existing design
      // First verify ownership (CRITICAL: IDOR protection)
      const ownedDesign = await ensureOwnership(client, 'saved_designs', id, user.id);

      if (!ownedDesign) {
        return res.status(403).json({
          error: 'Unauthorized: You do not own this design'
        });
      }

      const { data, error } = await client
        .from('saved_designs')
        .update(designRecord)
        .eq('id', id)
        .eq('user_id', user.id) // CRITICAL: Explicit ownership check
        .select()
        .single();

      if (error) throw error;
      result = data;

      console.log(`[SAVE-DESIGN] Updated design ${id} for user ${user.email}`);
    } else {
      // INSERT new design
      designRecord.created_at = new Date().toISOString();
      designRecord.last_opened_at = new Date().toISOString();

      const { data, error } = await client
        .from('saved_designs')
        .insert(designRecord)
        .select()
        .single();

      if (error) throw error;
      result = data;

      console.log(`[SAVE-DESIGN] Created design ${result.id} for user ${user.email}`);
    }

    return res.status(200).json({
      success: true,
      design_id: result.id,
      share_code: result.share_code,
      message: id ? 'Design updated successfully' : 'Design saved successfully'
    });

  } catch (error) {
    console.error('[SAVE-DESIGN ERROR]', {
      message: error.message,
      details: error.stack,
      hint: error.hint || '',
      code: error.code || ''
    });

    return res.status(500).json({
      error: error.message,
      hint: 'Check Vercel function logs for details'
    });
  }
}
