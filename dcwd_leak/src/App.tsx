import React, { useState, useEffect } from 'react';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './layout/Dashboard';
import { getTheme } from './layout/getTheme';

import './styles/theme.css';
import 'antd/dist/reset.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Apply theme to document on app load
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

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

  const updateDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    document.documentElement.setAttribute('data-theme', value ? 'dark' : 'light');
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
    <ConfigProvider theme={getTheme(isDarkMode)}>
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
                <Dashboard
                  onLogout={handleLogout}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={updateDarkMode}
                  themeMode={isDarkMode ? 'dark' : 'light'}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
