export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, loginid, deriv-url, auth-url, authorize')
  res.setHeader('Access-Control-Expose-Headers', 'authorize, loginid, deriv-url, auth-url')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // Forward the request to the target API
    const targetUrl = `https://pr92.mobile-bot.deriv.dev/api/v2${req.url}`
    
    const headers = {
      'Content-Type': 'application/json',
      'authorize': req.headers.authorize,
      'loginid': req.headers.loginid,
      'deriv-url': req.headers['deriv-url'],
      'auth-url': req.headers['auth-url']
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    })

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}