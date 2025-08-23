import React from "react";
import { observer } from "mobx-react-lite";
import { MailOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LottieSpinner from "../components/LottieSpinner";
import "../styles/LoadingOverlay.css";
import { loginStore } from "../stores/loginStore";

interface LoginProps {
  onLogin: (userData: any) => void;
}

const Login: React.FC<LoginProps> = observer(({ onLogin }) => {
  const navigate = useNavigate();
  const styles = getStyles(loginStore.darkMode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginStore.login(onLogin, navigate);
  };

  const inputs = [
    {
      icon: <MailOutlined style={styles.icon} />,
      type: "text",
      placeholder: "Username",
      value: loginStore.username,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => loginStore.setUsername(e.target.value),
      autoComplete: "username",
      extra: null,
    },
    {
      icon: <LockOutlined style={styles.icon} />,
      type: loginStore.showPassword ? "text" : "password",
      placeholder: "Password",
      value: loginStore.password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => loginStore.setPassword(e.target.value),
      autoComplete: "current-password",
      extra: (
        <span onClick={() => loginStore.togglePassword()} style={styles.toggleIcon}>
          {loginStore.showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </span>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <ToastContainer position="top-center" autoClose={2500} />

      {loginStore.loading && (
        <div className="loading-overlay fade-in-only" style={styles.loadingOverlay}>
          <LottieSpinner size={200} />
        </div>
      )}

      <button onClick={() => loginStore.toggleDarkMode()} style={styles.toggleButton}>
        {loginStore.darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
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
                disabled={loginStore.loading}
                autoComplete={autoComplete}
              />
              {extra}
            </div>
          ))}

          <button
            type="submit"
            style={{ ...styles.button, opacity: loginStore.loading ? 0.85 : 1, cursor: loginStore.loading ? "not-allowed" : "pointer" }}
            disabled={loginStore.loading}
          >
            {loginStore.loading ? <LottieSpinner size={24} /> : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
});

export default Login;

const getStyles = (darkMode: boolean): { [key: string]: React.CSSProperties } => ({
  container: {
    display: "flex",
    height: "100vh",
    background: darkMode
      ? "linear-gradient(135deg, #02101d, #03263b, #06445e)"
      : "linear-gradient(135deg, #07304b, #0d4f6e, #0d3e53ff)",
    backgroundSize: "400% 400%",
    animation: "waterFlow 15s ease infinite",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  toggleButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: darkMode ? "#333" : "#fff",
    color: darkMode ? "#fff" : "#333",
    border: "1px solid #ccc",
    padding: "6px 10px",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 12,
    zIndex: 2,
  },
  overlay: {
    backgroundColor: darkMode ? "rgba(10,20,30,0.55)" : "rgba(0,0,0,0.45)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: 16,
    border: "1px solid rgba(0,255,255,0.4)",
    padding: "100px 30px 40px",
    width: 350,
    height: 480,
    overflow: "visible",
    textAlign: "center",
    position: "relative",
    animation: "pulseGlow 3s infinite",
    color: "#fff",
  },
  logo: { width: 90, height: "auto", position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)" },
  form: { display: "flex", flexDirection: "column" },
  title: {
    fontSize: 26,
    fontWeight: 800,
    fontFamily: "Arial",
    letterSpacing: 0.5,
    marginTop: -15,
    marginBottom: 20,
    color: "#fff",
    textShadow: "0 2px 8px rgba(0,0,0,0.5), 0 0 8px rgba(0,123,255,0.4)",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "sans-serif",
    letterSpacing: 0.3,
    color: "#e0e0e0",
    marginTop: -10,
    marginBottom: 20,
    textShadow: "0 1px 4px rgba(0,0,0,0.4), 0 0 4px rgba(0,123,255,0.2)",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)",
    borderRadius: 8,
    marginBottom: 28,
    paddingLeft: 10,
  },
  icon: { fontSize: 16, color: "#fff", marginRight: 6 },
  input: { flex: 1, padding: "14px 12px", border: "none", outline: "none", background: "transparent", fontSize: 14, color: "inherit" },
  toggleIcon: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#fff" },
  button: { padding: "14px 24px", background: "linear-gradient(135deg, #00aaff, #004466)", color: "#fff", border: "none", fontWeight: "bold", borderRadius: 8, cursor: "pointer", fontSize: 15 },
  loadingOverlay: { position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.9)" },
});
