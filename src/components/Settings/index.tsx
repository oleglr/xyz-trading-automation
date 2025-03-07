import { Card, Divider, Button, Switch } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthorizeResponse } from '../../types/websocket';
import { StrategyUpdates } from '../StrategyUpdates';
import { oauthService } from '../../services/oauth/oauthService';
import './styles.scss';

export function Settings() {
  const { authorizeResponse, setAuthParams, setAuthorizeResponse } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const userInfo = authorizeResponse as AuthorizeResponse | null;
  
  const handleLogin = () => {
    oauthService.initiateLogin();
  };
  
  const handleLogout = () => {
    setAuthParams(null);
    setAuthorizeResponse(null);
  };

  return (
    <div className="settings">
      <Card className="settings__container">
        <h2 className="settings__title">Settings</h2>
        
        {userInfo && (
          <>
            <div className="settings__section">
              <h3 className="settings__section-title">Account Information</h3>
              <div className="settings__info-grid">
                <div className="settings__info-item">
                  <span className="label">Account ID</span>
                  <span className="value">{userInfo.authorize.loginid}</span>
                </div>
                <div className="settings__info-item">
                  <span className="label">Account Type</span>
                  <span className="value">{userInfo.authorize.loginid.charAt(0) === 'V' ? 'Virtual' : 'Real'}</span>
                </div>
                <div className="settings__info-item">
                  <span className="label">Currency</span>
                  <span className="value">{userInfo.authorize.currency}</span>
                </div>
                <div className="settings__info-item">
                  <span className="label">Balance</span>
                  <span className="value">{userInfo.authorize.balance.toFixed(2)} {userInfo.authorize.currency}</span>
                </div>
              </div>
            </div>
            <Divider />
          </>
        )}

        <div className="settings__section">
          <h3 className="settings__section-title">Authentication</h3>
          <div className="settings__auth-buttons">
            {userInfo ? (
              <Button 
                type="primary" 
                danger 
                onClick={handleLogout}
                className="settings__auth-button"
              >
                Logout
              </Button>
            ) : (
              <Button 
                type="primary" 
                onClick={handleLogin}
                className="settings__auth-button"
              >
                Login
              </Button>
            )}
          </div>
        </div>
        
        <Divider />
        
        <div className="settings__section">
          <h3 className="settings__section-title">Appearance</h3>
          <div className="settings__theme-switch">
            <span className="settings__theme-label">Dark Mode</span>
            <Switch 
              checked={theme === 'dark'}
              onChange={toggleTheme}
              className="settings__theme-toggle"
            />
          </div>
        </div>
        
        <Divider />
        
        <div className="settings__section">
          <h3 className="settings__section-title">Configuration</h3>
          <Link to="/endpoint" className="settings__config-link">
            <Button type="default">API Endpoint Configuration</Button>
          </Link>
        </div>
        
        <Divider />
        
        <div className="settings__section">
          <StrategyUpdates />
        </div>
      </Card>
    </div>
  );
}
