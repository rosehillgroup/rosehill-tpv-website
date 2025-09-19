const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// Netlify Form notification function
async function sendNewSubmissionNotification(submissionData, submissionId) {
  try {
    const {
      installer_name,
      company_name,
      email,
      project_name,
      location_city,
      location_country,
      installation_date,
      photo_urls,
      metadata
    } = submissionData;

    const photoCount = photo_urls?.length || metadata?.upload_count || 0;
    const location = [location_city, location_country].filter(Boolean).join(', ') || 'Not specified';
    const installDate = installation_date ? new Date(installation_date).toLocaleDateString('en-GB') : 'Not specified';

    // Submit to Netlify form for email notification
    const formData = new URLSearchParams({
      'form-name': 'photo-submission-alert',
      'submission_id': submissionId,
      'installer_name': installer_name,
      'company_name': company_name || '',
      'email': email,
      'project_name': project_name || '',
      'location': location,
      'installation_date': installDate,
      'photo_count': photoCount,
      'admin_link': 'https://tpv.rosehill.group/admin/photo-moderation.html'
    });

    const response = await fetch('https://tpv.rosehill.group/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    if (response.ok) {
      console.log('Netlify form notification sent successfully');
    } else {
      console.error('Failed to send Netlify form notification:', response.status);
    }
  } catch (error) {
    console.error('Failed to send notification:', error);
    // Don't fail the entire submission if notification fails
  }
}

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
      photo_urls: files.map(f => `${f.bucket}/${f.path}`),
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

    // Send email notification (don't wait for it to complete)
    sendNewSubmissionNotification(submissionData, submission.id).catch(err => {
      console.error('Email notification failed:', err);
    });

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