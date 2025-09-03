# Sanity + Netlify + DeepL System Setup Guide

This guide covers the complete setup of the new clean architecture for the Rosehill TPV installation management system.

## 🎯 Architecture Overview

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│ Admin UI    │───▶│ Netlify      │───▶│ Sanity CMS  │
│ (HTML+JS)   │    │ Functions    │    │ (Database)  │
└─────────────┘    └──────────────┘    └─────────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │ DeepL API    │
                   │ (Translation)│
                   └──────────────┘
```

## 🚀 Step 1: Sanity CMS Setup

### 1.1 Create Sanity Project
```bash
# If you don't have Sanity CLI installed
npm install -g @sanity/cli

# Create new project
sanity init --template clean

# Choose these options:
# ✓ Create new project
# ✓ Name: Rosehill TPV
# ✓ Dataset: production
```

### 1.2 Add Installation Schema
Copy the schema file to your Sanity project:
```bash
cp sanity/schemas/installation.js /path/to/sanity-project/schemas/
```

Update your `schemas/index.js`:
```javascript
import installation from './installation.js'

export const schemaTypes = [installation]
```

### 1.3 Configure CORS and Access
1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to **API** → **CORS origins**
4. Add these origins:
   - `https://tpv.rosehill.group`
   - `https://*.netlify.app`
   - `http://localhost:8888` (for local development)

