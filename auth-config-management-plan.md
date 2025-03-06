# Authentication Configuration Management Enhancement Plan

## Overview

We'll create a standalone configuration page accessible at `/endpoint` that allows users to view and modify authentication environment variables. The changes will persist across browser sessions using localStorage, and the system will prioritize user-defined values over environment defaults.

## System Architecture

```mermaid
graph TD
    A[User] -->|Accesses| B[/endpoint Route]
    B -->|Displays| C[Configuration UI]
    C -->|Reads/Writes| D[LocalStorage]
    C -->|Reads| E[Environment Variables]
    F[Application] -->|Uses| G[ConfigService]
    G -->|Prioritizes| D
    G -->|Falls back to| E
```

## Components and Services

### 1. Configuration Service

This service will be responsible for:
- Reading configuration values from localStorage
- Falling back to environment variables when no override exists
- Saving user-defined overrides to localStorage
- Providing a clean API for the rest of the application to access configuration values

### 2. Configuration UI Component

A standalone React component that:
- Displays form fields for all authentication parameters
- Pre-populates fields with current values (from localStorage or environment variables)
- Validates input values
- Provides visual feedback for invalid configurations
- Includes reset functionality to revert to defaults

### 3. Routing Configuration

Add a new route to the application for the `/endpoint` path that renders the Configuration UI component.

## Implementation Plan

### Phase 1: Create Configuration Service

1. Create a new service file `src/services/config/configService.ts` that:
   - Defines interfaces for configuration values
   - Implements methods to get/set configuration values
   - Handles localStorage persistence
   - Provides a clean API for accessing configuration values

### Phase 2: Create Configuration UI Component

1. Create a new component `src/components/ConfigEndpoint/index.tsx` that:
   - Implements a form with fields for all authentication parameters
   - Pre-populates fields with current values
   - Validates input values
   - Provides visual feedback for invalid configurations
   - Includes reset functionality
   - Styles the component appropriately

### Phase 3: Add Routing Configuration

1. Update the routing configuration to add a new route for `/endpoint` that renders the Configuration UI component
2. Ensure the route is accessible without authentication

### Phase 4: Integrate Configuration Service with Existing Services

1. Update the OAuth service to use the Configuration Service for retrieving authentication parameters
2. Update the WebSocket service to use the Configuration Service for retrieving WebSocket URL and other parameters
3. Update any other services that use authentication parameters to use the Configuration Service

### Phase 5: Testing and Validation

1. Test the Configuration UI to ensure it correctly displays and updates configuration values
2. Test the Configuration Service to ensure it correctly prioritizes user-defined values over environment defaults
3. Test the integration with existing services to ensure they correctly use the Configuration Service

## Detailed Implementation

### Configuration Service

```typescript
// src/services/config/configService.ts

interface AuthConfig {
  oauthAppId: string;
  oauthUrl: string;
  wsUrl: string;
  authUrl: string;
  derivUrl: string;
}

const CONFIG_STORAGE_KEY = 'auth_config_overrides';

class ConfigService {
  private static instance: ConfigService;
  
  private constructor() {}
  
  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }
  
  // Get stored overrides from localStorage
  private getStoredOverrides(): Partial<AuthConfig> {
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading config from localStorage:', error);
      return {};
    }
  }
  
  // Save overrides to localStorage
  public saveOverrides(overrides: Partial<AuthConfig>): void {
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(overrides));
    } catch (error) {
      console.error('Error saving config to localStorage:', error);
    }
  }
  
  // Clear all overrides
  public clearOverrides(): void {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  }
  
  // Get default values from environment variables
  public getDefaults(): AuthConfig {
    return {
      oauthAppId: import.meta.env.VITE_OAUTH_APP_ID || '',
      oauthUrl: import.meta.env.VITE_OAUTH_URL || '',
      wsUrl: import.meta.env.VITE_WS_URL || '',
      authUrl: import.meta.env.VITE_Auth_Url || '',
      derivUrl: import.meta.env.VITE_Deriv_Url || '',
    };
  }
  
  // Get effective configuration (overrides + defaults)
  public getConfig(): AuthConfig {
    const defaults = this.getDefaults();
    const overrides = this.getStoredOverrides();
    
    return {
      ...defaults,
      ...overrides,
    };
  }
  
  // Get a specific configuration value
  public getValue<K extends keyof AuthConfig>(key: K): AuthConfig[K] {
    const config = this.getConfig();
    return config[key];
  }
  
  // Set a specific configuration value
  public setValue<K extends keyof AuthConfig>(key: K, value: AuthConfig[K]): void {
    const overrides = this.getStoredOverrides();
    overrides[key] = value;
    this.saveOverrides(overrides);
  }
}

export const configService = ConfigService.getInstance();
```

