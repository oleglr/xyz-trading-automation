import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
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
  const connectionRef = useRef<boolean>(false);

  useEffect(() => {
    const canConnect = !connectionRef.current && 
      import.meta.env.VITE_Login_Id && 
      import.meta.env.VITE_Authorize && 
      import.meta.env.VITE_Auth_Url;

    if (!canConnect) {
      return;
    }

    console.log('SSE Context: Starting new connection...');
    connectionRef.current = true;

    const handlers = sseService.connect({
      url: '/api/v2/sse',
      headers: {
        loginid: import.meta.env.VITE_Login_Id,
        authorize: import.meta.env.VITE_Authorize,
        'auth-url': import.meta.env.VITE_Auth_Url,
        'Connection': 'keep-alive'
      },
      onMessage: (event) => {
        if (!connectionRef.current) return;

        try {
          console.log('SSE Context: Raw message received:', event.data);
          const data = JSON.parse(event.data);

          if (data.type === 'heartbeat') {
            console.log('SSE Context: Heartbeat received');
            if (!isConnected) {
              console.log('SSE Context: Setting connected state');
              setIsConnected(true);
              setConnectionTime(new Date());
            }
            return;
          }

          console.log('SSE Context: Message received:', data);
          setLastMessage(data);
          setError(null);
          
          if (!isConnected) {
            setIsConnected(true);
            setConnectionTime(new Date());
          }
        } catch (error) {
          console.error('SSE Context: Failed to process message:', error);
          setError('Failed to process message');
        }
      },
      withCredentials: false
    });

    console.log('SSE Context: Connection initialized with', handlers, 'handlers');

    // Cleanup function
    return () => {
      if (connectionRef.current) {
        console.log('SSE Context: Starting cleanup...');
        connectionRef.current = false;
        
        // Don't disconnect if there might be other components using the connection
        setIsConnected(false);
        setConnectionTime(null);
        console.log('SSE Context: Cleanup complete');
      }
    };
  }, []); // Empty dependency array since we're using ref

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
