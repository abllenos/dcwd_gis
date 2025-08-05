import React, { useState } from 'react';
import {
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginProps {
  onLogin: (userData: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const styles = getStyles(darkMode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        'https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/userlogin/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      console.log('API raw response:', data);

      if (response.ok && data.statusCode === 200) {
        if (data.data?.token) {
          localStorage.setItem('debug_token', data.data.token);
        }
        if (data.data) {
          localStorage.setItem('debug_user_data', JSON.stringify(data.data));
        }

        toast.success('You have logged in successfully.');
        onLogin(data.data);

        setTimeout(() => navigate('/home'), 1500);
      } else {
        toast.error(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to connect to server.');
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer position="top-center" autoClose={2500} />
      <button onClick={() => setDarkMode(!darkMode)} style={styles.toggleButton}>
        {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
      </button>

      <div style={styles.blurOverlay} />

      <div style={styles.overlay}>
        <form onSubmit={handleSubmit} style={styles.form}>
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
            />
            <span onClick={() => setShowPassword(!showPassword)} style={styles.toggleIcon}>
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          </div>

          <button type="submit" style={styles.button}>
            Log In
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
    },
    overlay: {
      backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.85)',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)',
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
    },
    blurOverlay: {
      position: 'absolute',
      inset: 0,
      backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(3px)',
      zIndex: -1,
    },
  };
}

export default Login;
