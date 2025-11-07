// Canary function to verify CJS loading works
exports.handler = async () => {
  // __filename is automatically available in CJS
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      runtime: 'cjs',
      message: 'CJS loading working correctly',
      file: __filename,
      node: process.version
    })
  };
};
