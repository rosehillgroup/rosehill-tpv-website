# Auth0 Dashboard Configuration Checklist

**Complete this checklist in your Auth0 dashboard before testing the admin system.**

---

## 🔧 API Configuration

### Your TPV Admin API Settings
**Location:** Auth0 Dashboard → Applications → APIs → **[your TPV Admin API]**

- [ ] **RBAC (Role-Based Access Control)** = **ON**
- [ ] **Add Permissions in the Access Token** = **ON**
- [ ] **Allow Offline Access** = **OFF** (not needed for this use case)
- [ ] **Token Expiration** = **86400** (24 hours) or your preferred duration

**API Identifier:** Should be something like `https://tpv-api` (this becomes your `AUTH0_AUDIENCE`)

---

## 🎭 Roles & Users

### Create Editor Role
**Location:** Auth0 Dashboard → User Management → Roles

- [ ] **Create Role:**
  - **Name:** `editor`
  - **Description:** `TPV Installation Manager - Full Edit Access`

### Create Admin User  
**Location:** Auth0 Dashboard → User Management → Users

- [ ] **Create User** (or invite existing)
- [ ] **Assign Role:** Click user → Roles tab → Assign `editor` role
- [ ] **Verify Email** (if using email/password)

---

## ⚙️ Application Configuration

### Your SPA Application Settings
**Location:** Auth0 Dashboard → Applications → Applications → **[your SPA app]**

**Application Type:** Should be **Single Page Application**

#### URLs Configuration
- [ ] **Allowed Callback URLs:**
  ```
  https://tpv.rosehill.group/admin/test.html,
  https://tpv.rosehill.group/admin/login.html,
  https://tpv.rosehill.group/admin/,
  https://your-preview.netlify.app/admin/test.html
  ```

- [ ] **Allowed Logout URLs:**
  ```
  https://tpv.rosehill.group,
  https://tpv.rosehill.group/admin/login.html,
  https://your-preview.netlify.app
  ```

- [ ] **Allowed Web Origins:**
  ```
  https://tpv.rosehill.group,
  https://your-preview.netlify.app
  ```

- [ ] **Allowed Origins (CORS):**
  ```
  https://tpv.rosehill.group,
  https://your-preview.netlify.app
  ```

#### Advanced Settings
- [ ] **Token Endpoint Authentication Method:** `None` (for SPA)
- [ ] **Grant Types:** `authorization_code`, `refresh_token`

---

## 🔗 Actions & Rules

### Post-Login Action (CRITICAL)
**Location:** Auth0 Dashboard → Actions → Flows → Login

- [ ] **Create Action** called "Add Roles Claim" with this code:
```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://tpv.rosehill.group/roles';
  
  if (event.authorization) {
    // Add roles to the access token
    api.accessToken.setCustomClaim(namespace, event.authorization.roles);
  }
};
```

- [ ] **Deploy Action** (click Deploy button)
- [ ] **Add to Login Flow** (drag from Library to the flow)
- [ ] **Verify Action is Active** (should show in the flow diagram)

---

## 🧪 Test Your Configuration

### Quick Auth0 Dashboard Tests

1. **Test Login Flow:**
   - Applications → Applications → [Your SPA] → **Test** tab
   - Should open Auth0 Universal Login

2. **Verify Token Claims:**
   - Go to [jwt.io](https://jwt.io) 
   - Paste a token from your test
   - Should see `https://tpv.rosehill.group/roles: ["editor"]` in payload

3. **Check User Profile:**
   - User Management → Users → [Your User]
   - Should show `editor` role assigned

---

## 🚨 Common Configuration Issues

### RBAC Not Working
**Symptoms:** Token doesn't contain roles claim  
**Fix:** Ensure API has RBAC=ON and "Add Permissions in Access Token"=ON

### Callback Errors  
**Symptoms:** Login redirects to error page  
**Fix:** Add your admin URLs to Allowed Callback URLs in SPA settings

### CORS Errors
**Symptoms:** Browser console shows CORS errors  
**Fix:** Add your domain to Allowed Web Origins and Allowed Origins (CORS)

### "Invalid Audience" Error
**Symptoms:** JWT verification fails with audience error  
**Fix:** Ensure `AUTH0_AUDIENCE` matches your API Identifier exactly

### Roles Empty in Token
**Symptoms:** `whoami` function shows `roles: []`  
**Fix:** Verify Post-Login Action is deployed and in the flow

---

## ✅ Verification Steps

Once configured, test in this order:

1. **Visit** `/admin/test.html`
2. **Complete all 6 steps** successfully  
3. **Verify** whoami response shows your user with `["editor"]` roles
4. **Check** decoded token contains the custom roles claim

### Expected Success Output:
```json
{
  "message": "Authentication successful",
  "user": {
    "sub": "auth0|1234567890",
    "email": "admin@example.com", 
    "roles": ["editor"],
    "aud": ["https://tpv-api"],
    "iss": "https://your-tenant.auth0.com/"
  }
}
```

---

## 📞 If You Need Help

### Auth0 Dashboard
- Check **Logs** → **Logs** for authentication errors
- Review **Monitoring** → **Logs** for API call failures

### Netlify Dashboard  
- Check **Functions** → **[function name]** → **Function logs**
- Verify **Environment variables** are populated by Auth0 extension

### Browser DevTools
- Console tab shows Auth0 SDK errors
- Network tab shows API call failures with detailed responses

---

**Once this checklist is complete, your Auth0 authentication should work perfectly! 🎯**