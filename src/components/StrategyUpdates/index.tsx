import React, { useCallback, useState, useEffect } from 'react';
import { useSSE } from '../../hooks/useSSE';
import { SSEMessage } from '../../types/sse';
import { sseService } from '../../services/sse/sseService';
import './styles.scss';

interface StrategyUpdate {
  id: string;
  status: string;
  timestamp: string;
  details: Record<string, unknown>;
}

interface StrategyUpdateMessage extends SSEMessage<StrategyUpdate> {
  type: 'strategy_update';
}

export const StrategyUpdates: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [localConnected, setLocalConnected] = useState(false);

  const handleMessage = useCallback((data: StrategyUpdateMessage) => {
    try {
      console.log('Received strategy update:', data);
      setError(null);
      setLocalConnected(true);
    } catch (error) {
      console.warn('Failed to process strategy update:', error);
    }
  }, []);

  const handleError = useCallback((event: Event) => {
    console.error('SSE Error:', event);
    setError('Connection failed. Retrying...');
    setLocalConnected(false);
  }, []);

  const handleOpen = useCallback(() => {
    console.log('SSE Connection opened');
    setError(null);
    setLocalConnected(true);
  }, []);

  const canConnect = true;

  const { isConnected } = useSSE<StrategyUpdateMessage>({
    url: '/api/v2/sse',
    headers: {
      loginid: 'VRTC10929133',
      authorize: 'a1-WwvJXHeSzkpkv0W2KQ8AKSBQ745hF',
      'auth-url': 'https://green.derivws.com/websockets/authorize',
      'Connection': 'keep-alive'
    },
    onMessage: handleMessage,
    onError: handleError,
    onOpen: handleOpen,
    withCredentials: false,
    autoConnect: canConnect
  });

  // Update local state based on connection status
  useEffect(() => {
    setLocalConnected(isConnected);
  }, [isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sseService.isConnected()) {
        sseService.disconnect().catch(error => {
          console.error('Error disconnecting SSE:', error);
        });
      }
    };
  }, []);

  if (!canConnect) {
    return (
      <div className="strategy-updates">
        <div className="connection-status error">
          Please log in to receive strategy updates
        </div>
      </div>
    );
  }

  return (
    <div className="strategy-updates">
      <div className={`connection-status ${error ? 'error' : ''}`}>
        <span 
          className="status-text"
          data-connected={localConnected}
        >
          {localConnected ? 'Connected' : 'Disconnected'}
        </span>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};
