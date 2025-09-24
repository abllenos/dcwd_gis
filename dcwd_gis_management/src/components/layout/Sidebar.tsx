
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
import { filterMenuByAccess, menuItems, getSidebarWidth } from './Menuitems';
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
  const [topLevelMenuItems, setTopLevelMenuItems] = useState<MenuProps['items']>([]);
  const [sideOpen, setSideOpen] = useState(false);
  const [sideTitle, setSideTitle] = useState('');
  const [sideItems, setSideItems] = useState<{ key: string; label: string }[]>([]);


  const location = useLocation();
  const selectedTopKey = useMemo(() => {
    const pathKey = location.pathname.replace('/', '') || 'home';
    // If the path is a top-level item, use it
    if (menuItems.some(mi => mi.key === pathKey)) return pathKey;
    // Otherwise, find a parent that contains this child
    for (const mi of menuItems) {
      if (mi.children?.some(ch => ch.key === pathKey)) return mi.key;
    }
    return 'home';
  }, [location.pathname]);

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
            setTopLevelMenuItems(buildTopLevelMenu(menuItems, ['A00001', 'R00001', 'A00002', 'A00003', 'M01', 'R01', 'S01']));
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
          setTopLevelMenuItems(buildTopLevelMenu(menuItems, accessArr));
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  // Build a list of children for the side panel, including group headers (disabled items)
  const getAccessibleChildren = (parentKey: string) => {
    const parent = menuItems.find(mi => mi.key === parentKey);
    if (!parent || !parent.children) return [];
    const accessSet = new Set(userProfile.access);
    return parent.children
      .filter(c => !c.access || c.access.some(a => accessSet.has(a)))
      .map(c =>
        c.disabled
          ? { key: c.key, label: String(c.label), type: 'header' as const }
          : { key: c.key, label: String(c.label), type: 'item' as const }
      );
  };

  // Create top-level items only, without rendering nested dropdowns
  function buildTopLevelMenu(items: any[], access: string[]): MenuProps['items'] {
    const accessSet = new Set(access);
    return items
      .filter(it => !it.access || it.access.some((a: string) => accessSet.has(a)))
      .map(it => ({ key: it.key, label: it.label, icon: it.icon }));
  }

  const leftOffset = useMemo(() => (collapsed ? 80 : sidebarWidth), [collapsed, sidebarWidth]);

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
        onClick={(e) => {
          const children = getAccessibleChildren(e.key);
          if (children.length > 0) {
            const parent = menuItems.find(mi => mi.key === e.key);
            setSideTitle(String(parent?.label ?? 'Menu'));
            setSideItems(children);
            setSideOpen(true);
            return;
          }
          onMenuClick?.(e);
        }}
  selectedKeys={[selectedTopKey]}
        mode="inline"
        items={topLevelMenuItems} 
        style={{
          border: 'none',
          background: 'transparent',
          fontSize: '14px'
        }}
      />

      {/* Side submenu panel */}
      <SideSubmenuPanel
        open={sideOpen}
        title={sideTitle}
        items={sideItems}
        leftOffset={leftOffset}
        onClose={() => setSideOpen(false)}
        onSelect={(key) => {
          setSideOpen(false);
          onMenuClick?.({ key } as any);
        }}
      />
    </Sider>
  );
});

export default Sidebar;
