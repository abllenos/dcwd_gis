import React, { useState, useRef } from 'react';
import { MailOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
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
  const pendingSubmit = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || pendingSubmit.current) return;
    pendingSubmit.current = true;
    setLoading(true);

    try {
      const { data } = await devApi.post('dcwd-gis/api/v1/admin/userlogin/login', { username, password });

      if (data?.statusCode === 200 && data?.data?.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('username', username);
        localStorage.setItem('debug_user_data', JSON.stringify(data.data));
        onLogin(data.data.token);
        setTimeout(() => navigate('/home', { replace: true }), 1300);
      } else {
        toast.error(data.message || 'Invalid email or password');
        setLoading(false);
        pendingSubmit.current = false;
      }
    } catch {
      toast.error('Failed to connect to server.');
      setLoading(false);
      pendingSubmit.current = false;
    }
  };

  const inputs = [
    {
      icon: <MailOutlined style={styles.icon} />,
      type: 'text',
      placeholder: 'Username',
      value: username,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value),
      autoComplete: 'username',
      extra: null,
    },
    {
      icon: <LockOutlined style={styles.icon} />,
      type: showPassword ? 'text' : 'password',
      placeholder: 'Password',
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
      autoComplete: 'current-password',
      extra: (
        <span onClick={() => setShowPassword(!showPassword)} style={styles.toggleIcon}>
          {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </span>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes waterFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(0,180,255,0.6), 0 0 20px rgba(0,180,255,0.4); }
          50% { box-shadow: 0 0 20px rgba(0,180,255,0.9), 0 0 40px rgba(0,180,255,0.6); }
        }
        @keyframes inputGlow {
          0%, 100% { text-shadow: 0 0 3px rgba(0,200,255,0.6); }
          50% { text-shadow: 0 0 6px rgba(0,200,255,1); }
        }
        .glow-input { animation: inputGlow 2s infinite; }
        ::placeholder {
          color: rgba(200, 240, 255, 0.7) !important;
          text-shadow: 0 0 5px rgba(0,200,255,0.5);
        }
      `}</style>

      <ToastContainer position="top-center" autoClose={2500} />

      {loading && (
        <div className="loading-overlay fade-in-only" style={styles.loadingOverlay}>
          <LottieSpinner size={200} />
        </div>
      )}

      <button onClick={() => setDarkMode(!darkMode)} style={styles.toggleButton}>
        {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
      </button>

      <div style={styles.overlay}>
        <img src="/logo-dcwd.webp" alt="Logo" style={styles.logo} />

        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Login</h2>
          <p style={styles.subtitle}>LEAK REPORTING SYSTEM</p>

          {inputs.map(({ icon, type, placeholder, value, onChange, autoComplete, extra }, i) => (
            <div key={i} style={styles.inputGroup}>
              {icon}
              <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                style={i === 1 ? { ...styles.input, paddingRight: 30 } : styles.input}
                className="glow-input"
                required
                disabled={loading}
                autoComplete={autoComplete}
              />
              {extra}
            </div>
          ))}

          <button
            type="submit"
            style={{ ...styles.button, opacity: loading ? 0.85 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            disabled={loading}
          >
            {loading ? <LottieSpinner size={24} /> : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

const getStyles = (darkMode: boolean): { [key: string]: React.CSSProperties } => ({
  container: {
    display: 'flex',
    height: '100vh',
    background: darkMode ? 'linear-gradient(135deg, #02101d, #03263b, #06445e)' : 'linear-gradient(135deg, #07304b, #0d4f6e, #0d3e53ff)',
    backgroundSize: '400% 400%',
    animation: 'waterFlow 15s ease infinite',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  toggleButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: darkMode ? '#333' : '#fff',
    color: darkMode ? '#fff' : '#333',
    border: '1px solid #ccc',
    padding: '6px 10px',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
    zIndex: 2,
  },
  overlay: {
  backgroundColor: darkMode ? 'rgba(10,20,30,0.55)' : 'rgba(0,0,0,0.45)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: 16,
  border: '1px solid rgba(0,255,255,0.4)',
  padding: '100px 30px 40px',
  width: 350,
  height: 480,   
 overflow: 'visible',
  textAlign: 'center',
  position: 'relative',
  animation: 'pulseGlow 3s infinite',
  color: '#fff',
},
  logo: {
    width: 90,
    height: 'auto',
    position: 'absolute',
    top: -40,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 26,
    fontWeight: 800,
    fontFamily: 'Arial',
    letterSpacing: 0.5,
    marginTop: -15,
    marginBottom: 20,
    color: '#fff',
    textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 8px rgba(0,123,255,0.4)',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'sans-serif',
    letterSpacing: 0.3,
    color: '#e0e0e0',
    marginTop: -10,
    marginBottom: 20,
    textShadow: '0 1px 4px rgba(0,0,0,0.4), 0 0 4px rgba(0,123,255,0.2)',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    marginBottom: 28,
    paddingLeft: 10,
  },
  icon: {
    fontSize: 16,
    color: '#fff',
    marginRight: 6,
  },
  input: {
    flex: 1,
    padding: '14px 12px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 14,
    color: 'inherit',
  },
  toggleIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: '#fff',
  },
  button: {
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #00aaff, #004466)',
    color: '#fff',
    border: 'none',
    fontWeight: 'bold',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 15,
  },
  loadingOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});

export default Login;