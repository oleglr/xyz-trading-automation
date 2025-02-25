import { 
  AppstoreOutlined, 
  RobotOutlined,
  AreaChartOutlined,
  MenuOutlined 
} from '@ant-design/icons';
import { useNavigation } from '../../contexts/NavigationContext';
import type { NavigationTab } from '../../contexts/NavigationContext';
import './styles.scss';

export function Navigation() {
  const { activeTab, setActiveTab } = useNavigation();

  const handleTabClick = (tab: NavigationTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="app-navigation">
      <div 
        className={`app-navigation__item ${activeTab === 'discover' ? 'app-navigation__item--active' : ''}`}
        onClick={() => handleTabClick('discover')}
      >
        <AppstoreOutlined className="app-navigation__icon" />
        <span className="app-navigation__label">Discover</span>
      </div>
      
      <div 
        className={`app-navigation__item ${activeTab === 'bots' ? 'app-navigation__item--active' : ''}`}
        onClick={() => handleTabClick('bots')}
      >
        <RobotOutlined className="app-navigation__icon" />
        <span className="app-navigation__label">Bots</span>
      </div>
      
      <div 
        className={`app-navigation__item ${activeTab === 'positions' ? 'app-navigation__item--active' : ''}`}
        onClick={() => handleTabClick('positions')}
      >
        <AreaChartOutlined className="app-navigation__icon" />
        <span className="app-navigation__label">Positions</span>
      </div>
      
      <div 
        className={`app-navigation__item ${activeTab === 'menu' ? 'app-navigation__item--active' : ''}`}
        onClick={() => handleTabClick('menu')}
      >
        <MenuOutlined className="app-navigation__icon" />
        <span className="app-navigation__label">Menu</span>
      </div>
    </div>
  );
}
