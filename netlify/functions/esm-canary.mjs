// ESM Canary - verifies ESM runtime loading works
import os from 'node:os';

export const handler = async () => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ok: true,
      esm: true,
      platform: os.platform(),
      nodeVersion: process.version,
      ts: Date.now()
    }),
  };
};
