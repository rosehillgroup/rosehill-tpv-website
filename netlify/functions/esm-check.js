// Canary function to verify ESM loading works
const { fileURLToPath } = require('url');

exports.handler = async () => {
  const here = fileURLToPath(import.meta.url);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      message: 'ESM loading working correctly',
      file: here,
      node: process.version
    })
  };
};
