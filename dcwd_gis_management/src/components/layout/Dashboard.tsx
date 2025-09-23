import React from 'react';
import { Layout } from 'antd';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import Sidebar from './Sidebar';
import HeaderBar from './Headerbar';
import LogoutModal from '../modal/LogoutModal';

import Home from '../Home';
import LogPage from '../LogPage';
import { observer } from 'mobx-react-lite';
import { dashboardUiStore } from '../../stores/dashboardUiStore';


const { Content } = Layout;

interface DashboardProps {
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = observer(({ 
  onLogout, 
  isDarkMode: appIsDarkMode, 
  setIsDarkMode: setAppIsDarkMode 
}) => {
  const collapsed = dashboardUiStore.collapsed;
  const logoutModalVisible = dashboardUiStore.logoutModalVisible;
      
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newTheme = !appIsDarkMode;
    setAppIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      dashboardUiStore.showLogoutModal(); 
    } else if (e.key === 'create-report') {
      navigate('/create-report');
    } else {
      navigate(`/${e.key}`);
    }
  };

  const handleLogoutConfirmed = () => {
    dashboardUiStore.hideLogoutModal();
    onLogout();
    navigate('/login');
  };

  const handleToggleCollapse = () => {
    dashboardUiStore.toggleCollapsed();
  };

  const handleCollapseBreakpoint = (broken: boolean) => {
    dashboardUiStore.setCollapsed(broken);
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
            onLogoutClick={() => dashboardUiStore.showLogoutModal()}
          />

          <Content
            style={{
              marginTop: 64,
              padding: '24px',
              backgroundColor: 'var(--bg-secondary)',
              minHeight: 'calc(100vh - 64px)',
            }}
          >
            <div style={{ maxWidth: 1510, margin: '0 auto' }}>
              <Routes>
                <Route path="home" element={<Home />} />
                <Route path="log" element={<LogPage />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>

      <LogoutModal
        visible={logoutModalVisible}
        onConfirm={handleLogoutConfirmed}
        onCancel={() => dashboardUiStore.hideLogoutModal()}
      />
    </>
  );
});

export default Dashboard;
