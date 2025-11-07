// CJS Canary - verifies CJS runtime loading works
exports.handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ok: true, runtime: 'cjs', ts: Date.now() }),
});
