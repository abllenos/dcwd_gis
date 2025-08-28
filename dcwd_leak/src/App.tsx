import React, { useState, useEffect } from 'react';
import 'antd/dist/reset.css';
import {
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  ClusterOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
  BellOutlined,
  SunOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, ConfigProvider, Avatar, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import Login from './components/Login';
import dcwdIcon from './assets/image/dcwd.jpg';
import dcwd from './assets/image/logo.png';
import Home from './components/home';
import Settings from './components/Settings';
import LeakReports from './components/Operations/LeakReports';
import SupplyComplaints from './components/Operations/SupplyComplaints';
import QualityComplaints from './components/Operations/QualityComplaints';
import DispatchOveride from './components/SystemMaintenance/DispatchOveride';
import CaretakerAssignment from './components/SystemMaintenance/CaretakerAssignment';
import AccessLevel from './components/SystemMaintenance/AccessLevel';
import Reports from './components/Report/Reports';
import LeakOptionsModal from './components/Modals/LeakOptionsModal';
import WaterSupplyConcern from './components/CreateReport/WaterSupplyConcerns';
import ReportALeak from './components/CreateReport/ReportALeak';
import { devApi } from './components/Endpoints/Interceptor';
import { useNavigate } from 'react-router-dom';
import LogoutModal from './components/Modals/LogoutModal'; 


import './styles/theme.css';
import 'antd/dist/reset.css';
const { Sider, Header, Content } = Layout;
const { Text } = Typography;
type MenuItem = Required<MenuProps>['items'][number];

const iconSize = { fontSize: '18px' };

const items: MenuItem[] = [
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

const getSidebarWidth = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1600) return Math.min(screenWidth * 0.2, 300); 
  if (screenWidth >= 1200) return Math.min(screenWidth * 0.22, 285); 
  return 280;
};

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(getSidebarWidth());
  const [userProfile, setUserProfile] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    department: '',
    empId: ''
  });
