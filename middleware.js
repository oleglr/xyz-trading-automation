export const config = {
  matcher: '/api/v2/:path*',
}

export default async function middleware(request) {
  const url = new URL(request.url)
  
  // Handle OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, loginid, deriv-url, auth-url, authorize',
        'Access-Control-Expose-Headers': 'authorize, loginid, deriv-url, auth-url'
      }
    })
  }

  // Forward the request to the target API
  const targetUrl = `https://pr92.mobile-bot.deriv.dev${url.pathname}${url.search}`
  
  try {
    const headers = new Headers(request.headers)
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: ['GET', 'HEAD'].includes(request.method) ? null : await request.text()
    })

    // Forward the response with CORS headers
    const responseHeaders = new Headers(response.headers)
    responseHeaders.set('Access-Control-Allow-Credentials', 'true')
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, loginid, deriv-url, auth-url, authorize')
    responseHeaders.set('Access-Control-Expose-Headers', 'authorize, loginid, deriv-url, auth-url')

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }
}