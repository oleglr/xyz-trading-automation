export default async function middleware(req) {
  // Get the request URL
  const url = new URL(req.url)
  
  // Only process /api/v2 requests
  if (!url.pathname.startsWith('/api/v2')) {
    return
  }

  // Clone the headers
  const headers = new Headers(req.headers)
  
  // Forward essential headers
  const forwardHeaders = [
    'authorize',
    'loginid',
    'deriv-url',
    'auth-url',
    'content-type'
  ]

  // Create response headers
  const responseHeaders = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, loginid, deriv-url, auth-url, authorize',
    'Access-Control-Expose-Headers': 'authorize, loginid, deriv-url, auth-url'
  }

  // Add headers that exist in the request
  forwardHeaders.forEach(header => {
    if (headers.has(header)) {
      responseHeaders[header] = headers.get(header)
    }
  })

  // Handle OPTIONS requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: responseHeaders
    })
  }

  // Forward the request to the target API
  const targetUrl = `https://pr92.mobile-bot.deriv.dev${url.pathname}${url.search}`
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: Object.fromEntries(headers),
      body: ['GET', 'HEAD'].includes(req.method) ? null : req.body
    })

    // Forward the response with additional headers
    const responseInit = {
      status: response.status,
      headers: { ...responseHeaders, ...Object.fromEntries(response.headers) }
    }

    return new Response(response.body, responseInit)
  } catch (error) {
    console.error('Proxy error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...responseHeaders
      }
    })
  }
}