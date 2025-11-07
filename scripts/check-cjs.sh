#!/usr/bin/env bash
set -euo pipefail

echo "🔎 Checking Netlify function entries for ESM…"
# Only check files that Netlify treats as Lambda *entries*.
# (top-level files inside netlify/functions, not subfolders)
bad_imports=$(grep -nE '^\s*import\s' netlify/functions/*.js 2>/dev/null || true)
bad_exports=$(grep -nE '^\s*export\s' netlify/functions/*.js 2>/dev/null || true)
bad_dynamic=$(grep -nE 'await\s+import\(' netlify/functions/*.js 2>/dev/null || true)
bad_meta=$(grep -n 'import\.meta' netlify/functions/*.js 2>/dev/null || true)

if [[ -n "${bad_imports}${bad_exports}${bad_dynamic}${bad_meta}" ]]; then
  echo "❌ ESM in function entries:"
  [[ -n "$bad_imports" ]] && echo "$bad_imports"
  [[ -n "$bad_exports" ]] && echo "$bad_exports"
  [[ -n "$bad_dynamic" ]] && echo "$bad_dynamic"
  [[ -n "$bad_meta" ]] && echo "$bad_meta"
  exit 1
fi

# ALSO scan the *built* bundles that Lambda actually executes.
# This catches cases where bundler decides to keep ESM in output.
if [ -d ".netlify/functions-internal" ]; then
  bad_out=$(grep -RInE '^\s*import\s|^\s*export\s|import\.meta|await\s+import\(' .netlify/functions-internal 2>/dev/null || true)
  if [[ -n "$bad_out" ]]; then
    echo "❌ ESM in built bundles (.netlify/functions-internal):"
    echo "$bad_out"
    exit 1
  fi
fi

echo "✅ All function entries & bundles are CJS-only"