### Configuration UI Component

```typescript
// src/components/ConfigEndpoint/index.tsx

import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Row, Col } from 'antd';
import { configService } from '../../services/config/configService';
import './styles.scss';

export function ConfigEndpoint() {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  
  // Load current configuration values
  useEffect(() => {
    const config = configService.getConfig();
    form.setFieldsValue({
      oauthAppId: config.oauthAppId,
      oauthUrl: config.oauthUrl,
      wsUrl: config.wsUrl,
      authUrl: config.authUrl,
      derivUrl: config.derivUrl,
    });
  }, [form]);
  
  // Handle form submission
  const handleSubmit = (values: any) => {
    setIsLoading(true);
    
    try {
      // Save each value to the configuration service
      Object.entries(values).forEach(([key, value]) => {
        configService.setValue(key as any, value as string);
      });
      
      message.success('Configuration saved successfully');
    } catch (error) {
      console.error('Error saving configuration:', error);
      message.error('Failed to save configuration');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle reset to defaults
  const handleReset = () => {
    setIsLoading(true);
    
    try {
      // Clear all overrides
      configService.clearOverrides();
      
      // Reset form with default values
      const defaults = configService.getDefaults();
      form.setFieldsValue(defaults);
      
      message.success('Configuration reset to defaults');
    } catch (error) {
      console.error('Error resetting configuration:', error);
      message.error('Failed to reset configuration');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="config-endpoint">
      <Card className="config-endpoint__card">
        <div className="config-endpoint__header">
          <h1 className="config-endpoint__title">Authentication Configuration</h1>
          <a href="/" className="config-endpoint__home-link">Back to Home</a>
        </div>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="config-endpoint__form"
        >
          <Form.Item
            label="OAuth App ID"
            name="oauthAppId"
            rules={[{ required: true, message: 'Please enter the OAuth App ID' }]}
          >
            <Input placeholder="e.g., 9999" />
          </Form.Item>
          
          <Form.Item
            label="OAuth URL"
            name="oauthUrl"
            rules={[{ required: true, message: 'Please enter the OAuth URL' }]}
          >
            <Input placeholder="e.g., https://qa10.deriv.dev/oauth2/authorize" />
          </Form.Item>
          
          <Form.Item
            label="WebSocket URL"
            name="wsUrl"
            rules={[{ required: true, message: 'Please enter the WebSocket URL' }]}
          >
            <Input placeholder="e.g., wss://qa10.deriv.dev/websockets/v3" />
          </Form.Item>
          
          <Form.Item
            label="Auth URL"
            name="authUrl"
            rules={[{ required: true, message: 'Please enter the Auth URL' }]}
          >
            <Input placeholder="e.g., https://qa10.deriv.dev/websockets/authorize?app_id=9999&l=en&brand=deriv" />
          </Form.Item>
          
          <Form.Item
            label="Deriv URL"
            name="derivUrl"
            rules={[{ required: true, message: 'Please enter the Deriv URL' }]}
          >
            <Input placeholder="e.g., wss://qa10.deriv.dev/websockets/v3?app_id=9999&l=en&brand=deriv" />
          </Form.Item>
          
          <Row gutter={16} className="config-endpoint__actions">
            <Col>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Save Configuration
              </Button>
            </Col>
            <Col>
              <Button onClick={handleReset} loading={isLoading}>
                Reset to Defaults
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}
```

