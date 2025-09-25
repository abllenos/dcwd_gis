
import React, { useState, useEffect, useMemo } from 'react';

import { Layout, Menu, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useLocation } from 'react-router-dom';
import { devApi } from '../endpoints/Interceptor';
import dcwdIcon from '../../assets/image/dcwd.jpg';
import dcwd from '../../assets/image/logo.png';
import { observer } from 'mobx-react-lite';
import { sidebarUiStore } from '../../stores/sidebarUiStore';
import { filterMenuByAccess, menuItems } from './Menuitems';


import { menuItems } from './Menuitems';
import SideSubmenuPanel from './SideSubmenuPanel';
import '../../styles/sidepanel.css';

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (broken: boolean) => void;
  onMenuClick: MenuProps['onClick'];
}

interface UserProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  department: string;
  empId: string;
  access: string[];
}

const Sidebar: React.FC<SidebarProps> = observer(({ collapsed, onCollapse, onMenuClick }) => {
  const sidebarWidth = sidebarUiStore.sidebarWidth;
  const [userProfile, setUserProfile] = React.useState<UserProfile>({
    firstName: '',
    middleName: '',
    lastName: '',
    department: '',
    empId: '',
    access: []
  });


  const [accessibleMenuItems, setAccessibleMenuItems] = React.useState<MenuProps['items']>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // ...existing code...
  const [topLevelMenuItems, setTopLevelMenuItems] = useState<MenuProps['items']>([]);
  const [sideOpen, setSideOpen] = useState(false);
  const [sideTitle, setSideTitle] = useState('');
  const [sideItems, setSideItems] = useState<{ key: string; label: string }[]>([]);


  const location = useLocation();


  useEffect(() => {
    const fetchUserProfile = async () => {
      const empId = localStorage.getItem('username');
      if (!empId) return;

      // Check if using hardcoded dev account
      if (process.env.NODE_ENV !== 'production' && empId === 'admin') {
        const userData = localStorage.getItem('userData');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            setUserProfile({
              firstName: user.firstName || 'Admin',
              middleName: user.middleName || '',
              lastName: user.lastName || 'User',
              department: 'IT Department',
              empId: user.empId || 'ADMIN001',
              access: ['A00001', 'R00001', 'A00002', 'A00003', 'M01', 'R01', 'S01'] // Give admin access to all menu items
            });
            setAccessibleMenuItems(filterMenuByAccess(menuItems, ['A00001', 'R00001', 'A00002', 'A00003', 'M01', 'R01', 'S01']));
            return;
          } catch (err) {
            console.error('Failed to parse userData:', err);
          }
        }
      }

      try {
        const res = await devApi.get(`/admin/useraccount/GetByEmployeeId`, { params: { empId } });
        const data = res.data;

        if (data?.statusCode === 200 && data?.data) {
          const user = data.data;
          const accessArr = user.accesslevel?.split(',') ?? [];
          setUserProfile({
            firstName: user.fName || '',
            middleName: user.mName || '',
            lastName: user.lName || '',
            department: user.department || '',
            empId: user.empId || '',
            access: accessArr
          });
          setAccessibleMenuItems(filterMenuByAccess(menuItems, accessArr));
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  // Memoized selected keys based on current location
  const selectedKeys = useMemo(() => {
    const pathKey = location.pathname.replace('/', '') || 'home';
    
    // If it's a top-level item
    if (menuItems.some(mi => mi.key === pathKey)) {
      return [pathKey];
    }
    
    // If it's a child item, return the child key
    for (const mi of menuItems) {
      if (mi.children?.some(ch => ch.key === pathKey)) {
        return [pathKey];
      }
    }
    
    return ['home'];
  }, [location.pathname]);

  // Set initial open keys based on current location
  useEffect(() => {
    const pathKey = location.pathname.replace('/', '') || 'home';
    
    // If current page is a child item, open its parent
    for (const mi of menuItems) {
      if (mi.children?.some(ch => ch.key === pathKey)) {
        setOpenKeys([mi.key]);
        return;
      }
    }
    
    // Reset open keys if on top-level page
    setOpenKeys([]);
  }, [location.pathname]);

  // Handle exclusive dropdown behavior - only one submenu can be open at a time
  const handleOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    
    // Get all parent menu keys that have children
    const parentMenuKeys = menuItems
      .filter(item => item.children && item.children.length > 0)
      .map(item => item.key);
    
    if (latestOpenKey && parentMenuKeys.includes(latestOpenKey)) {
      // If opening a new submenu, close all others and open only the new one
      setOpenKeys([latestOpenKey]);
    } else {
      // If closing a submenu or no new submenu being opened
      setOpenKeys(keys.filter(key => parentMenuKeys.includes(key)));
    }
  };



  useEffect(() => {
    const handleResize = () => sidebarUiStore.recalcWidth();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Sider
      breakpoint='lg'
      onBreakpoint={onCollapse}
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={sidebarWidth}
      className="modern-sidebar"
      style={{
        background: 'var(--bg-sidebar)',
        boxShadow: '2px 0 8px var(--shadow-color)',
      }}
    >
      <div className="sider-logo-wrapper">
        {collapsed ? (
          <img src={dcwdIcon} alt="DCWD Icon" className="sider-logo collapsed-logo" />
        ) : (
          <img src={dcwd} alt="DCWD Logo" className="sider-logo expanded-logo" />
        )}
      </div>        

      {!collapsed && (
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <Avatar 
            size={95} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#6782f5', marginBottom: '12px' }}
          />
          <div>
            <Text strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-primary)' }}>
              {`${userProfile.firstName} ${userProfile.middleName} ${userProfile.lastName}`.trim() || 'Loading...'}
            </Text>
            <Text style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              {userProfile.empId || 'Loading ID...'}
            </Text>
          </div>
        </div>
      )}

      <Menu
        className="modern-menu"
        onClick={onMenuClick}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        mode="inline"
        items={accessibleMenuItems}
        style={{
          border: 'none',
          background: 'transparent',
          fontSize: '14px'
        }}
      />
    </Sider>
  );
});

export default Sidebar;