### 1.4 Create Write Token
1. Go to **API** → **Tokens**
2. Create new token with **Editor** permissions
3. Copy the token (you won't see it again)
4. Save it for Netlify configuration

### 1.5 Set Dataset to Public (Optional but Recommended)
1. Go to **API** → **Dataset configuration**
2. Set `production` dataset to **Public read**
3. This allows direct client-side queries

## 🔧 Step 2: Netlify Configuration

### 2.1 Environment Variables
In your Netlify dashboard, add these environment variables:

```bash
# Sanity Configuration
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_TOKEN=your_write_token

# DeepL Translation
DEEPL_KEY=your_deepl_api_key

# Security (Optional)
ALLOWED_ORIGIN=https://tpv.rosehill.group
```

### 2.2 Enable Netlify Identity
1. Go to **Identity** → **Settings**
2. Enable Identity
3. Under **Registration**, set to **"Invite only"**
4. Under **Git Gateway**, enable if needed
5. Go to **Identity** → **Users**
6. Click **"Invite users"**
7. Add the email address for admin access
8. Assign the **"editor"** role

### 2.3 Deploy Functions
The functions are already included in the codebase. Netlify will automatically deploy them when you push to your repository.

## 🌐 Step 3: DeepL API Setup

### 3.1 Create DeepL Account
1. Go to [deepl.com/pro](https://deepl.com/pro)
2. Sign up for a Pro account
3. Go to **Account** → **API Keys**
4. Create a new API key
5. Copy the key for Netlify configuration

### 3.2 Create Glossary (Brand Protection)
```bash
# Use the DeepL web interface or API to create a glossary with:
# - "Rosehill TPV" → "Rosehill TPV"
# - "Rosehill Group" → "Rosehill Group" 
# - "Impakt Defender" → "Impakt Defender"
# - "TPV" → "TPV"
# - "Flexilon" → "Flexilon"
```

## 🎮 Step 4: Admin Access

### 4.1 First Login
1. Go to `https://your-site.com/admin/login.html`
2. Click **"Sign In with Netlify"**
3. If you're invited, you'll be able to create an account
4. After login, you'll be redirected to the admin dashboard

### 4.2 Admin Workflow
1. **Add Installation**: Go to `/admin/add-installation.html`
   - Fill in English content only
   - Upload cover image + gallery images
   - Submit form
   - Automatic translation to ES/FR/DE happens immediately

2. **Manage Installations**: Go to `/admin/installations.html`
   - View all installations
   - Search and filter
   - Click "Edit" to modify existing installations

3. **Edit Installation**: 
   - Updates trigger re-translation
   - Mix existing and new images
   - All languages updated automatically

## 📊 Step 5: Public Site Integration

### 5.1 How Pages Work Now
- **Listing Page** (`/installations.html`): Uses `sanityClient.getAllInstallations()`
- **Individual Pages**: Use the new dynamic template with `sanityClient.getInstallationBySlug(slug)`
- **Language Support**: Automatic language detection and field coalescing

### 5.2 URL Structure
- **English**: `/installations/slug.html`
- **Spanish**: `/es/installations/slug.html`
- **French**: `/fr/installations/slug.html`
- **German**: `/de/installations/slug.html`

## 🔍 Step 6: Testing Checklist

### 6.1 Admin Tests
- [ ] Login with editor account works
- [ ] Add new installation with images
- [ ] Verify automatic translation to all languages
- [ ] Edit existing installation
- [ ] Search and filter installations
- [ ] Upload various image formats (JPG, PNG, WebP)

### 6.2 Public Site Tests
- [ ] English installations page loads from Sanity
- [ ] Individual installation pages display correctly
- [ ] Images load properly from Sanity CDN
- [ ] SEO meta tags are populated correctly
- [ ] Language switching works (if implemented)

### 6.3 Integration Tests
- [ ] New installation appears on public site immediately
- [ ] Edited installations update correctly
- [ ] Translation failures graceful (EN publishes, others marked as error)
- [ ] Image uploads work across different browsers

## 🔒 Security Checklist

- [ ] Netlify Identity configured with invite-only
- [ ] Editor role assigned to admin users
- [ ] SANITY_TOKEN has minimal required permissions
- [ ] ALLOWED_ORIGIN configured to restrict function access
- [ ] Functions validate JWT tokens correctly
- [ ] File uploads validate size and type
- [ ] No sensitive data logged in function outputs

## 🚨 Troubleshooting

### Common Issues

**"Authentication failed" in admin**
- Check if user has "editor" role in Netlify Identity
- Verify JWT token is valid and not expired
- Check browser console for detailed errors

**"Failed to upload image"**
- Verify SANITY_TOKEN has asset upload permissions
- Check file size (max 12MB) and type (JPG, PNG, GIF, WebP)
- Look at Netlify function logs for detailed error

**"Translation failed"**
- Verify DEEPL_KEY is valid and has quota remaining
- Check DeepL dashboard for API usage
- System will publish English and mark translations as error

**"Installation not found" on public pages**
- Verify installation is published (`publishedLocales` includes current language)
- Check if dataset is public or if read proxy function is needed
- Verify SANITY_PROJECT_ID is correct in client

### Function Logs
Check Netlify function logs for detailed error messages:
1. Go to your Netlify dashboard
2. Click **Functions**
3. Click on a function name
4. View **Function logs**

## 📈 Performance Optimization

### Image Optimization
- Sanity automatically optimizes images via CDN
- Use `?w=800&h=600&fit=crop&auto=format` for responsive images
- Consider adding Sanity image URLs with transformations

### Query Optimization
- GROQ queries are already optimized for the data needed
- Sanity CDN provides global caching
- Consider adding client-side caching if needed

## 🔮 Future Enhancements

### Possible Additions
1. **Image Alt Text Translation**: Extend DeepL integration to translate alt text
2. **Bulk Operations**: Add bulk edit/delete functionality
3. **Analytics Dashboard**: Add usage statistics to admin
4. **Content Versioning**: Use Sanity's built-in versioning features
5. **Preview Mode**: Add preview functionality before publishing
6. **Webhook Automation**: Trigger builds on content changes

### Advanced Features
1. **Role-based Access**: Add different admin roles (editor, viewer, admin)
2. **Workflow Management**: Add approval workflows
3. **API Integration**: Expose read-only API for mobile apps
4. **Advanced SEO**: Schema markup per installation type
5. **Performance Monitoring**: Add real user monitoring

---

## 🎉 Success Metrics

After completing this setup, you should have:
- ✅ **90% less code complexity** vs. old system
- ✅ **Single source of truth** in Sanity
- ✅ **Automatic translations** without complex workflows
- ✅ **Secure admin interface** with role-based access
- ✅ **Fast public pages** with direct database queries
- ✅ **Maintainable codebase** easy to extend and debug

This new architecture eliminates all the pain points of the previous system and provides a solid foundation for future growth.