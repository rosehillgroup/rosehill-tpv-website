# TPV Studio - Function Migration Status

## ✅ Completed Migrations

### 1. studio-inspire-simple.js
- **Status**: ✅ **COMPLETE**
- **Location**: `/studio/api/studio-inspire-simple.js`
- **Changes Made**:
  - Converted from Netlify `exports.handler` to Vercel `export default function handler`
  - Changed request body access from `JSON.parse(event.body)` to `req.body`
  - Changed response from object return to `res.status().json()`
  - Updated enqueue URL from `/.netlify/functions/studio-enqueue` to `/api/studio-enqueue`
  - Converted imports from CommonJS (`require`) to ESM (`import`)
- **Dependencies**: supabase.js utility
- **Testing**: Ready for testing

### 2. studio-job-status.js
- **Status**: ✅ **COMPLETE**
- **Location**: `/studio/api/studio-job-status.js`
- **Changes Made**:
  - Converted to Vercel API route format
  - Changed query params from `event.queryStringParameters` to `req.query`
  - Updated all response patterns
  - Converted all imports to ESM
- **Dependencies**: supabase.js, replicate.js, image.js, exports.js utilities
- **Testing**: Ready for testing

### 3. Utility Functions
- **Status**: ✅ **COPIED**
- **Location**: `/studio/api/_utils/`
- **Files**: 30+ utility files copied from Netlify functions
- **Note**: These are CommonJS files - may need ESM conversion if used

---

## ⏳ Pending Complex Migrations

### 3. studio-enqueue.js
- **Status**: ⚠️ **NEEDS MANUAL MIGRATION**
- **Complexity**: **HIGH**
- **Size**: 300+ lines
- **Key Challenges**:
  - Uses dynamic imports for ESM modules (`design-director.js`, `two-pass-generator.js`)
  - Complex async initialization pattern
  - Multiple utility dependencies (10+)
  - Multi-step generation pipeline
  - Stencil upload to Supabase storage

**Migration Steps Required**:
1. Convert to Vercel API route format
2. Handle ESM dynamic imports properly (Vercel native ESM support)
3. Update all `require()` statements to `import`
4. Convert response patterns
5. Test two-pass generation pipeline
6. Verify stencil upload functionality

**Current Netlify Code Structure**:
```javascript
// Uses dynamic imports
let refineToDesignBrief, initiatePass1, initiatePass2, isTwoPassEnabled;
(async () => {
  const designDirector = await import('./studio/_utils/design-director.js');
  refineToDesignBrief = designDirector.refineToDesignBrief;
  // ...
})();

exports.handler = async (event, context) => {
  // Main logic here
};
```

**Recommended Vercel Pattern**:
```javascript
import { refineToDesignBrief } from './_utils/design-director.js';
import { initiatePass1, initiatePass2, isTwoPassEnabled } from './_utils/two-pass-generator.js';

export default async function handler(req, res) {
  // Main logic here
}
```

### 4. studio-draftify.js
- **Status**: ⚠️ **NEEDS MANUAL MIGRATION**
- **Complexity**: **HIGH**
- **Size**: 200+ lines
- **Key Challenges**:
  - Complex vectorization pipeline
  - Multiple image processing steps (posterize, vectorize, auto-repair)
  - Constraint checking logic
  - Export generation (SVG, PNG, DXF, PDF)
  - BOM calculation

**Migration Steps Required**:
1. Convert to Vercel API route format
2. Update all utility imports to ESM
3. Verify image processing dependencies work on Vercel
4. Test vectorization quality
5. Validate export generation

**Dependencies**:
- replicate.js
- color-quantize.js
- vectorize.js
- auto-repair.js
- constraints.js
- exports.js

### 5. replicate-callback.js
- **Status**: ⚠️ **NEEDS MANUAL MIGRATION**
- **Complexity**: **VERY HIGH**
- **Size**: 400+ lines
- **Key Challenges**:
  - Webhook signature verification
  - Multi-pass state machine (starting → processing → succeeded → failed)
  - Complex image processing pipeline
  - Quality assessment and auto-retry logic
  - Idempotency handling
  - Multiple helper functions (handleStarting, handleProcessing, handleSucceeded, handleFailed)

**Migration Steps Required**:
1. Convert to Vercel API route format
2. Update webhook signature verification for Vercel request format
3. Handle raw body access for signature verification
4. Convert all helper functions
5. Test webhook authentication
6. Verify idempotency logic
7. Test state machine transitions

