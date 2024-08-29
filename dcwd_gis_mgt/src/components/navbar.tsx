import React from 'react';
import { AbortedDeferredError, Link } from 'react-router-dom';
import { Menu } from 'antd';
import { Book, Box, Home, LogOut, Monitor, Settings } from 'react-feather';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [

  { key: '1', icon: <Monitor />, label: <Link to="/Dashboard">Dashboard</Link> },
  {
    key: 'sub2',
    icon: <Box/>,
    label: 'Data Layers',
    children: [
      { key: '2', label: <strong>ASSETS</strong>},
      { key: '3', label: <Link to ="#">District Metering Area</Link>},
      { key: '4', label: <Link to ="#">Map Viewer</Link>},
      { key: '5', label: <strong>VALVE</strong>},
      { key: '6', label: <Link to ="#">Air Valve</Link>},
      { key: '7', label: <Link to ="#">Fire Hydrant</Link>},
      { key: '8', label: <Link to ="#">Isolation Valve</Link>},
      { key: '9', label: <Link to ="#">Pressure Setting Valve</Link>},
      { key: '10', label: <Link to ="#">Pressure Release Valve</Link>},
      { key: '11', label: <Link to ="#">Blow Off Valve</Link>},
      { key: '12', label: <Link to ="/PMS">Pressure Monitoring Valve</Link>},
      { key: '13', label: <strong>PIPE NETWORK</strong>},
      { key: '14', label: <Link to ="#">Distribution & Transmission Valve</Link>},
      { key: '15', label: <strong>DISTRICT METERING AREA</strong>},
      { key: '16', label: <Link to ="/DMAInlet">DMA Inlet</Link>}
    ]
  },
  {
    key: 'sub3',
    label: 'Management',
    icon: <Book />,
    children: [
      { key: '17', label: <Link to="/UserLogs">Logs</Link> },
    ]
  },
 
  {
    key: 'sub4',
    icon: <Box />,
    label: 'System Management',
    children: [
      { key: '18', label: <Link to="./AccessLevel">Access Level</Link> },
      { key: '19', label: <Link to="/Department">Department</Link> },
      { key: '20', label: <Link to="/UserList">User Accounts</Link> },
    ]
  },
  { key: '21', icon: <Settings />, label: <Link to="/account-settings">Account Settings</Link> },
  { key: '22', icon: <LogOut />, label: <Link to="/logout">Log Out</Link> }
];

const NavBar: React.FC = () => {
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