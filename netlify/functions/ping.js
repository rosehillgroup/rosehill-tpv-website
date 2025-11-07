// /.netlify/functions/ping.js
exports.handler = async (request) => {
  return new Response(JSON.stringify({ ok: true, method: request.method }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
};