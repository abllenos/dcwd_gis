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

import DistrictMeteringAreaBoundaries from '../DistrictMeteringAreaBoundaries';
import MapViewer from '../MapViewer';
import AirValveMaintenance from '../AirValveMaintenance';
import FireHydrant from '../FireHydrant';
import IsolationValve from '../IsolationValve';
import PressureSettingValve from '../PressureSettingValve';
import License from '../License';
import VTS from '../vts';
import Reports from '../reports';




import PressureReleaseValve from '../PressureReleaseValve';
import BlowOffValve from '../BlowOffValve';
import PressureMonitoringSystem from '../PressureMonitoringSystem';
import DMAInlet from '../DMAInlet';
import MapInfoUsers from '../MapInfoUsers';
import DistributionTransmission from '../DistributionTransmission';

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
    } else if (e.key === 'home') {
      navigate('/home');
    } else {
      navigate(`/${e.key}`, { replace: true });
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

            <Routes>
              <Route path="home" element={<Home />} />
              <Route path="assets-district-metering-area" element={<DistrictMeteringAreaBoundaries />} />
              <Route path="map-viewer" element={<MapViewer />} />
              <Route path="air-valve" element={<AirValveMaintenance />} />
              <Route path="fire-hydrant" element={<FireHydrant />} />
              <Route path="isolation-valve" element={<IsolationValve />} />
              <Route path="pressure-setting-valve" element={<PressureSettingValve />} />
              <Route path="pressure-release-valve" element={<PressureReleaseValve />} />
              <Route path="blow-off-valve" element={<BlowOffValve />} />
              <Route path="pressure-monitoring-system" element={<PressureMonitoringSystem />} />
              <Route path="dma-inlet" element={<DMAInlet />} />
              <Route path="distribution-transmission" element={<DistributionTransmission />} />
              <Route path="mapinfo-users" element={<MapInfoUsers />} />
              <Route path="/home" element={<Home />} />
              <Route path="/license" element={<License />} />
              <Route path="/vts" element={<VTS />} />
              <Route path="/report" element={<Reports />} />
              <Route path="log" element={<LogPage />} />
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>

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