### Styling for Configuration UI

```scss
// src/components/ConfigEndpoint/styles.scss

.config-endpoint {
  display: flex;
  justify-content: center;
  padding: 2rem;
  
  &__card {
    width: 100%;
    max-width: 800px;
  }
  
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  &__title {
    margin: 0;
  }
  
  &__home-link {
    font-size: 1rem;
  }
  
  &__form {
    margin-top: 1rem;
  }
  
  &__actions {
    margin-top: 2rem;
  }
}
```

### Update Routing Configuration

We need to update the routing configuration to add the new `/endpoint` route. Since I don't see a dedicated router file in the project structure, we'll need to modify the App.tsx file to include the new route.

```typescript
// src/App.tsx (modified)

import { useEffect } from "react";
import { Layout, Row, Col } from "antd";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { oauthService } from "./services/oauth/oauthService";
import { useWebSocket } from "./hooks/useWebSocket";
import { useAuth } from "./contexts/AuthContext";
import { useNavigation } from "./contexts/NavigationContext";
import { AuthorizeResponse } from "./types/auth";
import { StrategyList } from "./components/StrategyList";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { Settings } from "./components/Settings";
import Positions from "./components/Positions";
import { ConfigEndpoint } from "./components/ConfigEndpoint";

import "./styles/App.scss";

const { Content } = Layout;

function MainContent() {
  const { activeTab } = useNavigation();

  const renderContent = () => {
    switch (activeTab) {
      case "strategies":
        return <StrategyList />;
      case "trade-logs":
        return <Positions />;
      case "templates":
        return <div>Templates (Coming Soon)</div>;
      case "settings":
        return <Settings />;
      default:
        return <StrategyList />;
    }
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={6} lg={5} xl={4}>
        <Navigation />
      </Col>
      <Col xs={24} md={18} lg={19} xl={20}>
        {renderContent()}
      </Col>
    </Row>
  );
}

function MainApp() {
  const { authParams, setAuthParams, authorizeResponse, setAuthorizeResponse } =
    useAuth();

  const { send, isConnected, connect } = useWebSocket<AuthorizeResponse>({
    onMessage: (response) => {
      if (response.msg_type === "authorize" && response.authorize) {
        setAuthorizeResponse({
          msg_type: "authorize",
          authorize: response.authorize,
        });
      }
    },
    autoConnect: false,
  });

  useEffect(() => {
    const params = oauthService.getAuthParams();
    if (params) {
      setAuthParams(params);
    }
  }, [setAuthParams]);

  useEffect(() => {
    if (authParams?.token1) {
      connect();
    }
  }, [authParams, connect]);

  useEffect(() => {
    if (authParams?.token1 && isConnected) {
      send({ authorize: authParams.token1 });
    }
  }, [authParams, isConnected, send]);

  const handleLogin = () => {
    setAuthParams(null);
    setAuthorizeResponse(null);
    oauthService.initiateLogin();
  };

  const handleLogout = () => {
    setAuthParams(null);
    setAuthorizeResponse(null);
  };

  const isLoggedIn = !!authorizeResponse?.authorize;

  return (
    <Layout className="app-layout">
      <Header
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <Content className="app-main">
        <MainContent />
      </Content>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/endpoint" element={<ConfigEndpoint />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### Update OAuth Service

```typescript
// src/services/oauth/oauthService.ts (modified)

import { configService } from '../config/configService';

class OAuthService {
  constructor() {}

  public initiateLogin(): void {
    const appId = configService.getValue('oauthAppId');
    const authUrl = configService.getValue('oauthUrl');
    
    const params = new URLSearchParams({
      app_id: appId,
      l: 'en',
      route: window.location.pathname,
    });

    window.location.href = `${authUrl}?${params.toString()}`;
  }

