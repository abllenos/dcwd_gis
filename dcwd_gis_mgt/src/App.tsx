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
import { useAuth } from './AuthContext';

const { Header, Content, Sider } = Layout;

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    isAuthenticated ? (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider theme="light" width={256}>
          <img src={logo} style={{ height: '30px', margin: '19px 0 10px 70px' }} alt="dcwd" />
          <NavBar />
        </Sider>
        <Layout>
          <Header style={{ fontSize: '25px', background: 'white' }}>
            <span style={{ fontWeight: '400', margin: '0 0 0 0' }}></span>
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
