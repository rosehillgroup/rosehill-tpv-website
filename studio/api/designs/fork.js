// TPV Studio - Fork Design (Vercel)
// Creates a copy of a design under the current user's account
// Used by admins to create their own copy when editing another user's design

import { getAuthenticatedClient, getSupabaseServiceClient } from '../_utils/supabase.js';
import { isAdmin } from '../_utils/admin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authenticated client and user
    const { client, user } = await getAuthenticatedClient(req);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - please sign in' });
    }

    const { source_design_id } = req.body;

    if (!source_design_id) {
      return res.status(400).json({ error: 'source_design_id is required' });
    }

    // Fetch the source design
    // First try with user's own client (for their own designs)
    let sourceDesign;
    const { data: ownedDesign, error: ownedError } = await client
      .from('saved_designs')
      .select('*')
      .eq('id', source_design_id)
      .eq('user_id', user.id)
      .single();

    if (ownedDesign) {
      // User owns this design - can fork their own
      sourceDesign = ownedDesign;
    } else {
      // Check if user is admin - admins can fork any design
      const userIsAdmin = await isAdmin(user.id);

      if (!userIsAdmin) {
        return res.status(403).json({ error: 'You do not have permission to fork this design' });
      }

      // Use service client to fetch any design
      const serviceClient = getSupabaseServiceClient();
      const { data: adminDesign, error: adminError } = await serviceClient
        .from('saved_designs')
        .select('*')
        .eq('id', source_design_id)
        .single();

      if (adminError || !adminDesign) {
        return res.status(404).json({ error: 'Source design not found' });
      }

      sourceDesign = adminDesign;
    }

    // Get original owner email for the name
    let originalOwnerEmail = 'unknown';
    if (sourceDesign.user_id && sourceDesign.user_id !== user.id) {
      const serviceClient = getSupabaseServiceClient();
      const { data: ownerData } = await serviceClient.auth.admin.getUserById(sourceDesign.user_id);
      originalOwnerEmail = ownerData?.user?.email?.split('@')[0] || 'unknown';
    }

    // Create the forked design record
    const now = new Date().toISOString();
    const forkedName = sourceDesign.user_id === user.id
      ? `${sourceDesign.name} (Copy)`
      : `${sourceDesign.name} (from ${originalOwnerEmail})`;

    const forkedDesign = {
      // New ownership
      user_id: user.id,

      // Update name to indicate it's a copy
      name: forkedName,
      description: sourceDesign.description,

      // Copy all design data
      project_id: null, // Don't copy project association
      tags: sourceDesign.tags || [],
      is_public: false, // Forked designs start private

      input_mode: sourceDesign.input_mode,
      prompt: sourceDesign.prompt,
      uploaded_file_url: sourceDesign.uploaded_file_url,
      dimensions: sourceDesign.dimensions,

      original_svg_url: sourceDesign.original_svg_url,
      original_png_url: sourceDesign.original_png_url,
      thumbnail_url: sourceDesign.thumbnail_url,

      blend_recipes: sourceDesign.blend_recipes,
      solid_recipes: sourceDesign.solid_recipes,
      color_mapping: sourceDesign.color_mapping,
      solid_color_mapping: sourceDesign.solid_color_mapping,

      solid_color_edits: sourceDesign.solid_color_edits,
      blend_color_edits: sourceDesign.blend_color_edits,

      final_blend_svg_url: sourceDesign.final_blend_svg_url,
      final_solid_svg_url: sourceDesign.final_solid_svg_url,
      preferred_view_mode: sourceDesign.preferred_view_mode,

      aspect_ratio_mapping: sourceDesign.aspect_ratio_mapping,
      job_id: sourceDesign.job_id,
      design_data: sourceDesign.design_data,

      // New timestamps
      created_at: now,
      updated_at: now,
      last_opened_at: now
    };

    // Insert the forked design
    const { data: newDesign, error: insertError } = await client
      .from('saved_designs')
      .insert(forkedDesign)
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    console.log(`[FORK-DESIGN] User ${user.email} forked design ${source_design_id} -> ${newDesign.id}`);

    return res.status(200).json({
      success: true,
      design: newDesign,
      message: 'Design forked successfully'
    });

  } catch (error) {
    console.error('[FORK-DESIGN ERROR]', {
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