  public getAuthParams(): Record<string, string> | null {
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries());
    
    // Clean up URL after extracting parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    
    return Object.keys(params).length > 0 ? params : null;
  }
}

export const oauthService = new OAuthService();
```

### Update WebSocket Service

```typescript
// src/services/websocket/wsService.ts (modified)

import { WebSocketResponse, WebSocketRequest } from '../../types/websocket';
import { configService } from '../config/configService';

type MessageHandler = (data: WebSocketResponse) => void;

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private messageHandler: MessageHandler | null = null;
  private pingInterval: number | null = null;
  private isConnecting = false;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private getWsUrl(): string {
    const wsUrl = configService.getValue('wsUrl');
    const appId = configService.getValue('oauthAppId');
    return `${wsUrl}?app_id=${appId}&l=en&brand=deriv`;
  }

  private startPingInterval(): void {
    this.clearPingInterval();
    this.pingInterval = window.setInterval(() => {
      if (this.isConnected()) {
        console.log('Sending ping...');
        this.send({ ping: 1 });
      }
    }, 10000);
  }

  private clearPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  public connect(onMessage: MessageHandler): void {
    // If already connected or connecting, just update the message handler
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) {
      this.messageHandler = onMessage;
      return;
    }

    // Prevent multiple connection attempts
    this.isConnecting = true;
    this.messageHandler = onMessage;

    // Clean up existing connection if any
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.ws = new WebSocket(this.getWsUrl());

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.startPingInterval();
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.ws = null;
      this.isConnecting = false;
      this.clearPingInterval();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnecting = false;
      this.clearPingInterval();
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketResponse;
        if (this.messageHandler && message.msg_type !== 'ping') {
          this.messageHandler(message);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  public disconnect(): void {
    this.clearPingInterval();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandler = null;
    this.isConnecting = false;
  }

  public send(payload: WebSocketRequest): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = {
        ...payload,
        req_id: Date.now()
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsService = WebSocketService.getInstance();
```

### Update Auth Store

```typescript
// src/stores/authStore.ts (modified)

import { AuthorizeResponse } from '../types/auth';
import { configService } from '../services/config/configService';

interface AuthState {
  authorizeResponse: AuthorizeResponse | null;
  authParams: Record<string, string> | null;
}

class AuthStore {
  private static instance: AuthStore;
  private state: AuthState = {
    authorizeResponse: null,
    authParams: null
  };

  private constructor() {
    // Initialize from localStorage if available
    const storedAuth = localStorage.getItem('app_auth');
    const storedParams = localStorage.getItem('app_params');
    
    if (storedAuth) {
      this.state.authorizeResponse = JSON.parse(storedAuth);
    }
    if (storedParams) {
      this.state.authParams = JSON.parse(storedParams);
    }
  }

  public static getInstance(): AuthStore {
    if (!AuthStore.instance) {
      AuthStore.instance = new AuthStore();
    }
    return AuthStore.instance;
  }

  public setAuthorizeResponse(data: AuthorizeResponse | null): void {
    this.state.authorizeResponse = data;
  }

  public setAuthParams(params: Record<string, string> | null): void {
    this.state.authParams = params;
  }

  public getAuthorizeResponse(): AuthorizeResponse | null {
    return this.state.authorizeResponse;
  }

  public getAuthParams(): Record<string, string> | null {
    return this.state.authParams;
  }

  public getHeaders(): Record<string, string> {
    return {
      'loginid': this.state.authorizeResponse?.authorize.loginid || '',
      'authorize': this.state.authParams?.token1 || '',
      'userid': String(this.state.authorizeResponse?.authorize.userId || ''),
      'auth-url': configService.getValue('authUrl'),
      'deriv-url': configService.getValue('derivUrl')
    };
  }
}

export const authStore = AuthStore.getInstance();