import React from 'react';
import { Layout, Button, Typography } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
  SunOutlined,
  MoonOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

interface HeaderBarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onLogoutClick: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  collapsed,
  onToggleCollapse,
  isDarkMode,
  onToggleDarkMode,
  onLogoutClick,
}) => {
  const navigate = useNavigate();

  return (
    <Header
      className='custom-header'
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: collapsed ? 80 : 280,
        height: '64px',
        padding: '0 20px',
        background: 'var(--bg-header)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
        transition: 'left 0.2s ease',
        boxShadow: '0 2px 8px var(--shadow-color)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '-4px' }}>  
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapse}
          className="header-btn header-btn-menu"
        />
        <Text strong style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
          Leak Reporting System
        </Text>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button
          type="text"
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          className="header-btn header-btn-icon"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        />
        <Button
          type="text"
          icon={<SettingOutlined />}
          className="header-btn header-btn-icon"
          onClick={() => navigate('/settings')}
        />
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          className="header-btn header-btn-primary"
          onClick={onLogoutClick}
        >
          Log out
        </Button>
      </div>  
    </Header>
  );
};

export default HeaderBar;
