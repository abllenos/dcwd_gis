import React, { useState, useEffect } from 'react';
import 'antd/dist/reset.css';
import {
  AppstoreOutlined,
  HomeOutlined,
  SettingOutlined,
  FileTextOutlined,
  ClusterOutlined,
  FileOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, Modal } from 'antd';
import type { MenuProps } from 'antd';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
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
import UserAccounts from './components/SystemMaintenance/UserAccounts';
import JMSDataSeeding from './components/SystemMaintenance/JMSDataSeeding';
import Reports from './components/Report/Reports';
import LeakOptionsModal from './components/Modals/LeakOptionsModal';
import WaterSupplyConcern from './components/CreateReport/WaterSupplyConcerns';
import ReportALeak from './components/CreateReport/ReportALeak';

import './styles/theme.css';
import 'antd/dist/reset.css';


const { Sider, Header, Content } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const iconSize = { fontSize: '17px' };

const bulletLabel = (text: string) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        backgroundColor: '#ffffff',
        marginRight: 8,
        marginLeft: 2,
      }}
    />
    {text}
  </span>
);

const items: MenuItem[] = [
  { key: 'home', label: 'Home', icon: <HomeOutlined style={iconSize} /> },
  { key: 'create-report', label: 'Create a Report', icon: <FileTextOutlined style={iconSize} />},
  { key: 'operation', label: 'Operation', icon: <AppstoreOutlined style={iconSize} />,
    children: [
      { key: 'leak-reports', label: bulletLabel('Leak Reports') },
      { key: 'supply-complaints', label: bulletLabel('Supply Complaints') },
      { key: 'quality-complaints', label: bulletLabel('Quality Complaints') },
    ],
  },
  { key: 'maintenance', label: 'System Maintenance', icon: <ClusterOutlined style={iconSize} />,
    children: [
      { key: 'dispatch-override', label: bulletLabel('Dispatch Override') },
      { key: 'caretaker-assignment', label: bulletLabel('Caretaker Assignment') },
      { key: 'access-level', label: bulletLabel('Access Level') },
      { key: 'user-accounts', label: bulletLabel('User Accounts') },
      { key: 'jms-data-seeding', label: bulletLabel('JMS Data Seeding') },
    ],
  },
  { key: 'reports', label: 'Reports', icon: <FileOutlined style={iconSize} /> },
  { key: 'settings', label: 'Settings', icon: <SettingOutlined style={iconSize} /> },
  { key: 'logout', label: 'Logout', icon: <LogoutOutlined style={iconSize} /> },
];

const getSidebarWidth = () => {
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1600) return Math.min(screenWidth * 0.2, 300); 
  if (screenWidth >= 1200) return Math.min(screenWidth * 0.22, 280); 
  return 280;
};

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
<<<<<<< HEAD
  const [sidebarWidth, setSidebarWidth] = useState(getSidebarWidth());
      
  
=======
  const [logoutModalVisible, setLogoutModalVisible] = useState(false); 

