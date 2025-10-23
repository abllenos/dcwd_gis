
import React, { useEffect, useMemo } from 'react';

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

const Sidebar: React.FC<SidebarProps> = observer(({ collapsed, onCollapse, onMenuClick }) => {
  const sidebarWidth = sidebarUiStore.sidebarWidth;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const empId = localStorage.getItem('username');
      
      if (!empId) {
        // Set default access if no empId
        const defaultAccess = ['A00001', 'R00001', 'A00002', 'A00003', 'M01', 'R01', 'S01'];
        sidebarUiStore.setUserProfile({
          firstName: 'User',
          middleName: '',
          lastName: '',
          department: 'Default Department',
          empId: 'DEFAULT',
          access: defaultAccess
        });
        sidebarUiStore.setAccessibleMenuItems(filterMenuByAccess(menuItems, defaultAccess));
        return;
      }

      // Check if using hardcoded dev account
      if (process.env.NODE_ENV !== 'production' && empId === 'admin') {
        const userData = localStorage.getItem('userData');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            const adminAccess = ['A00001', 'R00001', 'A00002', 'A00003', 'M01', 'R01', 'S01'];
            sidebarUiStore.setUserProfile({
              firstName: user.firstName || 'Admin',
              middleName: user.middleName || '',
              lastName: user.lastName || 'User',
              department: 'IT Department',
              empId: user.empId || 'ADMIN001',
              access: adminAccess
            });
            const filteredItems = filterMenuByAccess(menuItems, adminAccess);
            sidebarUiStore.setAccessibleMenuItems(filteredItems);
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
          
          // TEMPORARY FIX: Give full access regardless of what API returns
          const fullAccess = ['A00001', 'R00001', 'A00002', 'A00003', 'M01', 'R01', 'S01'];
          
          const filteredItems = filterMenuByAccess(menuItems, fullAccess);
          
          sidebarUiStore.setUserProfile({
            firstName: user.fName || '',
            middleName: user.mName || '',
            lastName: user.lName || '',
            department: user.department || '',
            empId: user.empId || '',
            access: fullAccess
          });
          sidebarUiStore.setAccessibleMenuItems(filteredItems);
        } else {
          // Fallback to default access if API fails
          const defaultAccess = ['A00001', 'R00001', 'A00002', 'A00003', 'M01', 'R01', 'S01'];
          sidebarUiStore.setUserProfile({
            firstName: 'User',
            middleName: '',
            lastName: '',
            department: 'Default Department',
            empId: empId || '',
            access: defaultAccess
          });
          sidebarUiStore.setAccessibleMenuItems(filterMenuByAccess(menuItems, defaultAccess));
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        // Fallback to default access on error
        const defaultAccess = ['A00001', 'R00001', 'A00002', 'A00003', 'M01', 'R01', 'S01'];
        sidebarUiStore.setUserProfile({
          firstName: 'User',
          middleName: '',
          lastName: '',
          department: 'Default Department',
          empId: empId || '',
          access: defaultAccess
        });
        sidebarUiStore.setAccessibleMenuItems(filterMenuByAccess(menuItems, defaultAccess));
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
        sidebarUiStore.setOpenKeys([mi.key as string]);
        return;
      }
    }
    
    // Reset open keys if on top-level page
    sidebarUiStore.setOpenKeys([]);
  }, [location.pathname]);

  // Handle exclusive dropdown behavior - only one submenu can be open at a time
  const handleOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find(key => sidebarUiStore.openKeys.indexOf(key) === -1);
    
    // Get all parent menu keys that have children
    const parentMenuKeys = menuItems
      .filter(item => item.children && item.children.length > 0)
      .map(item => item.key as string);
    
    if (latestOpenKey && parentMenuKeys.includes(latestOpenKey)) {
      // If opening a new submenu, close all others and open only the new one
      sidebarUiStore.setOpenKeys([latestOpenKey]);
    } else {
      // If closing a submenu or no new submenu being opened
      sidebarUiStore.setOpenKeys(keys.filter(key => parentMenuKeys.includes(key)));
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
              {sidebarUiStore.fullName || 'Loading...'}
            </Text>
            <Text style={{ display: 'block', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              {sidebarUiStore.userProfile.empId || 'Loading ID...'}
            </Text>
          </div>
        </div>
      )}

      <Menu
        className="modern-menu"
        onClick={onMenuClick}
        selectedKeys={selectedKeys}
        openKeys={sidebarUiStore.openKeys}
        onOpenChange={handleOpenChange}
        mode="inline"
        items={sidebarUiStore.accessibleMenuItems || []}
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
