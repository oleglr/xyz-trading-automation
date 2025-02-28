export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);
  const path = params.path || [];
  
  // Only handle /api/v2/ requests
  if (!url.pathname.startsWith('/api/v2/')) {
    return new Response('Not Found', { status: 404 });
  }
  
  // Handle OPTIONS requests for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }
  
  // Forward the request to the target API
  const targetUrl = `https://pr92.mobile-bot.deriv.dev${url.pathname}${url.search}`;
  
  try {
    const requestInit = {
      method: request.method,
      headers: request.headers,
      body: ['GET', 'HEAD'].includes(request.method) ? null : await request.text(),
      redirect: 'follow'
    };
    
    const response = await fetch(targetUrl, requestInit);
    
    // Clone the response so we can modify headers
    const responseInit = {
      status: response.status,
      statusText: response.statusText,
      headers: addCorsHeaders(response.headers)
    };
    
    return new Response(response.body, responseInit);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// CORS headers to add to responses
const corsHeaders = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, loginid, deriv-url, auth-url, authorize',
  'Access-Control-Expose-Headers': 'authorize, loginid, deriv-url, auth-url'
};

/**
 * Add CORS headers to response headers
 * @param {Headers} headers
 */
function addCorsHeaders(headers) {
  const newHeaders = new Headers(headers);
  
  Object.keys(corsHeaders).forEach(key => {
    newHeaders.set(key, corsHeaders[key]);
  });
  
  return newHeaders;
}