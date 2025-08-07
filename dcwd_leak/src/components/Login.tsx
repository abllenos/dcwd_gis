import React, { useState, useRef, useEffect } from 'react';
import {
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LottieSpinner from '../components/LottieSpinner';
import '../styles/LoadingOverlay.css';
import { devApi } from './Endpoints/Interceptor';

interface LoginProps {
  onLogin: (userData: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const styles = getStyles(darkMode);
  const pendingSubmitRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || pendingSubmitRef.current) return;
    pendingSubmitRef.current = true;
    setLoading(true);

    try {
         const response = await devApi.post(
        'dcwd-gis/api/v1/admin/userlogin/login',
        { username, password }
         );

         const data = response.data;

         if (data?.statusCode === 200 && data?.data){
          if (data.data?.token) {
            localStorage.setItem('debug_token', data.data.token);
          }
          localStorage.setItem('debug_user_data', JSON.stringify(data.data));
          onLogin(data.data);

          setTimeout(() => navigate('/home'), 1300);
         } else {
          toast.error(data.message || 'Invalid email or password');
          setLoading(false);
          pendingSubmitRef.current = false;
         }
    } catch (err){
      console.error(err);
      toast.error('Failed to connect to server.');
      setLoading(false);
      pendingSubmitRef.current = false;
    }
  };
   
        

  return (
    <div style={styles.container}>
      <ToastContainer position="top-center" autoClose={2500} />

    {loading && (
  <div
    className="loading-overlay fade-in-only"
    aria-live="polite"
    aria-label="Loading"
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.9)',
      opacity: 1,
      animation: 'fadeIn 0.3s ease-in forwards',
    }}
  >
    <LottieSpinner size={200} />
  </div>
)}
      <button onClick={() => setDarkMode(!darkMode)} style={styles.toggleButton}>
        {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
      </button>

      <div style={styles.blurOverlay} />

      <div style={styles.overlay}>
        <form onSubmit={handleSubmit} style={styles.form} aria-busy={loading}>
          <img src="/logo-dcwd.webp" alt="Logo" style={styles.logo} />
          <h2 style={styles.title}>Login</h2>
          <p style={styles.subtitle}>Log in to your account</p>

          <div style={styles.inputGroup}>
            <MailOutlined style={styles.icon} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div style={styles.inputGroup}>
            <LockOutlined style={styles.icon} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...styles.input, paddingRight: '30px' }}
              required
              disabled={loading}
              autoComplete="current-password"
            />
            <span onClick={() => setShowPassword(!showPassword)} style={styles.toggleIcon}>
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: loading ? 0.85 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading ? <LottieSpinner size={24} /> : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

function getStyles(darkMode: boolean): { [key: string]: React.CSSProperties } {
  return {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundImage: `url('/login-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    toggleButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      backgroundColor: darkMode ? '#333' : '#fff',
      color: darkMode ? '#fff' : '#333',
      border: '1px solid #ccc',
      padding: '6px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      zIndex: 2,
    },
    overlay: {
      backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.85)',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
      position: 'relative',
      zIndex: 1,
    },
    logo: {
      width: '70px',
      height: '70px',
      margin: '0 auto 10px auto',
      display: 'block',
    },
    form: {
      width: '250px',
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      marginBottom: '0px',
      textAlign: 'center',
      fontSize: '25px',
      fontWeight: 'bold',
      color: darkMode ? '#fff' : '#333',
    },
    subtitle: {
      marginBottom: '16px',
      textAlign: 'center',
      fontSize: '14px',
      color: darkMode ? '#ccc' : '#666',
    },
    inputGroup: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      background: darkMode ? '#2a2a2a' : '#f5f5f5',
      borderRadius: '4px',
      marginBottom: '16px',
      border: '1px solid #ddd',
      paddingLeft: '10px',
    },
    icon: {
      fontSize: '16px',
      color: darkMode ? '#aaa' : '#888',
      marginRight: '6px',
    },
    input: {
      flex: 1,
      padding: '8px',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      color: darkMode ? '#fff' : '#333',
      fontSize: '14px',
    },
    toggleIcon: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: darkMode ? '#aaa' : '#888',
    },
    button: {
      padding: '10px',
      backgroundColor: '#113983ff',
      color: '#ffffff',
      border: 'none',
      fontWeight: 'bold',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '15px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    blurOverlay: {
      position: 'absolute',
      inset: 0,
      backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
      zIndex: -1,
    },
  };
}

export default Login;
