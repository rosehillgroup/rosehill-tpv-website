# Environment Variables Configuration

This document lists all environment variables required for the Rosehill TPV system.

## Netlify Environment Variables

Add these in your Netlify dashboard under Site Settings → Environment Variables:

### Required for Core Functionality

```bash
# Sanity Configuration
SANITY_PROJECT_ID=68ola3dd
SANITY_DATASET=production
SANITY_TOKEN=<your_write_token>  # Must have write access to dataset and assets

# DeepL Translation
DEEPL_KEY=<your_deepl_api_key>  # Your DeepL API key

# Auth0 Configuration (populated automatically by Auth0 extension)
AUTH0_ISSUER_BASE_URL=<your_auth0_domain>  # e.g. https://your-tenant.auth0.com
AUTH0_AUDIENCE=<your_api_identifier>        # e.g. https://tpv-api
AUTH0_CLIENT_ID=<your_spa_client_id>       # For browser authentication
AUTH0_CLIENT_SECRET=<your_client_secret>   # For server-side operations

# Optional Security
ALLOWED_ORIGIN=https://tpv.rosehill.group  # Optional: restrict function access to this origin
```

### Sanity Token Requirements

The `SANITY_TOKEN` must have these permissions:
- **Dataset**: Read and write access
- **Assets**: Upload and manage images
- **Document types**: Access to `installation` type

To create a token:
1. Go to sanity.io/manage
2. Select your project
3. Go to API → Tokens
4. Create new token with "Editor" permissions
5. Copy the token (you won't see it again)

### DeepL API Key

To get a DeepL API key:
1. Sign up at deepl.com/pro
2. Go to Account → API Keys
3. Create a new key
4. Copy the key

### Auth0 Setup (via Netlify Extension)

1. Go to your Netlify site dashboard
2. Navigate to Integrations
3. Search for "Auth0" and install the extension
4. Follow the setup wizard to create/connect Auth0 tenant
5. In Auth0 dashboard:
   - Create "editor" role under User Management → Roles
   - Create users and assign "editor" role
   - Configure custom claim for roles: `https://tpv.rosehill.group/roles`
6. The extension will automatically populate environment variables

### Sanity CORS Configuration

Add these origins in your Sanity project settings:
1. Go to sanity.io/manage
2. Select your project
3. Go to API → CORS origins
4. Add:
   - `https://tpv.rosehill.group`
   - `https://*.netlify.app` (for preview deploys)
   - `http://localhost:3000` (for local development)

### Dataset Access

Choose one approach:

#### Option 1: Public Read (Recommended for simplicity)
1. Go to sanity.io/manage → your project → API
2. Set dataset to "Public"
3. Public pages can query directly

#### Option 2: Private Dataset with Proxy
1. Keep dataset private
2. Create a read proxy function in `/netlify/functions/sanity-read.js`
3. Update public pages to query through the proxy

## Local Development

For local development, create a `.env` file:

```bash
# DO NOT COMMIT THIS FILE
SANITY_PROJECT_ID=68ola3dd
SANITY_DATASET=production
SANITY_TOKEN=your_token_here
DEEPL_KEY=your_deepl_key_here
ALLOWED_ORIGIN=http://localhost:8888
```

## Security Notes

- Never commit tokens to version control
- Use Netlify's environment variables for production
- Rotate tokens regularly
- Use minimal permissions (principle of least privilege)
- Monitor usage in both Sanity and DeepL dashboards