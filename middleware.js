// Middleware disabled - now using direct API calls
export const config = {
  matcher: [], // Empty matcher to disable middleware
}

export default async function middleware(request) {
  // Return 404 for any requests that somehow reach this middleware
  return new Response('Not Found - API proxy has been disabled', { status: 404 });
}