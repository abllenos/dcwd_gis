import React, { useState } from 'react';
import {
  AppstoreOutlined,
  HomeOutlined,
  SettingOutlined,
  DesktopOutlined,
  FileTextOutlined,
  ClusterOutlined,
  FileOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import dcwd from './assets/image/logo.png';
import Home from './components/home'; // your home component

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'home',
    label: 'Home',
    icon: <HomeOutlined />,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <DesktopOutlined />,
  },
  {
    key: 'create-report',
    label: 'Create a Report',
    icon: <FileTextOutlined />,
    children: [
      { key: 'report-a-leak', label: 'Report A Leak' },
      { key: 'leak-detection', label: 'Leak Detection' },
      { key: 'supply-concerns', label: 'Water Supply Concerns' },
    ],
  },
  {
    key: 'operation',
    label: 'Operation',
    icon: <AppstoreOutlined />,
    children: [
      { key: 'leak-reports', label: 'Leak Reports' },
      { key: 'supply-complaints', label: 'Supply Complaints' },
      { key: 'quality-complaints', label: 'Quality Complaints' },
    ],
  },
  {
    key: 'maintenance',
    label: 'System Maintenance',
    icon: <ClusterOutlined />,
    children: [
      { key: 'dispatch-override', label: 'Dispatch Override' },
      { key: 'caretaker-assignment', label: 'Caretaker Assignment' },
      { key: 'access-level', label: 'Access Level' },
      { key: 'user-accounts', label: 'User Accounts' },
      { key: 'jms-data-seeding', label: 'JMS Data Seeding' },
    ],
  },
  {
    key: 'reports',
    label: 'Reports',
    icon: <FileOutlined />,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <SettingOutlined />,
  },
  {
    key: 'logout',
    label: 'Logout',
    icon: <LogoutOutlined />,
  }
];

const App: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('home');

  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'home':
        return <Home />;
      case 'dashboard':
        return <div>Dashboard</div>;
      case 'report-a-leak':
        return <div>Report A Leak</div>;
      // Add more cases for other keys as needed
      default:
        return <div>Select a menu item.</div>;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: 256, borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: 16, textAlign: 'center' }}>
          <img src={dcwd} alt="DCWD Logo" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
        <Menu
          onClick={onClick}
          selectedKeys={[selectedKey]}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
        />
      </div>
      <div style={{ flex: 1, padding: 24 }}>{renderContent()}</div>
    </div>
  );
};

export default App;
