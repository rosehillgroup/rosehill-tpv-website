const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const payload = JSON.parse(event.body || '{}');
    const {
      installId,
      files,
      uploaderMeta,
      // Form data from the original submission
      installer_name,
      company_name,
      email,
      phone,
      location_city,
      location_country,
      installation_date,
      project_name,
      project_description,
      tpv_products_used,
      square_meters,
      terms_accepted
    } = payload;

    if (!installId || !Array.isArray(files) || files.length === 0) {
      return { statusCode: 400, body: 'Bad request' };
    }

    // Validate required fields
    if (!installer_name || !email || !terms_accepted) {
      return { statusCode: 400, body: 'Missing required fields' };
    }

    // Create submission record
    const submissionData = {
      installer_name,
      company_name: company_name || null,
      email,
      phone: phone || null,
      location_city: location_city || null,
      location_country: location_country || null,
      installation_date: installation_date || null,
      project_name: project_name || null,
      project_description: project_description || null,
      tpv_products_used: tpv_products_used || [],
      square_meters: square_meters ? parseInt(square_meters) : null,
      files: files.map(f => ({
        bucket: f.bucket,
        path: f.path,
        name: f.name,
        size: f.size
      })),
      terms_accepted: true,
      submission_ip: event.headers['client-ip'] || event.headers['x-forwarded-for'] || null,
      metadata: {
        source: 'qr_code',
        user_agent: uploaderMeta?.userAgent || event.headers['user-agent'] || null,
        upload_count: files.length,
        install_id: installId
      }
    };

    const { data: submission, error } = await supabase
      .from('photo_submissions')
      .insert([submissionData])
      .select()
      .single();

    if (error) {
      return { statusCode: 500, body: `DB error: ${error.message}` };
    }

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        success: true,
        submission_id: submission.id,
        message: 'Submission recorded successfully'
      })
    };
  } catch (err) {
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
};