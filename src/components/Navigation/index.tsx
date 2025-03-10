import { 
  AppstoreOutlined, 
  RobotOutlined,
  AreaChartOutlined,
  MenuOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useNavigation } from '../../contexts/NavigationContext';
import { ReactNode } from 'react';
import './styles.scss';

// Define navigation item type
interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: ReactNode;
}

/**
 * Navigation: Bottom navigation bar component with icons and labels.
 * Inputs: None
 * Output: JSX.Element - Navigation bar with links to different sections of the app
 */
export function Navigation() {
  const { activeTab } = useNavigation();
  
  // Define navigation items
  const navItems: NavItem[] = [
    {
      id: 'discover',
      path: '/discover',
      label: 'Discover',
      icon: <AppstoreOutlined className="app-navigation__icon" />
    },
    {
      id: 'bots',
      path: '/bots',
      label: 'Bots',
      icon: <RobotOutlined className="app-navigation__icon" />
    },
    {
      id: 'positions',
      path: '/positions',
      label: 'Positions',
      icon: <AreaChartOutlined className="app-navigation__icon" />
    },
    {
      id: 'menu',
      path: '/menu',
      label: 'Menu',
      icon: <MenuOutlined className="app-navigation__icon" />
    }
  ];

  return (
    <div className="app-navigation">
      {navItems.map((item) => (
        <Link 
          key={item.id}
          to={item.path}
          className={`app-navigation__item ${activeTab === item.id ? 'app-navigation__item--active' : ''}`}
        >
          {item.icon}
          <span className="app-navigation__label">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
