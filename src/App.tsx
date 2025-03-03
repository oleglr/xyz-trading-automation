import { useEffect, useState } from "react";
import { Layout } from "antd";
import { oauthService } from "./services/oauth/oauthService";
import { useWebSocket } from "./hooks/useWebSocket";
import { useAuth } from "./contexts/AuthContext";
import { useNavigation } from "./contexts/NavigationContext";
import { AuthorizeResponse } from "./types/auth";
import { StrategyList } from "./components/StrategyList";
import { Navigation } from "./components/Navigation";
import { Settings } from "./components/Settings";
import Positions from "./components/Positions";
import { AccountHeader } from "./components/AccountHeader";
import { Bots } from "./components/Bots";

import "./styles/App.scss";

const { Content } = Layout;

function MainContent() {
  const { activeTab } = useNavigation();

  const renderContent = () => {
    switch (activeTab) {
      case "discover":
        return <StrategyList />;
      case "bots":
        return <Bots />;
      case "positions":
        return <Positions />;
      case "menu":
        return <Settings />;
      default:
        return <StrategyList />;
    }
  };

  return (
    <div className="app-content">
      {renderContent()}
      <Navigation />
    </div>
  );
}

function App() {
  const { authParams, setAuthParams, authorizeResponse, setAuthorizeResponse } =
    useAuth();
  const [accountType, setAccountType] = useState<'Real' | 'Demo'>('Real');
  const balance = '10,000.00';
  const currency = 'USD';

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

  const handleAccountTypeChange = (type: 'Real' | 'Demo') => {
    setAccountType(type);
    // In a real app, you would fetch the balance for the selected account type
  };
  
  const handleDepositClick = () => {
    // Handle deposit action
    console.log('Deposit clicked');
  };

  return (
    <Layout className="app-layout">
      <Content className="app-main">
        <AccountHeader 
          accountType={accountType}
          balance={balance}
          currency={currency}
          onAccountTypeChange={handleAccountTypeChange}
          onDepositClick={handleDepositClick}
        />
        <MainContent />
      </Content>
    </Layout>
  );
}

export default App;
