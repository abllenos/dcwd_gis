import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { Book, Box, Monitor, LogOut, Settings } from 'react-feather';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { key: '1', icon: <Monitor />, label: <span><Link to="./Dashboard">Dashboard</Link></span> },
  {
    key: 'sub2',
    icon: <Box />,
    label: 'Data Layers',
    children: [
      { key: '2', label: <span><strong>ASSETS</strong></span> },
      { key: '3', label: <span><Link to="#">District Metering Area</Link></span> },
      { key: '4', label: <span><Link to="#">Map Viewer</Link></span> },
      { key: '5', label: <span><strong>VALVE</strong></span> },
      { key: '6', label: <span><Link to="#">Air Valve</Link></span> },
      { key: '7', label: <span><Link to="#">Fire Hydrant</Link></span> },
      { key: '8', label: <span><Link to="#">Isolation Valve</Link></span> },
      { key: '9', label: <span><Link to="#">Pressure Setting Valve</Link></span> },
      { key: '10', label: <span><Link to="#">Pressure Release Valve</Link></span> },
      { key: '11', label: <span><Link to="#">Blow Off Valve</Link></span> },
      { key: '12', label: <span><Link to="#">Pressure Monitoring Valve</Link></span> },
      { key: '13', label: <span><strong>PIPE NETWORK</strong></span> },
      { key: '14', label: <span><Link to="#">Distribution & Transmission Valve</Link></span> },
      { key: '15', label: <span><strong>DISTRICT METERING AREA</strong></span> },
      { key: '16', label: <span><Link to="#">DMA Inlet</Link></span> }
    ]
  },
  {
    key: 'sub3',
    label: 'Management',
    icon: <Book />,
    children: [
      { key: '17', label: <span><Link to="./UserLogs">Logs</Link></span> },
    ]
  },
  {
    key: 'sub4',
    icon: <Box />,
    label: 'System Management',
    children: [
      { key: '18', label: <span><Link to="./AccessLevel">Access Level</Link></span> },
      { key: '19', label: <span><Link to="./Department">Department</Link></span> },
      { key: '20', label: <span><Link to="./UserList">User Accounts</Link></span> },
    ]
  },
  { key: '21', icon: <Settings />, label: <span><Link to="./account-settings">Account Settings</Link></span> },
  { key: '22', icon: <LogOut />, label: <span><Link to="./logout">Log Out</Link></span> }
];

const NavBar: React.FC = () => {
  return (
    <div>
      <Menu
        theme="light"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
      />
    </div>
  );
};

export default NavBar;