>>>>>>> 03edde4fac47f90e80704fed1e549dc81d51414f
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleLogoutConfirmed = () => {
    setLogoutModalVisible(false);
    onLogout();
    navigate('/login');
  };

  const handleModalSelect = (option: string) => {
    setModalVisible(false);

    switch (option) {
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

  return (
    <>
      <Layout>
        <Sider
          breakpoint='lg'
          onBreakpoint={(broken) => setCollapsed(broken)}
          trigger={null}
          collapsible
          collapsed={collapsed}
<<<<<<< HEAD
          width={sidebarWidth}
          className={`custom-sider ${collapsed ? 'collapsed' : ''}`}
=======
          collapsedWidth={80}
          width={280}
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            zIndex: 1000,
            height: '100vh',
            backgroundColor: '#d0e8faff',
            overflowY: 'auto',
            boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
          }}
>>>>>>> 03edde4fac47f90e80704fed1e549dc81d51414f
        >
          <div className = 'sider-logo-wrapper'>
            {collapsed ? (
              <img
                src={dcwdIcon}
                alt="DCWD Icon"
                className='sider-logo collapsed-logo'
              />
            ):(
              <img
                src={dcwd}
                alt ="DCWD Logo"
                className= 'sider-logo expanded-logo'
              />
            )}
          </div>
          <Menu
            className="custom-sidebar-menu"
            onClick={onClick}
            selectedKeys={[location.pathname.replace('/', '') || 'home']}
            mode="inline"
            items={items}
<<<<<<< HEAD
=======
            style={{
              fontSize: '16px',
              backgroundColor: '#d0e8faff',
              color: 'white',
              border: 'none',
            }}
>>>>>>> 03edde4fac47f90e80704fed1e549dc81d51414f
            theme="light"
            className="custom-sidebar-menu"
          />
        </Sider>

        <Layout style={{ marginLeft: collapsed? 80: sidebarWidth, transition: 'margin-left 0.2s ease' }}>
          <Header
            className='custom-header'
            style={{
<<<<<<< HEAD
              left: collapsed? 80: sidebarWidth,
=======
              position: 'fixed',
              top: 0,
              left: siderWidth,
              right: 0,
              height: 64,
              padding: '0 24px',
              backgroundColor: '#d0e8faff',
              borderBottom: '1px solid #b6daf5ff',
              display: 'flex',
              alignItems: 'center',
              fontSize: '18px',
              fontWeight: 600,
              zIndex: 1000,
>>>>>>> 03edde4fac47f90e80704fed1e549dc81d51414f
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', marginRight: 16, color: 'white'}}
            />
            <span>Leak Reporting System</span>
          </Header>

          <Content
            style={{
              marginTop: 64,
              padding: 24,
              backgroundColor: '#ffffff',
              minHeight: 'calc(100vh - 64px)',
            }}
          >
            <Routes>
              <Route path="home" element={<Home />} />
              <Route path="leak-reports" element={<LeakReports />} />
              <Route path="supply-complaints" element={<SupplyComplaints />} />
              <Route path="quality-complaints" element={<QualityComplaints />} />
              <Route path="dispatch-override" element={<DispatchOveride />} />
              <Route path="caretaker-assignment" element={<CaretakerAssignment />} />
              <Route path="access-level" element={<AccessLevel />} />
              <Route path="user-accounts" element={<UserAccounts />} />
              <Route path="jms-data-seeding" element={<JMSDataSeeding />} />
              <Route path="settings" element={<Settings />} />
              <Route path="reports" element={<Reports />} />
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
<Modal
  title={
    <div style={{ textAlign: 'center', width: '100%' }}>
      <span style={{ fontSize: '20px', fontWeight: 600, color: '#17212eff' }}>
        Confirm Logout
      </span>
    </div>
  }
  visible={logoutModalVisible}
  onOk={handleLogoutConfirmed}
  onCancel={() => setLogoutModalVisible(false)}
  okText="Logout"
  cancelText="Cancel"
  centered
  width={500}
  closeIcon={null}
  okButtonProps={{
     type: 'primary', 
     danger: true,  
     style: {
      padding: '6px 20px',
      fontSize: '15px',
      borderRadius: '6px',
      width: '120px',
    },
  }}
  cancelButtonProps={{
    style: {
      padding: '6px 20px',
      fontSize: '15px',
      borderRadius: '6px',
      width: '120px',
    },
  }}
  style={{ textAlign: 'center' }} 
  footer={(_, { OkBtn, CancelBtn }) => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      <CancelBtn />
      <OkBtn />
    </div>
  )}
>
  <div
    style={{
      background: '#E7F4FF',
      padding: '20px 30px',
      borderRadius: 8,
    }}
  >
    <p
      style={{
        color: '#003A8C',
        margin: 0,
        fontSize: '16px',
        fontWeight: 500,
        textAlign: 'center',
      }}
    >
      Do you really want to log out of the system?
    </p>
  </div>
</Modal>
    </>
  );
};

const WaterSupplyConcernsWrapper: React.FC = () => {
  const location = useLocation();
  const formType = (location.state as any)?.formType ?? 'no_water';

  return <WaterSupplyConcern formType={formType} />;
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });

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
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