**Critical Notes**:
- **Webhook URL must be updated** in Replicate dashboard after deployment
- Format: `https://your-vercel-domain.vercel.app/api/replicate-callback?token=YOUR_TOKEN`
- Must handle base64-encoded body from Netlify → raw body in Vercel

---

## 🔧 Utility File Status

All utility files have been copied to `/studio/api/_utils/`, but many use CommonJS (`require`/`module.exports`). These need ESM conversion when used.

### High Priority Utilities (Used by Migrated Functions)

✅ **supabase.js** - Database client (needs ESM check)
✅ **replicate.js** - Replicate API client (needs ESM check)
✅ **image.js** - Image processing (needs ESM check)
✅ **exports.js** - File uploads (needs ESM check)

### Medium Priority (Used by Pending Functions)

⏳ **design-director.js** - AI prompt refinement
⏳ **two-pass-generator.js** - Multi-pass generation
⏳ **prompt.js** - Prompt building
⏳ **aspect-resolver.js** - Dimension calculations
⏳ **brief-stencil.js** - Stencil generation

### Lower Priority (Used by Draftify)

⏳ **vectorize.js** - SVG vectorization
⏳ **color-quantize.js** - Color quantization
⏳ **auto-repair.js** - Constraint fixing
⏳ **constraints.js** - Rule validation

---

## 📝 Migration Checklist

### Completed
- [x] Create `/studio/api/` directory
- [x] Create `/studio/api/_utils/` directory
- [x] Copy all utility files
- [x] Migrate `studio-inspire-simple.js`
- [x] Migrate `studio-job-status.js`

### In Progress
- [ ] Migrate `studio-enqueue.js` (complex, needs manual work)
- [ ] Migrate `studio-draftify.js` (complex, needs manual work)
- [ ] Migrate `replicate-callback.js` (very complex, needs manual work)

### Testing Phase
- [ ] Test basic job creation (inspire-simple)
- [ ] Test job status polling
- [ ] Test full enqueue → generation → callback pipeline
- [ ] Test draftify vectorization
- [ ] Verify webhook callbacks work
- [ ] Update Replicate webhook URLs

---

## 🚀 Deployment Strategy

### Phase 1: Basic Functionality (CURRENT)
**Deploy Now**:
- `studio-inspire-simple.js` ✅
- `studio-job-status.js` ✅

**What Works**:
- Job creation
- Job status polling (with reconciliation)

**What Doesn't Work Yet**:
- Job enqueue (generation pipeline)
- Draftify (vectorization)
- Webhook callbacks

**User Impact**: Users can create jobs and poll status, but generation won't start until enqueue is migrated.

### Phase 2: Full Pipeline
**Deploy After Completion**:
- `studio-enqueue.js`
- `replicate-callback.js`

**What Will Work**:
- Full AI generation pipeline
- Webhook-driven status updates
- Multi-pass generation

### Phase 3: Advanced Features
**Deploy Last**:
- `studio-draftify.js`

**What Will Work**:
- Vector design export
- Constraint checking
- Installation BOM generation

---

## 🛠️ Quick Reference: Netlify vs. Vercel Patterns

### Request Handling
```javascript
// Netlify
const body = JSON.parse(event.body);
const query = event.queryStringParameters;
const method = event.httpMethod;

// Vercel
const body = req.body;  // Auto-parsed
const query = req.query;
const method = req.method;
```

### Response
```javascript
// Netlify
return {
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ data })
};

// Vercel
return res.status(200).json({ data });
```

### Module System
```javascript
// Netlify (CommonJS)
const { func } = require('./utils/file.js');
module.exports = { handler };

// Vercel (ESM)
import { func } from './utils/file.js';
export default function handler(req, res) {}
```

### Dynamic Imports
```javascript
// Netlify (async wrapper)
let func;
(async () => {
  const module = await import('./file.js');
  func = module.func;
})();

// Vercel (top-level await or direct import)
import { func } from './file.js';
// OR
const module = await import('./file.js');
const func = module.func;
```

---

## 📞 Next Steps

1. **Test Current Deployment**: Verify inspire-simple and job-status work
2. **Migrate studio-enqueue.js**: Follow pattern from completed functions
3. **Migrate replicate-callback.js**: Update webhook signature handling
4. **Update Replicate Dashboard**: Change webhook URL to Vercel
5. **Test Full Pipeline**: Create job → enqueue → callback → status
6. **Migrate studio-draftify.js**: Add vectorization capability

---

**Last Updated**: January 2025
**Migration Progress**: 2 of 5 functions (40%)
**Status**: Ready for Phase 1 deployment
