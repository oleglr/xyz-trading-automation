import { 
  AppstoreOutlined, 
  RobotOutlined,
  AreaChartOutlined,
  MenuOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useNavigation } from '../../contexts/NavigationContext';
import './styles.scss';

export function Navigation() {
  const { activeTab } = useNavigation();

  return (
    <div className="app-navigation">
      <Link 
        to="/discover"
        className={`app-navigation__item ${activeTab === 'discover' ? 'app-navigation__item--active' : ''}`}
      >
        <AppstoreOutlined className="app-navigation__icon" />
        <span className="app-navigation__label">Discover</span>
      </Link>
      
      <Link 
        to="/bots"
        className={`app-navigation__item ${activeTab === 'bots' ? 'app-navigation__item--active' : ''}`}
      >
        <RobotOutlined className="app-navigation__icon" />
        <span className="app-navigation__label">Bots</span>
      </Link>
      
      <Link 
        to="/positions"
        className={`app-navigation__item ${activeTab === 'positions' ? 'app-navigation__item--active' : ''}`}
      >
        <AreaChartOutlined className="app-navigation__icon" />
        <span className="app-navigation__label">Positions</span>
      </Link>
      
      <Link 
        to="/menu"
        className={`app-navigation__item ${activeTab === 'menu' ? 'app-navigation__item--active' : ''}`}
      >
        <MenuOutlined className="app-navigation__icon" />
        <span className="app-navigation__label">Menu</span>
      </Link>
    </div>
  );
}
