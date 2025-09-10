import {
  HomeOutlined,
  FileTextOutlined,
  ClusterOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const iconSize = { fontSize: '18px' };

export const menuItems: MenuItem[] = [
  { key: 'home', label: 'Dashboard', icon: <HomeOutlined style={iconSize} /> },
  { key: 'create-report', label: 'Create a Report', icon: <FileTextOutlined style={iconSize} />},
  { 
    key: 'operations', 
    label: 'Operations', 
    icon: <AppstoreOutlined style={iconSize} />,
    children: [
      { key: 'leak-reports', label: 'Leak Reports' },
      { key: 'supply-complaints', label: 'Water Supply Complaints' },
      { key: 'quality-complaints', label: 'Water Quality Complaints' },
    ],
  },
  { 
    key: 'system-maintenance', 
    label: 'System Maintenance', 
    icon: <SettingOutlined style={iconSize} />,
    children: [
      { key: 'dispatch-overide', label: 'Dispatch Override' },
      { key: 'caretaker-assignment', label: 'Caretaker Assignment' },
      { key: 'access-level', label: 'Access Level' },
    ],
  },
  { key: 'reports', label: 'Reports', icon: <ClusterOutlined style={iconSize} /> },
];

export const getSidebarWidth = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1600) return Math.min(screenWidth * 0.2, 300); 
  if (screenWidth >= 1200) return Math.min(screenWidth * 0.22, 285); 
  return 280;
};
