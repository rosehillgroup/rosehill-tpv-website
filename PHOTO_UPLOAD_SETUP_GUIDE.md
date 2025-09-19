# TPV Photo Upload System - Setup Guide

## Overview
This system allows TPV installers to upload photos via QR codes on product bags. Photos are moderated by admins and displayed on the website.

## System Components

### 1. Public Upload Page (`/photos.html`)
- Mobile-optimized form for installers
- Accessed via QR codes on TPV bags
- Collects installer info, project details, and photos
- URL: `https://yourdomain.com/photos`

### 2. Admin Moderation Interface (`/admin-photos.html`)
- Review pending photo submissions
- Approve, reject, or feature photos
- View submission statistics
- URL: `https://yourdomain.com/admin-photos.html`

### 3. Community Gallery
- Displays approved photos on `/installations.html`
- Shows featured submissions prominently
- Includes installer attribution

## Setup Instructions

### Step 1: Set Up Supabase

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up with GitHub or email
   - Create a new project named "Rosehill TPV"

2. **Run Database Setup**
   - Go to SQL Editor in Supabase dashboard
   - Create new query
   - Copy entire contents of `supabase-photos-setup.sql`
   - Run the query

3. **Get API Keys**
   - Go to Settings → API
   - Copy your Project URL
   - Copy your anon/public key

### Step 2: Configure Netlify Environment

1. **Add Environment Variables**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add:
     - `SUPABASE_URL`: Your Project URL
     - `SUPABASE_ANON_KEY`: Your API Key

2. **Install Dependencies**
   - The Netlify functions need these packages
   - Already configured in `netlify/functions/package.json`
   - Netlify will install automatically on deploy

### Step 3: Deploy the System

1. **Commit and Push**
   ```bash
   git add .
   git commit -m "Add TPV photo upload system"
   git push
   ```

2. **Netlify Auto-Deploy**
   - Netlify will automatically build and deploy
   - Functions will be available at `/.netlify/functions/`

### Step 4: Generate QR Codes

1. **Create QR Code**
   - URL: `https://yourdomain.com/photos`
   - Optional tracking: `https://yourdomain.com/photos?source=bag&batch=2025Q1`

2. **QR Code Tools**
   - [QR Code Generator](https://www.qr-code-generator.com/)
   - [QR Code Monkey](https://www.qrcode-monkey.com/)
   - Include your logo for branding

### Step 5: Test the System

1. **Test Upload Flow**
   - Scan QR code on mobile
   - Fill form and upload test photos
   - Check Supabase dashboard for submission

2. **Test Admin Interface**
   - Go to `/admin-photos.html`
   - Review test submission
   - Approve/reject photos

3. **Verify Display**
   - Check `/installations.html`
   - Look for "Community Installations" section
   - Confirm approved photos appear

## File Structure

```
tpv_2025_deploy/
├── photos.html                    # Upload page (QR destination)
├── admin-photos.html              # Admin moderation interface
├── installations.html             # Updated with community gallery
├── js/
│   └── photo-upload.js           # Upload form logic
├── netlify/functions/
│   ├── photo-upload.js           # Handles uploads
│   ├── photos-admin.js           # Admin API
│   └── photos-get.js             # Public photos API
└── supabase-photos-setup.sql     # Database schema
```

## API Endpoints

### Upload Photos
- **POST** `/.netlify/functions/photo-upload`
- Accepts multipart form data
- Returns submission ID

### Get Approved Photos
- **GET** `/.netlify/functions/photos-get`
- Query params: `limit`, `offset`, `featured`
- Returns paginated photos

### Admin Operations
- **GET** `/.netlify/functions/photos-admin` - Get all submissions
- **POST** `/.netlify/functions/photos-admin` - Update status

## Security Features

- File size limit: 5MB per image
- Allowed formats: JPEG, PNG, WebP
- Rate limiting on uploads
- Terms acceptance required
- Admin-only moderation

## Customization Options

### Modify Upload Form
Edit `/photos.html` to:
- Add/remove form fields
- Change styling
- Update terms text

### Adjust Display
Edit `/installations.html` to:
- Change grid layout
- Modify photo card design
- Adjust pagination

### Email Notifications
Add email alerts in `/netlify/functions/photo-upload.js`:
```javascript
// Send notification email
await sendNotificationEmail(submissionData);
```

## Troubleshooting

### Photos Not Uploading
- Check Supabase environment variables
- Verify storage bucket exists
- Check file size and format

### Admin Interface Not Loading
- Confirm Supabase connection
- Check browser console for errors
- Verify API endpoints

### Photos Not Displaying
- Ensure photos are approved
- Check API response
- Verify public view permissions

## Maintenance

### Regular Tasks
- Review pending submissions weekly
- Monitor storage usage in Supabase
- Check for inappropriate content

### Storage Management
- Supabase free tier: 1GB storage
- Consider image optimization
- Archive old submissions

## Support

For issues or questions:
1. Check Supabase logs
2. Review Netlify function logs
3. Test with browser developer tools

## Next Steps

Consider adding:
- Email notifications for new submissions
- Bulk approval actions
- Instagram/social media integration
- Automatic image optimization
- Analytics tracking