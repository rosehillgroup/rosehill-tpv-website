// Simple email notification function using fetch to external service
exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);

    // Use a simple email service like Formspree or EmailJS
    // For now, let's use a webhook approach that can trigger email services

    const emailData = {
      to: process.env.ASSISTANT_EMAIL || 'assistant@rosehilltpv.com',
      subject: `New TPV Photo Submission${data.project_name ? ` - ${data.project_name}` : ''}`,
      message: `
🔔 New Photo Submission Received

📧 Installer: ${data.installer_name}${data.company_name ? ` (${data.company_name})` : ''}
👤 Email: ${data.email}
📍 Location: ${data.location}
🏗️ Project: ${data.project_name || 'Not specified'}
📅 Install Date: ${data.installation_date}
📷 Photos: ${data.photo_count} uploaded
🆔 Submission ID: ${data.submission_id}

Review and approve: https://tpv.rosehill.group/admin/photo-moderation.html

This submission is ready for review in the admin interface.
      `.trim()
    };

    // Use Zapier webhook or similar service
    const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;

    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        console.log('Email notification sent via webhook');
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, message: 'Email sent' })
        };
      } else {
        throw new Error(`Webhook failed: ${response.status}`);
      }
    } else {
      // Fallback: just log the email content
      console.log('📧 EMAIL NOTIFICATION:');
      console.log('To:', emailData.to);
      console.log('Subject:', emailData.subject);
      console.log('Message:');
      console.log(emailData.message);

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Logged for manual sending' })
      };
    }

  } catch (error) {
    console.error('Email notification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};