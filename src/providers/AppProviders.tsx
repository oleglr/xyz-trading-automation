import { ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { SSEProvider } from '../contexts/SSEContext';
import { NavigationProvider } from '../contexts/NavigationContext';
import { ProcessingStackProvider } from '../contexts/ProcessingStackContext';

interface AppProvidersProps {
  children: ReactNode;
}

function ThemeConfigProvider({ children }: { children: ReactNode }) {
  const { theme: currentTheme } = useTheme();
  
  const antdTheme = {
    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#00d0ff',
      borderRadius: 4,
    },
  };

  return (
    <ConfigProvider theme={antdTheme}>
      {children}
    </ConfigProvider>
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <SSEProvider>
        <ThemeProvider>
        <ThemeConfigProvider>
          <NavigationProvider>
            <ProcessingStackProvider>
              {children}
            </ProcessingStackProvider>
          </NavigationProvider>
        </ThemeConfigProvider>
        </ThemeProvider>
      </SSEProvider>
    </AuthProvider>
  );
}