const [logoutModalVisible, setLogoutModalVisible] = useState(false);
      
  const navigate = useNavigate();
  const location = useLocation();


   useEffect(() => {
    const fetchUserProfile = async () => {
      const empId = localStorage.getItem('username');
      if (!empId) return;

      try {
        const res = await devApi.get(
          `dcwd-gis/api/v1/admin/useraccounts/GetByEmployeeID`,
          { params: { empId } }
        );

        const data = res.data;
        if (data?.statusCode === 200 && data?.data) {
          const user = data.data;
          setUserProfile({
            firstName: user.firstname || '',
            middleName: user.middlename || '',
            lastName: user.lastname || '',
            department: user.department || '',
            empId: user.empId || ''
          });
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

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      setLogoutModalVisible(true); 
    } else if (e.key === 'create-report') {
      setModalVisible(true);
    } else {
      navigate(`/${e.key}`);
    }
  };

  const handleModalSelect = (option: string) => {
    setModalVisible(false);

    switch(option) {
      case 'no_water':
        navigate('/water-supply-concerns', { state: { formType: 'no_water' } });
        break;
      case 'low_pressure':
        navigate('/water-supply-concerns', { state: { formType: 'low_pressure' } });
        break;
      case 'no_water_supply':
        navigate('/water-supply-concerns', { state: { formType: 'no_water_supply' } });
        break;
      case 'report_leak':
        navigate('/report-a-leak', { state: { formType: 'report_leak' } });
        break;
      default:
        break;
    }
  };

  const handleLogoutConfirmed = () => {
    setLogoutModalVisible(false);
    onLogout();
    navigate('/login');
  };

  return (
    <>
      <Layout>
        <Sider
          breakpoint='lg'
          onBreakpoint={(broken) => setCollapsed(broken)}
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={280}
          className="modern-sidebar"
          style={{
            background: '#fff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          }}
        >

          <div className="sider-logo-wrapper">
            {collapsed ? (
              <img 
                src={dcwdIcon} 
                alt="DCWD Icon" 
                className="sider-logo collapsed-logo" 
              />
            ) : (
              <img 
                src={dcwd} 
                alt="DCWD Logo" 
                className="sider-logo expanded-logo" 
              />
            )}
          </div>        

          {!collapsed && (
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #f0f0f0',
              textAlign: 'center'
            }}>
              <Avatar 
                size={95} 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: '#6782f5',
                  marginBottom: '12px'
                }}
              />
              <div>
                <Text strong style={{ display: 'block', fontSize: '14px', color: '#262626' }}>
                  {`${userProfile.firstName} ${userProfile.middleName} ${userProfile.lastName}`.trim() || 'Loading...'}
                </Text>
                <Text style={{ display: 'block', fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                  {userProfile.department || 'Loading department...'}
                </Text>
                <Text style={{ display: 'block', fontSize: '11px', color: '#bfbfbf', marginTop: '2px' }}>
                  {userProfile.empId || 'Loading ID...'}
                </Text>
              </div>
            </div>
          )}

          <Menu
            className="modern-menu"
            onClick={onClick}
            selectedKeys={[location.pathname.replace('/', '') || 'home']}
            mode="inline"
            items={items}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '14px'
            }}
          />
        </Sider>

        <Layout style={{ 
          marginLeft: collapsed ? 80 : 280, 
          transition: 'margin-left 0.2s ease',
        }}>
          <Header
            className='custom-header'
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              left: collapsed ? 80 : 280,
              height: '64px',
              padding: '0 20px',
              background: '#fff',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 1000,
              transition: 'left 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '-4px' }}>  
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="header-btn header-btn-menu"
              />
              <Text strong style={{ fontSize: '16px', color: '#262626' }}>
                Leak Reporting System
              </Text>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

              <Button
                type="text"
                icon={<SunOutlined />}
                className="header-btn header-btn-icon"
              />
              <Button
                type="text"
                icon={<BellOutlined />}
                className="header-btn header-btn-icon"
              />
              <Button
                type="text"
                icon={<SettingOutlined />}
                className="header-btn header-btn-icon"
                onClick={() => navigate('/settings')}
              />
              <Button
                type="primary"
                icon={<LogoutOutlined />}
                className="header-btn header-btn-primary"
                onClick={() => {
                  onLogout();
                  navigate('/login');
                }}
              >
                Log out
              </Button>
            </div>  
          </Header>

          <Content
            style={{
              marginTop: 64,
              padding: 24,
              backgroundColor: '#f5f6fa',
              minHeight: 'calc(100vh - 64px)',
            }}
          >
            <Routes>
              <Route path="home" element={<Home />} />
              <Route path="leak-reports" element={<LeakReports />} />
              <Route path="supply-complaints" element={<SupplyComplaints />} />
              <Route path="quality-complaints" element={<QualityComplaints />} />
              <Route path="dispatch-overide" element={<DispatchOveride />} />
              <Route path="caretaker-assignment" element={<CaretakerAssignment />} />
              <Route path="access-level" element={<AccessLevel />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="water-supply-concerns" element={<WaterSupplyConcernsWrapper />} />
              <Route path="report-a-leak" element={<ReportALeak />} />
              <Route path="*" element={<Navigate to="home" />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>

      <LeakOptionsModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSelect={handleModalSelect}
      />

      <LogoutModal
        visible={logoutModalVisible}
        onConfirm={handleLogoutConfirmed}
        onCancel={() => setLogoutModalVisible(false)}
      />
    </>
  );
};

const WaterSupplyConcernsWrapper: React.FC = () => {
  const location = useLocation();
  const formType = (location.state as any)?.formType ?? 'no_water';
  return <WaterSupplyConcern formType={formType} />;
};

const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    fontFamily: 'Noto Sans, -apple-system, BlinkMacSystemFont, sans-serif',
    borderRadius: 8,
  },
  components: {
    Form: {
      labelFontSize: 12,
      labelColor: '#262626',
    },
    Button: {
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
    },
  },
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });

  // Token expiry check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("token_expiry");

    if (token && expiry) {
      const now = Date.now();
      const expiryTime = parseInt(expiry, 10);

      if (now > expiryTime) {
        handleLogout();
      } else {
        setIsLoggedIn(true);

        const timeout = expiryTime - now;
        const timer = setTimeout(() => {
          handleLogout();
        }, timeout);

        return () => clearTimeout(timer);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogin = (token: string) => {
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem("token", token);
    localStorage.setItem("token_expiry", expiry.toString());
    setIsLoggedIn(true);

    setupAutoLogout(expiry);
  };

  const setupAutoLogout = (expiry:number) => {
    const timeout = expiry - new Date ().getTime();
    if (timeout > 0) {
      setTimeout (() => {
        handleLogout();
      }, timeout);
    } else {
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry"); 
    localStorage.removeItem("debug_user_data");
    setIsLoggedIn(false);
  };

  return (
    <ConfigProvider theme={theme}>
    <Router>
      <Routes>

  <Route
    path="/login"
    element={<Login onLogin={handleLogin} />} 
  />
  <Route
    path="/*"
    element={
      isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />
    }
  />
</Routes>

    </Router>
    </ConfigProvider>
  );
};

export default App;
