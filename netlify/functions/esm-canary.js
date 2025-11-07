// CJS Canary - verifies CJS runtime loading works
const os = require('node:os');

exports.handler = async () => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      cjs: true,
      platform: os.platform(),
      nodeVersion: process.version,
      ts: Date.now()
    }),
  };
};
