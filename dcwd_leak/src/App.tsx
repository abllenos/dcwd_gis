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
import Home from './components/home'; 
import ReportALeak from './components/ReportALeak';

type MenuItem = Required<MenuProps>['items'][number];

const iconSize = { fontSize: '17px'};

const items: MenuItem[] = [
  {
    key: 'home',
    label: 'Home',
    icon: <HomeOutlined style = {iconSize} />,
  },
  {
    key: 'create-report',
    label: 'Create a Report',
    icon: <FileTextOutlined style = {iconSize} />,
    children: [
      { key: 'report-a-leak', label: 'Report A Leak' },
      { key: 'leak-detection', label: 'Leak Detection' },
      { key: 'supply-concerns', label: 'Water Supply Concerns' },
    ],
  },
  {
    key: 'operation',
    label: 'Operation',
    icon: <AppstoreOutlined style = {iconSize} />,
    children: [
      { key: 'leak-reports', label: 'Leak Reports' },
      { key: 'supply-complaints', label: 'Supply Complaints' },
      { key: 'quality-complaints', label: 'Quality Complaints' },
    ],
  },
  {
    key: 'maintenance',
    label: 'System Maintenance',
    icon: <ClusterOutlined style = {iconSize} />,
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
    icon: <FileOutlined style = {iconSize} />,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <SettingOutlined style = {iconSize} />,
  },
  {
    key: 'logout',
    label: 'Logout',
    icon: <LogoutOutlined style = {iconSize} />,
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
        return <ReportALeak />;
      default:
        return <div>Select a menu item.</div>;
    }
  };

    return (
  <div style={{ display: 'flex', backgroundColor: '#f5f7fa' }}>
    <div
      style={{
        width: 256,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        borderRight: '1px solid #e0e0e0',
        backgroundColor: '#ffffff',
        overflowY: 'auto',
        boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        zIndex: 1000,
      }}
    >
      <div style={{ padding: 20, textAlign: 'center' }}>
        <img
          src={dcwd}
          alt="DCWD Logo"
          style={{
            maxWidth: '80%',
            height: 'auto',
            borderRadius: 8,
            boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.1)',
          }}
        />
      </div>
      <Menu
        onClick={onClick}
        selectedKeys={[selectedKey]}
        mode="inline"
        items={items}
        style={{ fontSize: '16px', border: 'none' }}
      />
    </div>

    <div style={{ marginLeft: 256, flex: 1, minHeight: '100vh' }}>
      <div
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid #e8e8e8',
          fontSize: '18px',
          fontWeight: 600,
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>Leak Reporting</span>
      </div>

      <div
        style={{
          padding: 24,
          backgroundColor: '#f5f7fa',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {renderContent()}
      </div>
    </div>
  </div>
);

};

export default App;
