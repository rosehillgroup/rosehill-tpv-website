# Admin Security Setup Documentation

## Overview
The admin page is now protected using password-based authentication with JWT tokens. This provides a secure, simple solution that doesn't rely on deprecated services.

## Security Implementation

### 1. **Password Authentication**
- Single admin password stored as bcrypt hash in environment variables
- JWT tokens issued upon successful authentication
- Tokens expire after 24 hours for security

### 2. **Protected Routes**
- Admin pages check for valid JWT token in localStorage
- Unauthorized users are redirected to `/login`
- Admin page located at `/admin/add-installation.html`

### 3. **Serverless Function Security**
All admin-related serverless functions require:
- Valid JWT token in Authorization header
- Token must not be expired
- All requests without valid tokens return 401 Unauthorized

Protected functions:
- `process-installation-final.js`
- `delete-installation.js`
- `get-installations.js`
- `update-installation.js`
- `admin-auth.js` (handles login)

### 4. **Client-Side Protection**
- JWT token stored in localStorage
- Automatic redirect to login if no token
- Logout clears token and redirects to homepage

## Setup Instructions

### 1. Generate Password Hash
```bash
# Install dependencies locally
cd netlify/functions
npm install

# Go back to root
cd ../..

# Run the password generator
node generate-password-hash.js
```

This will:
- Prompt for your desired admin password
- Generate a bcrypt hash
- Generate a random JWT secret
- Display the environment variables to add

### 2. Add Environment Variables to Netlify
1. Go to your site settings in Netlify
2. Navigate to Site configuration → Environment variables
3. Add these variables:
   - `ADMIN_PASSWORD_HASH` - The bcrypt hash from step 1
   - `JWT_SECRET` - The random secret from step 1
   - Keep existing: `SUPABASE_URL` and `SUPABASE_ANON_KEY`

### 3. Deploy and Test
1. Deploy your site to Netlify
2. Navigate to `/admin/add-installation.html`
3. You should be redirected to `/login`
4. Enter your admin password
5. Upon success, you'll be redirected to the admin panel

## Security Best Practices

### 1. **Password Management**
- Use a strong, unique password (minimum 12 characters)
- Never share the password or commit it to git
- Change password periodically by generating new hash

### 2. **Environment Variables**
- Never commit environment variables to git
- Keep `JWT_SECRET` complex and unique
- Rotate JWT secret if compromised

### 3. **Access Control**
- Limit who knows the admin password
- Monitor access logs in Netlify Functions tab
- Check for unusual login patterns

### 4. **Token Security**
- Tokens expire after 24 hours
- Tokens are only stored in browser localStorage
- Logging out clears the token

## Troubleshooting

### Can't Login
1. Verify password is correct
2. Check browser console for errors
3. Ensure environment variables are set in Netlify
4. Try clearing browser localStorage

### Functions Return 401 Unauthorized
1. Check if logged in (token in localStorage)
2. Token may be expired - login again
3. Verify Authorization header is sent
4. Check function logs in Netlify dashboard

### Password Hash Generation Fails
1. Ensure bcryptjs is installed: `npm install bcryptjs`
2. Run from project root directory
3. Don't use special characters that might break environment variables

## Technical Details

### Authentication Flow
1. User enters password on login page
2. Password sent to `admin-auth` function
3. Function compares with bcrypt hash
4. If valid, JWT token returned
5. Token stored in localStorage
6. All API calls include token in Authorization header

### JWT Token Structure
- Contains: `{ role: 'admin', iat: timestamp }`
- Signed with JWT_SECRET
- Expires in 24 hours
- Standard Bearer token format

### Security Features
- Passwords never stored in plain text
- Bcrypt with salt rounds = 10
- JWT prevents CSRF attacks
- CORS headers configured
- No cookies used (prevents XSS)

## Migration from Netlify Identity
This new system replaces the deprecated Netlify Identity. Benefits:
- No external dependencies
- Simpler implementation
- Full control over authentication
- Works indefinitely without deprecation concerns