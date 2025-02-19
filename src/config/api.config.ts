export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  WS_URL: import.meta.env.VITE_WS_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
}

export const API_ENDPOINTS = {
  // Define your REST API endpoints here
  EXAMPLE: '/api/example',
  // Add more endpoints as needed
}

export const WS_EVENTS = {
  // Define your WebSocket events here
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  MESSAGE: 'message',
  // Add more events as needed
}
