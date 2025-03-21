import { useEffect, useCallback, useState } from 'react';
import { sseService } from '../services/sse/sseService';
import { SSEHeaders } from '../types/sse';
import { API_CONFIG } from '../config/api.config';

interface UseSSEOptions<T> {
  url: string;
  headers: SSEHeaders;
  onMessage?: (data: T) => void;
  onError?: (error: Event) => void;
  onOpen?: (event: Event) => void;
  autoConnect?: boolean;
  withCredentials?: boolean;
  queryParams?: {
    account_uuid?: string;
    champion_url?: string;
    [key: string]: string | undefined;
  };
}

export function useSSE<T = any>(
  options: UseSSEOptions<T>
) {
  const [isConnected, setIsConnected] = useState(false);
  const {
    url,
    headers,
    onMessage,
    onError,
    onOpen,
    autoConnect = true,
    withCredentials = true,
    queryParams
  } = options;

  const handleMessage = useCallback((event: MessageEvent) => {
    if (onMessage) {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    }
  }, [onMessage]);

  const connect = useCallback(() => {
    // Include both account_uuid and champion_url in the query params
    // but we'll modify the sseService to only use account_uuid
    const defaultQueryParams = {
      account_uuid: API_CONFIG.ACCOUNT_UUID,
      champion_url: API_CONFIG.CHAMPION_API_URL, // Include this to satisfy TypeScript
      ...queryParams
    };

    // Add required headers for SSE connection
    const defaultHeaders = {
      ...headers,
      'Authorization': headers['Authorization'] || `Bearer ${API_CONFIG.CHAMPION_TOKEN}`,
      'Accept': headers['Accept'] || 'text/event-stream',
      'Cache-Control': headers['Cache-Control'] || 'no-cache'
    };

    sseService.connect({
      url,
      headers: defaultHeaders,
      withCredentials,
      onMessage: handleMessage,
      onError,
      onOpen,
      queryParams: defaultQueryParams
    });
  }, [url, headers, withCredentials, handleMessage, onError, onOpen, queryParams]);

  const disconnect = useCallback(() => {
    sseService.disconnect();
  }, []);

  // Handle auto-connect and cleanup
  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
  }, [autoConnect, connect, disconnect]);

  // Track connection status
  useEffect(() => {
    const checkConnection = setInterval(() => {
      const connected = sseService.isConnected();
      setIsConnected(connected);
    }, 1000);

    return () => {
      clearInterval(checkConnection);
    };
  }, []);

  return {
    isConnected,
    connect,
    disconnect
  };
}
