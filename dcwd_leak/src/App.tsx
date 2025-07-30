import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Login from './components/Login';
import Home from './components/home';
import ReportALeak from './components/CreateReport/ReportALeak';
import LeakDetection from './components/CreateReport/LeakDetection';
import WaterSupplyConcerns from './components/CreateReport/WaterSupplyConcerns';
import LeakReports from './components/Operations/LeakReports';
import SupplyComplaints from './components/Operations/SupplyComplaints';

import './styles/theme.css';

const ProtectedRoute = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const user = sessionStorage.getItem('user');
    return !!user;
  });

  const handleLogin = (userData: any) => {
    sessionStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login onLogin={handleLogin} />} />

        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/report-a-leak" element={<ReportALeak />} />
          <Route path="/leak-detection" element={<LeakDetection />} />
          <Route path="/supply-concerns" element={<WaterSupplyConcerns />} />
          <Route path="/leak-reports" element={<LeakReports />} />
          <Route path="/supply-complaints" element={<SupplyComplaints />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
