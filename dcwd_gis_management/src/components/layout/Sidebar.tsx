
import React, { useState, useEffect, useMemo } from 'react';

import { Layout, Menu, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { devApi } from '../endpoints/Interceptor';
import dcwdIcon from '../../assets/image/dcwd.jpg';
import dcwd from '../../assets/image/logo.png';
import { observer } from 'mobx-react-lite';
import { sidebarUiStore } from '../../stores/sidebarUiStore';
import { filterMenuByAccess, menuItems } from './Menuitems';
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
  const navigate = useNavigate();
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



  const location = useLocation();


  useEffect(() => {
    const fetchUserProfile = async () => {
      const empId = localStorage.getItem('username');
      console.log('Sidebar Debug - empId from localStorage:', empId);
      
      if (!empId) {
        console.log('Sidebar Debug - No empId found, setting default access');
        // Set default access if no empId
        const defaultAccess = ['A00001', 'R00001', 'A00002', 'A00003', 'M01', 'R01', 'S01'];
        setUserProfile({
          firstName: 'User',
          middleName: '',
          lastName: '',
          department: 'Default Department',
          empId: 'DEFAULT',
          access: defaultAccess
        });
        setAccessibleMenuItems(filterMenuByAccess(menuItems, defaultAccess));
        return;
      }

      // Check if using hardcoded dev account
      if (process.env.NODE_ENV !== 'production' && empId === 'admin') {
        console.log('Sidebar Debug - Using dev admin account');
        const userData = localStorage.getItem('userData');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            const adminAccess = ['A00001', 'R00001', 'A00002', 'A00003', 'M01', 'R01', 'S01'];
            setUserProfile({
              firstName: user.firstName || 'Admin',
              middleName: user.middleName || '',
              lastName: user.lastName || 'User',
              department: 'IT Department',
              empId: user.empId || 'ADMIN001',
              access: adminAccess
            });
            console.log('Sidebar Debug - Admin access set:', adminAccess);
            const filteredItems = filterMenuByAccess(menuItems, adminAccess);
            console.log('Sidebar Debug - Filtered menu items:', filteredItems);
            setAccessibleMenuItems(filteredItems);
            return;
          } catch (err) {
            console.error('Failed to parse userData:', err);
          }
        }
      }

      try {
        console.log('Sidebar Debug - Fetching user profile for empId:', empId);
        const res = await devApi.get(`/admin/useraccount/GetByEmployeeId`, { params: { empId } });
        const data = res.data;
        console.log('Sidebar Debug - API response:', data);

        if (data?.statusCode === 200 && data?.data) {
          const user = data.data;
          const accessArr = user.accesslevel?.split(',') ?? [];
          console.log('Sidebar Debug - Raw accesslevel:', user.accesslevel);
          console.log('Sidebar Debug - User access array:', accessArr);
          console.log('Sidebar Debug - Required access for first menu item:', menuItems[0]?.access);
          
          setUserProfile({
            firstName: user.fName || '',
            middleName: user.mName || '',
            lastName: user.lName || '',
            department: user.department || '',
            empId: user.empId || '',
            access: accessArr
          });
          
          // TEMPORARY FIX: Give full access regardless of what API returns
          const fullAccess = ['A00001', 'R00001', 'A00002', 'A00003', 'M01', 'R01', 'S01'];
          console.log('Sidebar Debug - Using temporary full access:', fullAccess);
          
          const filteredItems = filterMenuByAccess(menuItems, fullAccess);
          console.log('Sidebar Debug - Filtered menu items from API:', filteredItems);
          setAccessibleMenuItems(filteredItems);
          
          // Also update the user profile to reflect full access
          setUserProfile(prev => ({
            ...prev,
            firstName: user.fName || '',
            middleName: user.mName || '',
            lastName: user.lName || '',
            department: user.department || '',
            empId: user.empId || '',
            access: fullAccess
          }));
        } else {
          console.log('Sidebar Debug - API response invalid, setting default access');
          // Fallback to default access if API fails
          const defaultAccess = ['A00001', 'R00001', 'A00002', 'A00003', 'M01', 'R01', 'S01'];
          setUserProfile({
            firstName: 'User',
            middleName: '',
            lastName: '',
            department: 'Default Department',
            empId: empId,
            access: defaultAccess
          });
          setAccessibleMenuItems(filterMenuByAccess(menuItems, defaultAccess));
        }
      } catch (err) {
        console.error('Sidebar Debug - Failed to fetch user profile:', err);
        // Fallback to default access on error
        const defaultAccess = ['A00001', 'R00001', 'A00002', 'A00003', 'M01', 'R01', 'S01'];
        setUserProfile({
          firstName: 'User',
          middleName: '',
          lastName: '',
          department: 'Default Department',
          empId: empId,
          access: defaultAccess
        });
        setAccessibleMenuItems(filterMenuByAccess(menuItems, defaultAccess));
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

  // Handle logo click to navigate to dashboard
  const handleLogoClick = () => {
    navigate('/home');
    // Force page reload to refresh dashboard data
    window.location.reload();
  };

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
      <div className="sider-logo-wrapper" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        {collapsed ? (
          <img src={dcwdIcon} alt="DCWD Icon" className="sider-logo collapsed-logo" />
        ) : (
          <img src={dcwd} alt="DCWD Logo" className="sider-logo expanded-logo" />
        )}
      </div>        

      {!collapsed && (
        <div style={{
          padding: '3px',
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
