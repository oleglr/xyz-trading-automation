export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
  WS_URL: import.meta.env.VITE_WS_URL,
  EXTERNAL_API_BASE_URL: import.meta.env.VITE_API_URL,
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  // Champion API specific configuration
  CHAMPION_TOKEN: import.meta.env.VITE_CHAMPION_TOKEN,
  ACCOUNT_UUID: import.meta.env.VITE_ACCOUNT_UUID,
  CHAMPION_API_URL: import.meta.env.VITE_CHAMPION_API_URL,
}

export const API_ENDPOINTS = {
  // Trading endpoints
  REPEAT_TRADE: '/champion/v1/repeat-trade',
  IS_TRADING: '/champion/v1/is-trading',
  STOP_TRADING: '/champion/v1/stop-trading',
  STRATEGIES: '/champion/v1/strategies',
  Threshold_Trade: '/champion/v1/threshold-trade',
  Martingale_Trade: '/champion/v1/martingale-trade',
  // WebSocket and SSE endpoints
  WS: '/champion/v1/ws',
  SSE: '/champion/v1/sse',
  BALANCE_STREAM: '/v1/accounting/balance/stream',
  BALANCE: '/v1/accounting/balance',
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
