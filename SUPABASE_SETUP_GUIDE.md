# Supabase Setup Guide for Rosehill TPV Admin

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Fill in:
   - **Name**: Rosehill TPV
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for setup

## Step 2: Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the entire contents of `supabase-setup.sql`
4. Click **"Run"** to execute the SQL
5. You should see success messages

## Step 3: Get API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **Project API Key** (anon/public key)

## Step 4: Configure Netlify Environment Variables

1. Go to your Netlify dashboard
2. Click on your site (rosehilltpv)
3. Go to **Site settings** → **Environment variables**
4. Add these variables:
   - **SUPABASE_URL**: Paste your Project URL
   - **SUPABASE_ANON_KEY**: Paste your API Key
5. Click **"Save"**

## Step 5: Deploy Updated Code

1. The code is ready to commit and push
2. Netlify will automatically redeploy with the new functionality

## Step 6: Test Admin Functionality

1. Go to `https://rosehilltpv.netlify.app/admin-add-installation.html`
2. Fill out a test installation
3. Upload some images
4. Submit the form
5. Check Supabase dashboard to see the new data

## What This Gives You

- ✅ **Cloud Database**: All installations stored securely
- ✅ **Image Storage**: Images uploaded to Supabase Storage
- ✅ **Automatic Backups**: Supabase handles all backups
- ✅ **Scalable**: Can handle thousands of installations
- ✅ **Admin Interface**: Easy form for adding installations
- ✅ **Real-time**: Changes appear immediately

## Troubleshooting

- **"Database not configured"**: Environment variables not set correctly
- **Upload fails**: Check storage bucket permissions
- **Function errors**: Check Netlify function logs

## Future Enhancements

- Edit existing installations
- Delete installations
- Image management
- User authentication for admin access
- Bulk upload capabilities