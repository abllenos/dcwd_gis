import { useEffect } from 'react';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/layout/Dashboard';
import { getTheme } from './components/layout/getTheme';

import './styles/theme.css';
import 'antd/dist/reset.css';
import { observer } from 'mobx-react-lite';
import { loginStore } from './stores/loginStore';


const App = observer(() => {
  const isLoggedIn = loginStore.isLoggedIn;
  const isDarkMode = loginStore.darkMode;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("token_expiry");

    if (token && expiry) {
      const now = Date.now();
      const expiryTime = parseInt(expiry, 10);

      if (now > expiryTime) {
        handleLogout();
      } else {
        loginStore.setUserDataFromToken(token, expiryTime, localStorage.getItem('username') || '');

        const timeout = expiryTime - now;
        const timer = setTimeout(() => {
          handleLogout();
        }, timeout);

        return () => clearTimeout(timer);
      }
    } else {
      loginStore.clearUserData();
    }
  }, []);

  const handleLogin = (token: string) => {
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem("token", token);
    localStorage.setItem("token_expiry", expiry.toString());
    loginStore.setUserDataFromToken(token, expiry, localStorage.getItem('username') || '');

    setupAutoLogout(expiry);
  };

  const updateDarkMode = (value: boolean) => {
    loginStore.setDarkMode(value);
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
    loginStore.clearUserData();
  };

  return (
    <ConfigProvider theme={getTheme(isDarkMode)} wave={{ disabled: true }}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/*"
            element={
              isLoggedIn ? (
                <Dashboard
                  onLogout={handleLogout}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={updateDarkMode}
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
});

export default App;
