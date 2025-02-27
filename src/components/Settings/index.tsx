import { Card, Divider } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { AuthorizeResponse } from '../../types/websocket';
import { StrategyUpdates } from '../StrategyUpdates';
import './styles.scss';

export function Settings() {
  const { authorizeResponse } = useAuth();
  const userInfo = authorizeResponse as AuthorizeResponse | null;

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
          <StrategyUpdates />
        </div>
      </Card>
    </div>
  );
}
