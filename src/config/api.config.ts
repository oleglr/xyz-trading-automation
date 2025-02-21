export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  WS_URL: import.meta.env.VITE_WS_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
}

export const API_ENDPOINTS = {
  // Trading endpoints
  REPEAT_TRADE: '/repeat-trade',
  IS_TRADING: '/is-trading',
  STOP_TRADING: '/stop-trading',
  // WebSocket endpoint
  WS: '/ws',
}

export const WS_EVENTS = {
  // Define your WebSocket events here
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  MESSAGE: 'message',
  // Trading specific events
  TRADE_UPDATE: 'trade_update',
  TRADE_COMPLETE: 'trade_complete',
  TRADE_ERROR: 'trade_error',
}
