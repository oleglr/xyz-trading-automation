import { useEffect, useCallback, useState } from 'react';
import { wsService } from '../services/websocket/wsService';

interface WebSocketMessage {
  msg_type: string;
  [key: string]: unknown;
}

interface UseWebSocketOptions<T> {
  onMessage?: (data: T) => void;
  autoConnect?: boolean;
}

export function useWebSocket<T extends WebSocketMessage>(
  options: UseWebSocketOptions<T> = {}
) {
  const [isConnected, setIsConnected] = useState(false);
  const { onMessage, autoConnect = true } = options;

  const handleMessage = useCallback((message: WebSocketMessage) => {
    if (onMessage) {
      onMessage(message as T);
    }
  }, [onMessage]);

  const connect = useCallback(() => {
    wsService.connect(handleMessage);
  }, [handleMessage]);

  const disconnect = useCallback(() => {
    wsService.disconnect();
  }, []);

  const send = useCallback((payload: Record<string, unknown>) => {
    wsService.send(payload);
  }, []);

  // Handle auto-connect and cleanup
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    // Only disconnect if we initiated the connection
    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
  }, [autoConnect, connect, disconnect]);

  // Track connection status
  useEffect(() => {
    const checkConnection = setInterval(() => {
      const connected = wsService.isConnected();
      setIsConnected(connected);
    }, 100);

    return () => {
      clearInterval(checkConnection);
    };
  }, []);

  return {
    isConnected,
    connect,
    disconnect,
    send
  };
}
