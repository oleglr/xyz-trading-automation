// API proxy function disabled - now using direct API calls
export async function onRequest(context) {
  return new Response('Not Found - API proxy has been disabled', {
    status: 404,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

// CORS headers kept for reference
const corsHeaders = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, loginid, deriv-url, auth-url, authorize',
  'Access-Control-Expose-Headers': 'authorize, loginid, deriv-url, auth-url'
};