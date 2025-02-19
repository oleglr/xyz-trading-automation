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
    const id = Math.random().toString(36).substr(2, 9);
    const timestamp = Date.now();
    
    const newProcess: ProcessInfo = {
      ...process,
      id,
      timestamp
    };
    setProcesses(prev => [...prev, newProcess]);

    // Simulate progress
    let completedTrades = 0;
    let profit = 0;
    const interval = setInterval(() => {
      if (completedTrades < process.totalTrades) {
        completedTrades++;
        profit += Math.random() * 2 - 1; // Random profit between -1 and 1
        
        setProcesses(prev => 
          prev.map(p => 
            p.id === id 
              ? { ...p, completedTrades, profit }
              : p
          )
        );
      } else {
        clearInterval(interval);
      }
    }, 1000);

    // Process will be auto-removed by the cleanup effect after 7 seconds
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
