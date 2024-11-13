import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Modal } from 'antd';
import { Book, Box, Home, LogOut, Monitor, Settings } from 'react-feather';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    Modal.confirm({
      title: 'Are you sure you want to log out?',
      content: 'Your session will be closed and you will be redirected to the login page.',
      okText: 'Yes, log me out',
      cancelText: 'Cancel',
      onOk: () => navigate('/logout'), 
    });
  };

  const items: MenuItem[] = [
    { key: '1', icon: <Monitor />, label: <Link to="/Dashboard">Dashboard</Link> },
    {
      key: 'sub2',
      icon: <Box />,
      label: 'Data Layers',
      children: [
        { key: 'sub2-1', label: <strong>ASSETS</strong> },
        { key: 'sub2-2', label: <Link to="#">District Metering Area</Link> },
        { key: 'sub2-3', label: <Link to="#">Map Viewer</Link> },
        { key: 'sub2-4', label: <strong>VALVE</strong> },
        { key: 'sub2-5', label: <Link to="#">Air Valve</Link> },
        { key: 'sub2-6', label: <Link to="#">Fire Hydrant</Link> },
        { key: 'sub2-7', label: <Link to="#">Isolation Valve</Link> },
        { key: 'sub2-8', label: <Link to="#">Pressure Setting Valve</Link> },
        { key: 'sub2-9', label: <Link to="#">Pressure Release Valve</Link> },
        { key: 'sub2-10', label: <Link to="#">Blow Off Valve</Link> },
        { key: 'sub2-11', label: <Link to="/PMS">Pressure Monitoring Valve</Link> },
        { key: 'sub2-12', label: <strong>PIPE NETWORK</strong> },
        { key: 'sub2-13', label: <Link to="#">Distribution & Transmission Valve</Link> },
        { key: 'sub2-14', label: <strong>DISTRICT METERING AREA</strong> },
        { key: 'sub2-15', label: <Link to="/DMAInlet">DMA Inlet</Link> },
        { key: 'sub2-16', label: <strong>SEWERAGE AND SANITATION</strong> },
        { key: 'sub2-17', label: <Link to="/RTA">Rapid Technical Assessment Program</Link> },
      ],
    },
    {
      key: 'sub3',
      label: 'Management',
      icon: <Book />,
      children: [
        { key: 'sub3-1', label: <Link to="/UserLogs">Logs</Link> },
      ],
    },
    {
      key: 'sub4',
      icon: <Box />,
      label: 'System Management',
      children: [
        { key: 'sub4-1', label: <Link to="/AccessLevel">Access Level</Link> },
        { key: 'sub4-2', label: <Link to="/Department">Department</Link> },
        { key: 'sub4-3', label: <Link to="/UserList">User Accounts</Link> },
      ],
    },
    { key: '23', icon: <Settings />, label: <Link to="/account-settings">Account Settings</Link> },
    { key: '24', icon: <LogOut />, label: <span onClick={handleLogoutClick}>Log Out</span> },
  ];

  return (
    <Menu
      theme="light"
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};

export default NavBar;
