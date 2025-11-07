exports.handler = async () => {
  let canRequire = false;
  try { require('path'); canRequire = true; } catch {}
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ require_ok: canRequire })
  };
};
