export default function handler(req, res) {
  // Get the authorization headers from the request
  const authorize = req.headers['authorize']
  const loginid = req.headers['loginid']
  const derivUrl = req.headers['deriv-url']
  const authUrl = req.headers['auth-url']

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, loginid, deriv-url, auth-url, authorize'
  )

  // For OPTIONS requests, return the headers and 200 OK
  if (req.method === 'OPTIONS') {
    // Add the received headers to the response
    if (authorize) res.setHeader('authorize', authorize)
    if (loginid) res.setHeader('loginid', loginid)
    if (derivUrl) res.setHeader('deriv-url', derivUrl)
    if (authUrl) res.setHeader('auth-url', authUrl)

    res.status(200).end()
    return
  }

  // For non-OPTIONS requests that reach here, return 404
  res.status(404).end()
}