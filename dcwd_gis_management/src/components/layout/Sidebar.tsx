import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useLocation } from 'react-router-dom';
import { devApi } from '../endpoints/Interceptor';
import dcwdIcon from '../../assets/image/dcwd.jpg';
import dcwd from '../../assets/image/logo.png';
import { menuItems, getSidebarWidth, filterMenuByAccess } from './Menuitems';

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

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse, onMenuClick }) => {
  const [sidebarWidth, setSidebarWidth] = useState(getSidebarWidth());
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: '',
    middleName: '',
    lastName: '',
    department: '',
    empId: '',
    access: []
  });
  const [accessibleMenuItems, setAccessibleMenuItems] = useState<MenuProps['items']>([]);

  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const empId = localStorage.getItem('username');
      if (!empId) return;

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

  useEffect(() => {
    const handleResize = () => setSidebarWidth(getSidebarWidth());
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
        selectedKeys={[location.pathname.replace('/', '') || 'home']}
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
};

export default Sidebar;
