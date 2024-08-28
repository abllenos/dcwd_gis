import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider theme='light' width={256}>
          <img src={logo} style={{ height: '30px', margin: '19px 0 10px 70px' }} alt="dcwd" />
          <NavBar />
        </Sider>
        <Layout>
          <Header style={{ fontSize: '25px', background: 'white' }}>
            <span style={{ fontWeight: '400', margin: '0 0 0 0' }}> </span>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <Routes>
              <Route path="/access-level" element={<AccessLevel />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/userlogs" element={<UserLogs />} />
              <Route path="/UserLogs" element={<UserLogs />} />
              <Route path="/department" element={<Department />} />
            </Routes>
          </Content>
          
        </Layout>
      </Layout>
    
    </Router>
      
  );
};

export default App;
