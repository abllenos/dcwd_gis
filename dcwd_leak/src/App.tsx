import React, { useState } from 'react';
import {
  AppstoreOutlined,
  HomeOutlined,
  SettingOutlined,
  FileTextOutlined,
  ClusterOutlined,
  FileOutlined,
  LogoutOutlined,
  RightOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, Button } from 'antd';

import dcwd from './assets/image/logo.png';
import Home from './components/home';
import ReportALeak from './components/ReportALeak';
import LeakDetection from './components/LeakDetection';
import WaterSupplyConcerns from './components/WaterSupplyConcerns';
import LeakReports from './components/LeakReports';

import './styles/theme.css';

const { Sider, Header, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const iconSize = { fontSize: '17px' };

const bulletLabel = (text: string) => (
  <span>
    <RightOutlined style={{ fontSize: 10, marginRight: 8 }} />
    {text}
  </span>
);

const items: MenuItem[] = [
  {
    key: 'home',
    label: 'Home',
    icon: <HomeOutlined style={iconSize} />,
  },
  {
    key: 'create-report',
    label: 'Create a Report',
    icon: <FileTextOutlined style={iconSize} />,
    children: [
      { key: 'report-a-leak', label: bulletLabel('Report A Leak') },
      { key: 'leak-detection', label: bulletLabel('Leak Detection') },
      { key: 'supply-concerns', label: bulletLabel('Water Supply Concerns') },
    ],
  },
  {
    key: 'operation',
    label: 'Operation',
    icon: <AppstoreOutlined style={iconSize} />,
    children: [
      { key: 'leak-reports', label: bulletLabel('Leak Reports') },
      { key: 'supply-complaints', label: bulletLabel('Supply Complaints') },
      { key: 'quality-complaints', label: bulletLabel('Quality Complaints') },
    ],
  },
  {
    key: 'maintenance',
    label: 'System Maintenance',
    icon: <ClusterOutlined style={iconSize} />,
    children: [
      { key: 'dispatch-override', label: bulletLabel('Dispatch Override') },
      { key: 'caretaker-assignment', label: bulletLabel('Caretaker Assignment') },
      { key: 'access-level', label: bulletLabel('Access Level') },
      { key: 'user-accounts', label: bulletLabel('User Accounts') },
      { key: 'jms-data-seeding', label: bulletLabel('JMS Data Seeding') },
    ],
  },
  {
    key: 'reports',
    label: 'Reports',
    icon: <FileOutlined style={iconSize} />,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <SettingOutlined style={iconSize} />,
  },
  {
    key: 'logout',
    label: 'Logout',
    icon: <LogoutOutlined style={iconSize} />,
  },
];

const App: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('home');
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const onClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'home':
        return <Home />;
      case 'report-a-leak':
        return <ReportALeak />;
      case 'leak-detection':
        return <LeakDetection />;
      case 'supply-concerns':
        return <WaterSupplyConcerns />;
      case 'leak-reports':
        return <LeakReports />;
      default:
        return <div>Select a menu item.</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
        style={{
          backgroundColor: '#4C8BFF',
          overflowY: 'auto',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ padding: 20, textAlign: 'center' }}>
          {!collapsed && (
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
          )}
        </div>

        <Menu
          onClick={onClick}
          selectedKeys={[selectedKey]}
          mode="inline"
          items={items}
          style={{
            fontSize: '16px',
            backgroundColor: '#4C8BFF',
            color: 'white',
            border: 'none',
          }}
          theme="light"
          rootClassName="custom-sidebar-menu"
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e8e8e8',
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: 600,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px' }}
          />
          <span>Leak Reporting</span>
        </Header>

        <Content
          style={{
            padding: 24,
            backgroundColor: '#f5f7fa',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
