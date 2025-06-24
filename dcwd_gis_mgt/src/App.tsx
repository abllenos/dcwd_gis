import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import 'leaflet/dist/leaflet.css';
import NavBar from './components/navbar';
import logo from './assets/image/logo.png';
import './App.css';
import './index.css';
import AccessLevel from './components/AccessLevel';
import Dashboard from './components/CustomerStat';
import UserLogs from './components/UserLogs';
import Department from './components/Department';
import DMAInletTable from './components/DMAInlet';
import PMSTable from './components/PMS';
import RTATable from './components/RTA';
import Login from './components/Login';
import Logout from './components/Logout';
import TableList from './components/rtaViewer';
import EmployeeTable from './components/Employees';
import UserAccounts from './components/UserAccounts';
import { useAuth } from './AuthContext';
import AirValveTable from './components/AirValve';
import PRVTable from './components/PRV';
import PSVTable from './components/PSV';
import BOVTable from './components/BOV';
import FireHydrantList from './components/FireHydrant';
import DistributionList from './components/Distribution';
import IsolationTable from './components/Isolation';
import AccessLevelTable from './components/AccessLevel';

const { Header, Content, Sider } = Layout;

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    isAuthenticated ? (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          theme="light"
          width={256}
          style={{
            position: 'fixed',
            height: '100vh',
            overflow: 'auto',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
          }}
        >
          <img src={logo} style={{ height: '30px', margin: '19px 0 10px 70px' }} alt="dcwd" />
          <NavBar />
        </Sider>
        <Layout style={{ marginLeft: 256 }}>
          <Header style={{ fontSize: '16px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
            <div style={{ fontSize: '20px', fontWeight: 500 }}>Dashboard</div>
            <div style={{ fontSize: '16px', color: '#555' }}>
            <strong>{localStorage.getItem('username')}</strong>
            </div>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/access-level" element={<PrivateRoute><AccessLevel /></PrivateRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/userlogs" element={<PrivateRoute><UserLogs /></PrivateRoute>} />
              <Route path="/department" element={<PrivateRoute><Department /></PrivateRoute>} />
              <Route path="/DMAInlet" element={<PrivateRoute><DMAInletTable /></PrivateRoute>} />
              <Route path="/PMS" element={<PrivateRoute><PMSTable /></PrivateRoute>} />
              <Route path="/RTA" element={<PrivateRoute><RTATable /></PrivateRoute>} />
              <Route path="/rtaViewer" element={<PrivateRoute><TableList /></PrivateRoute>} />
              <Route path="/UserAccounts" element={<PrivateRoute><UserAccounts /></PrivateRoute>} />
              <Route path="/Employees" element={<PrivateRoute><EmployeeTable /></PrivateRoute>} />
              <Route path="/AirValve" element={<PrivateRoute><AirValveTable /></PrivateRoute>} />
              <Route path="/PRV" element={<PrivateRoute><PRVTable /></PrivateRoute>} />
              <Route path="/PSV" element={<PrivateRoute><PSVTable /></PrivateRoute>} />
              <Route path="/BOV" element={<PrivateRoute><BOVTable /></PrivateRoute>} />
              <Route path="/FireHydrant" element={<PrivateRoute><FireHydrantList /></PrivateRoute>} />
              <Route path="/Distribution" element={<PrivateRoute><DistributionList /></PrivateRoute>} />
              <Route path="/Isolation" element={<PrivateRoute><IsolationTable /></PrivateRoute>} />
              <Route path="/AccessLevel" element={<PrivateRoute><AccessLevelTable /></PrivateRoute>} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    ) : (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  );
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default App;
