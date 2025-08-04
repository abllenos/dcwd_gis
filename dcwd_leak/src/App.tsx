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
import Login from './components/Login';
import dcwd from './assets/image/logo.png';
import Home from './components/home';
import Settings from './components/Settings';
import ReportALeak from './components/CreateReport/ReportALeak';
import LeakDetection from './components/CreateReport/LeakDetection';
import WaterSupplyConcerns from './components/CreateReport/WaterSupplyConcerns';

import LeakReports from './components/Operations/LeakReports';
import SupplyComplaints from './components/Operations/SupplyComplaints';
import QualityComplaints from './components/Operations/QualityComplaints';

import DispatchOveride from './components/SystemMaintenance/DispatchOveride';
import CaretakerAssignment from './components/SystemMaintenance/CaretakerAssignment';
import AccessLevel from './components/SystemMaintenance/AccessLevel';
import UserAccounts from './components/SystemMaintenance/UserAccounts';
import JMSDataSeeding from './components/SystemMaintenance/JMSDataSeeding';
import Reports from './components/Report/Reports';

import './styles/theme.css';

const { Sider, Header, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const iconSize = { fontSize: '17px' };

const bulletLabel = (text: string) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span
      style={{
    
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: '#333',
        marginRight: 8,
        marginLeft: 2,
      }}
    />
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
    icon: <FileTextOutlined style={iconSize}/>,
    children: [
      { key: 'report-a-leak', label: bulletLabel('Report A Leak') },
      { key: 'leak-detection', label: bulletLabel('Leak Detection') },
      { key: 'supply-concerns', label: bulletLabel('Water Supply Concerns') },
    ]
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
      case 'supply-complaints':
        return <SupplyComplaints />;
      case 'quality-complaints':
        return <QualityComplaints />;
      case 'dispatch-override':
        return <DispatchOveride />;
      case 'caretaker-assignment':
        return <CaretakerAssignment />;
      case 'access-level':
        return <AccessLevel />;
      case 'user-accounts':
        return <UserAccounts />;
      case 'jms-data-seeding':
        return <JMSDataSeeding />;
      case 'settings':
        return <Settings />;
      case 'reports':
        return <Reports />;
      default:
        return <div>Select a menu item.</div>;
    }
  };

  const siderWidth = collapsed ? 80 : 280;

  return (
    <Layout style={{ minHeight: '100vh', fontFamily: 'Noto Sans, sans-serif' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={80}
        width={280}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 1000,
          height: '100vh',
          backgroundColor: '#D0EBFF',
          overflowY: 'auto',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease',
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
            backgroundColor: '#D0EBFF',
            color: 'white',
            border: 'none',
          }}
          theme="light"
        />
      </Sider>

      <Layout style={{ marginLeft: siderWidth, transition: 'margin-left 0.2s ease' }}>
        <Header
          style={{
            position: 'fixed',
            top: 0,
            left: siderWidth,
            right: 0,
            height: 64,
            padding: '0 24px',
            backgroundColor: '#E7F2FF',
            borderBottom: '1px solid #949899ff',
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
            style={{ fontSize: '16px', marginRight: 16 }}
          />
          <span>Leak Reporting System</span>
        </Header>

        <Content
          style={{
            marginTop: 64,
            padding: 24,
            backgroundColor: '#E7F2FF',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
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
