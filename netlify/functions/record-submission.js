const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rosehilltpv.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// Configure SendGrid
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// Email notification function
async function sendNewSubmissionNotification(submissionData, submissionId) {
  if (!SENDGRID_API_KEY) {
    console.log('SendGrid not configured, skipping email notification');
    return;
  }

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

    const emailContent = {
      to: ADMIN_EMAIL,
      from: {
        email: 'noreply@rosehilltpv.com',
        name: 'TPV Photo Submissions'
      },
      subject: `New TPV Photo Submission${project_name ? ` - ${project_name}` : ''}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
            <h1 style="margin: 0 0 10px 0; font-size: 24px;">📷 New Photo Submission</h1>
            <p style="margin: 0; opacity: 0.9;">A new TPV installation photo submission has been received</p>
          </div>

          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1a365d; margin: 0 0 20px 0; font-size: 18px;">Submission Details</h2>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 500; width: 140px;">Installer:</td>
                <td style="padding: 8px 0; color: #1e293b;">${installer_name}${company_name ? ` (${company_name})` : ''}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Email:</td>
                <td style="padding: 8px 0; color: #1e293b;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Project:</td>
                <td style="padding: 8px 0; color: #1e293b;">${project_name || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Location:</td>
                <td style="padding: 8px 0; color: #1e293b;">${location}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Install Date:</td>
                <td style="padding: 8px 0; color: #1e293b;">${installDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Photos:</td>
                <td style="padding: 8px 0; color: #1e293b;"><strong>${photoCount} uploaded</strong></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Submission ID:</td>
                <td style="padding: 8px 0; color: #64748b; font-family: monospace; font-size: 12px;">${submissionId}</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin-bottom: 20px;">
            <a href="https://tpv.rosehill.group/admin/photo-moderation.html"
               style="display: inline-block; background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
              Review & Approve Photos
            </a>
          </div>

          <div style="text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            <p style="margin: 0;">This is an automated notification from the TPV Photo Submission System</p>
          </div>
        </div>
      `,
      text: `
New TPV Photo Submission Received

Installer: ${installer_name}${company_name ? ` (${company_name})` : ''}
Email: ${email}
Project: ${project_name || 'Not specified'}
Location: ${location}
Installation Date: ${installDate}
Photos: ${photoCount} uploaded
Submission ID: ${submissionId}

Review and approve: https://tpv.rosehill.group/admin/photo-moderation.html
      `.trim()
    };

    await sgMail.send(emailContent);
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Failed to send email notification:', error);
    // Don't fail the entire submission if email fails
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