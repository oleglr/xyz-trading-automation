import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { sseService } from '../services/sse/sseService';
import { SSEMessage } from '../types/sse';

interface SSEContextType {
  isConnected: boolean;
  lastMessage: SSEMessage<unknown> | null;
  connectionTime: Date | null;
  error: string | null;
}

const SSEContext = createContext<SSEContextType | undefined>(undefined);

export function SSEProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<SSEMessage<unknown> | null>(null);
  const [connectionTime, setConnectionTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canConnect = !isConnected && 
      import.meta.env.VITE_Login_Id && 
      import.meta.env.VITE_Authorize && 
      import.meta.env.VITE_Auth_Url;

    if (canConnect) {
      console.log('Initializing SSE connection...');
      sseService.connect({
        url: '/api/v2/sse',
        headers: {
          loginid: import.meta.env.VITE_Login_Id,
          authorize: import.meta.env.VITE_Authorize,
          'auth-url': import.meta.env.VITE_Auth_Url,
          'Connection': 'keep-alive'
        },
        onMessage: (event) => {
          try {
            const data = JSON.parse(event.data) as SSEMessage<unknown>;
            setLastMessage(data);
            setError(null);
            setIsConnected(true);
            if (!connectionTime) {
              console.log('SSE Connection established');
              setConnectionTime(new Date());
            }
          } catch (error) {
            console.warn('Failed to process SSE message:', error);
          }
        },
        withCredentials: false
      });

      return () => {
        console.log('Cleaning up SSE connection...');
        sseService.disconnect().catch(error => {
          console.error('Error disconnecting SSE:', error);
        });
        setIsConnected(false);
        setConnectionTime(null);
        console.log('SSE connection cleaned up');
      };
    }
  }, [isConnected, connectionTime]);

  const value = {
    isConnected,
    lastMessage,
    connectionTime,
    error
  };

  return (
    <SSEContext.Provider value={value}>
      {children}
    </SSEContext.Provider>
  );
}

export function useSSEContext() {
  const context = useContext(SSEContext);
  if (context === undefined) {
    throw new Error('useSSEContext must be used within a SSEProvider');
  }
  return context;
}
