// Debug version of whoami function to isolate the issue
// This will test each step individually

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }
  
  try {
    // Step 1: Check environment variables
    const envVars = {
      hasIssuer: !!process.env.AUTH0_ISSUER_BASE_URL,
      hasAudience: !!process.env.AUTH0_AUDIENCE,
      issuer: process.env.AUTH0_ISSUER_BASE_URL,
      audience: process.env.AUTH0_AUDIENCE
    };
    
    // Step 2: Check token presence
    const auth = event.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    
    if (!token) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          step: 'token_check',
          error: 'No token provided',
          envVars
        })
      };
    }
    
    // Step 3: Try importing jose
    let joseImport;
    try {
      joseImport = await import('jose');
    } catch (importError) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          step: 'jose_import',
          error: `Jose import failed: ${importError.message}`,
          envVars
        })
      };
    }
    
    // Step 4: Try creating JWKS
    let jwks;
    let normalizedIssuer;
    try {
      // Normalize issuer URL - Auth0 tokens include trailing slash
      normalizedIssuer = process.env.AUTH0_ISSUER_BASE_URL?.endsWith('/') 
        ? process.env.AUTH0_ISSUER_BASE_URL 
        : process.env.AUTH0_ISSUER_BASE_URL + '/';
      
      const jwksUrl = `${normalizedIssuer}.well-known/jwks.json`;
      jwks = joseImport.createRemoteJWKSet(new URL(jwksUrl));
    } catch (jwksError) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          step: 'jwks_creation',
          error: `JWKS creation failed: ${jwksError.message}`,
          envVars,
          jwksUrl: `${normalizedIssuer}.well-known/jwks.json`
        })
      };
    }
    
    // Step 5: Try JWT verification
    try {
      const { payload } = await joseImport.jwtVerify(token, jwks, {
        issuer: normalizedIssuer,
        audience: process.env.AUTH0_AUDIENCE
      });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          step: 'success',
          message: 'JWT verification successful',
          payload: {
            sub: payload.sub,
            email: payload.email,
            roles: payload['https://tpv.rosehill.group/roles'] || [],
            aud: payload.aud,
            iss: payload.iss
          },
          envVars
        })
      };
      
    } catch (jwtError) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          step: 'jwt_verification',
          error: `JWT verification failed: ${jwtError.message}`,
          envVars,
          tokenPrefix: token.substring(0, 50) + '...'
        })
      };
    }
    
  } catch (unexpectedError) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        step: 'unexpected_error',
        error: `Unexpected error: ${unexpectedError.message}`,
        stack: unexpectedError.stack
      })
    };
  }
}