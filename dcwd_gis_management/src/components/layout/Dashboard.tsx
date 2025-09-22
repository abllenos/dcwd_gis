import React, { useState } from 'react';
import { Layout } from 'antd';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import Sidebar from './Sidebar';
import HeaderBar from './Headerbar';
import LogoutModal from '../modal/LogoutModal';

import Home from '../Home';


const { Content } = Layout;

interface DashboardProps {
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  onLogout, 
  isDarkMode: appIsDarkMode, 
  setIsDarkMode: setAppIsDarkMode 
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
      
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newTheme = !appIsDarkMode;
    setAppIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      setLogoutModalVisible(true); 
    } else if (e.key === 'create-report') {
      navigate('/create-report');
    } else {
      navigate(`/${e.key}`);
    }
  };

  const handleLogoutConfirmed = () => {
    setLogoutModalVisible(false);
    onLogout();
    navigate('/login');
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleCollapseBreakpoint = (broken: boolean) => {
    setCollapsed(broken);
  };

  return (
    <>
      <Layout>
        <Sidebar
          collapsed={collapsed}
          onCollapse={handleCollapseBreakpoint}
          onMenuClick={onClick}
        />

        <Layout style={{ 
          marginLeft: collapsed ? 80 : 280, 
          transition: 'margin-left 0.2s ease',
        }}>
          <HeaderBar
            collapsed={collapsed}
            onToggleCollapse={handleToggleCollapse}
            isDarkMode={appIsDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onLogoutClick={() => setLogoutModalVisible(true)}
          />

          <Content
            style={{
              marginTop: 64,
              padding: 24,
              backgroundColor: 'var(--bg-secondary)',
              minHeight: 'calc(100vh - 64px)',
            }}
          >
            <Routes>
              <Route path="home" element={<Home />} />
              <Route path="*" element={<Navigate to="home" />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>

      <LogoutModal
        visible={logoutModalVisible}
        onConfirm={handleLogoutConfirmed}
        onCancel={() => setLogoutModalVisible(false)}
      />
    </>
  );
};

export default Dashboard;
