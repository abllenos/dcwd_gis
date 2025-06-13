import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Modal } from 'antd';
import {
  Book,
  Box,
  Monitor,
  Settings,
  LogOut,
} from 'react-feather';
import type { MenuProps } from 'antd';
import { useAuth } from '../AuthContext';

type MenuItem = Required<MenuProps>['items'][number];

const createLinkItem = (key: string, label: string, path?: string): MenuItem => ({
  key,
  label: path ? <Link to={path}>{label}</Link> : <span style={{ fontWeight: 600 }}>{label}</span>,
});

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
  if (key === 'logout') {
    navigate('/logout');
  }
};

  const dataLayers: MenuItem[] = [
    createLinkItem('sub2-1', 'ASSETS'),
    createLinkItem('sub2-2', 'District Metering Area', '#'),
    createLinkItem('sub2-3', 'Map Viewer', '#'),
    createLinkItem('sub2-4', 'VALVE'),
    createLinkItem('sub2-5', 'Air Valve', '/AirValve'),
    createLinkItem('sub2-6', 'Fire Hydrant', '#'),
    createLinkItem('sub2-7', 'Isolation Valve', '#'),
    createLinkItem('sub2-8', 'Pressure Setting Valve', '/PSV'),
    createLinkItem('sub2-9', 'Pressure Release Valve', '/PRV'),
    createLinkItem('sub2-10', 'Blow Off Valve', '/BOV'),
    createLinkItem('sub2-11', 'Pressure Monitoring Valve', '/PMS'),
    createLinkItem('sub2-12', 'PIPE NETWORK'),
    createLinkItem('sub2-13', 'Distribution & Transmission Valve', '#'),
    createLinkItem('sub2-14', 'DISTRICT METERING AREA'),
    createLinkItem('sub2-15', 'DMA Inlet', '/DMAInlet'),
    createLinkItem('sub2-16', 'SEWERAGE AND SANITATION'),
    createLinkItem('sub2-17', 'Rapid Technical Assessment Program', '/RTA'),
    createLinkItem('sub2-18', 'RTA Viewer', '/rtaViewer'),
  ];

  const management: MenuItem[] = [
    createLinkItem('sub3-1', 'Logs', '/UserLogs'),
    createLinkItem('sub3-2', 'Employees', '/Employees'),
  ];

  const systemManagement: MenuItem[] = [
    createLinkItem('sub4-1', 'Access Level', '/AccessLevel'),
    createLinkItem('sub4-2', 'Department', '/Department'),
    createLinkItem('sub4-3', 'User Accounts', '/UserAccounts'),
  ];

  const items: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <Monitor />,
      label: <Link to="/Dashboard">Dashboard</Link>,
    },
    {
      key: 'data-layers',
      icon: <Box />,
      label: 'Data Layers',
      children: dataLayers,
    },
    {
      key: 'management',
      icon: <Book />,
      label: 'Management',
      children: management,
    },
    {
      key: 'system-management',
      icon: <Box />,
      label: 'System Management',
      children: systemManagement,
    },
    {
      key: 'account-settings',
      icon: <Settings />,
      label: <Link to="/account-settings">Account Settings</Link>,
    },
    {
      key: 'logout',
      icon: <LogOut />,
      label: <span>Log Out</span>,
    },
  ];

  return (
    <Menu
      theme="light"
      mode="inline"
      defaultSelectedKeys={['dashboard']}
      defaultOpenKeys={['data-layers']}
      items={items}
      onClick={handleMenuClick}
    />
  );
};

export default NavBar;
