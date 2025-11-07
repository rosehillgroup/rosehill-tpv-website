exports.handler = async () => ({
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mode: typeof __filename === 'string' ? 'CJS' : 'UNKNOWN',
    node: process.version
  })
});
