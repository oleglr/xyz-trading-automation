import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ProcessingStack, { ProcessInfo } from '../components/ProcessingStack';

interface ProcessingStackContextType {
  addProcess: (process: Omit<ProcessInfo, 'id' | 'timestamp'>) => void;
  processes: ProcessInfo[];
}

const ProcessingStackContext = createContext<ProcessingStackContextType | undefined>(undefined);

export function ProcessingStackProvider({ children }: { children: ReactNode }) {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);

  // Clean up expired processes (older than 7 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setProcesses(prev => prev.filter(process => now - process.timestamp < 7000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addProcess = (process: Omit<ProcessInfo, 'id' | 'timestamp'>) => {
    const newProcess: ProcessInfo = {
      ...process,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setProcesses(prev => [...prev, newProcess]);
  };

  return (
    <ProcessingStackContext.Provider value={{ processes, addProcess }}>
      {children}
      <ProcessingStack processes={processes} />
    </ProcessingStackContext.Provider>
  );
}

export function useProcessingStack() {
  const context = useContext(ProcessingStackContext);
  if (!context) {
    throw new Error('useProcessingStack must be used within a ProcessingStackProvider');
  }
  return context;
}
