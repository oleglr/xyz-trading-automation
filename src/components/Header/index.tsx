import { Button, Space } from 'antd'
import { LoginOutlined, LogoutOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons'
import { useTheme } from '../../contexts/ThemeContext'
import DerivLogo from '../../assets/favicon.svg'
import './styles.scss'

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ isLoggedIn, onLogin, onLogout }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="app-header">
      <div className="app-header__logo-section">
        <img 
          src={DerivLogo} 
          alt="Deriv Logo" 
          className="app-header__logo"
        />
        <span className="app-header__title">
          Trading Automation
        </span>
      </div>
      <Space>
        <Button
          type="text"
          icon={theme === 'dark' ? <BulbFilled /> : <BulbOutlined />}
          size="large"
          onClick={toggleTheme}
          className="app-header__theme-button"
        />
        <Button 
          type="primary"
          icon={isLoggedIn ? <LogoutOutlined /> : <LoginOutlined />}
          size="large"
          onClick={isLoggedIn ? onLogout : onLogin}
          className="app-header__auth-button"
        >
          {isLoggedIn ? 'Logout' : 'Log in'}
        </Button>
      </Space>
    </header>
  );
}
