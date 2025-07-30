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
import { Layout, Menu, Button } from 'antd';
import type { MenuProps } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import dcwd from './assets/image/logo.png';
import Home from './components/home';
import ReportALeak from './components/ReportALeak';
import LeakDetection from './components/LeakDetection';
import WaterSupplyConcerns from './components/WaterSupplyConcerns';
import LeakReports from './components/LeakReports';
import Login from './components/Login';

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
    key: 'report-a-leak',
    label: bulletLabel('Report A Leak'),
    icon: <FileTextOutlined style={iconSize} />,
  },
  {
    key: 'leak-detection',
    label: bulletLabel('Leak Detection'),
    icon: <FileTextOutlined style={iconSize} />,
  },
  {
    key: 'supply-concerns',
    label: bulletLabel('Water Supply Concerns'),
    icon: <FileTextOutlined style={iconSize} />,
  },
  {
    key: 'leak-reports',
    label: bulletLabel('Leak Reports'),
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

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('home');
  const navigate = useNavigate();

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      onLogout();
      navigate('/login');
    } else {
      setSelectedKey(e.key);
      navigate(`/${e.key}`);
    }
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
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={260}
        style={{
          backgroundColor: '#4C8BFF',
          overflowY: 'auto',
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
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            backgroundColor: '#fff',
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

        <Content style={{ padding: 24, backgroundColor: '#f5f7fa' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={() => setIsLoggedIn(false)} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
