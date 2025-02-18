import { Menu } from 'antd';
import { 
  AppstoreOutlined, 
  HistoryOutlined,
  SaveOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { useNavigation } from '../../contexts/NavigationContext';
import type { NavigationTab } from '../../contexts/NavigationContext';
import './styles.scss';

const menuItems = [
  {
    key: 'strategies',
    icon: <AppstoreOutlined />,
    label: 'Strategies',
  },
  {
    key: 'trade-logs',
    icon: <HistoryOutlined />,
    label: 'Trade Logs',
  },
  {
    key: 'save-strategies',
    icon: <SaveOutlined />,
    label: 'Save Strategies',
  },
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: 'Profile',
  }
];

export function Navigation() {
  const { activeTab, setActiveTab } = useNavigation();

  return (
    <div className="app-navigation">
      <Menu
        mode="inline"
        selectedKeys={[activeTab]}
        items={menuItems}
        className="app-navigation__menu"
        onClick={({ key }) => setActiveTab(key as NavigationTab)}
      />
    </div>
  );
}
