import { createContext, useContext, useState, ReactNode } from 'react';

export type NavigationTab = 'discover' | 'bots' | 'positions' | 'menu';

interface NavigationContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavigationTab>('discover');

  return (
    <NavigationContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
