import React from "react";
import { observer } from "mobx-react";
import {
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
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
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        loginStore.setUsername(e.target.value),
      autoComplete: "username",
      extra: null,
    },
    {
      icon: <LockOutlined style={styles.icon} />,
      type: loginStore.showPassword ? "text" : "password",
      placeholder: "Password",
      value: loginStore.password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        loginStore.setPassword(e.target.value),
      autoComplete: "current-password",
      extra: (
        <span
          onClick={() => loginStore.togglePassword()}
          style={styles.toggleIcon}
        >
          {loginStore.showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </span>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <ToastContainer position="top-center" autoClose={2500} />

      {loginStore.loading && (
        <div
          className="loading-overlay fade-in-only"
          style={styles.loadingOverlay}
        >
          <LottieSpinner size={200} />
        </div>
      )}

  <div style={styles.leftSide}>
  <img
    src="login-bg.jpg"
    alt="Login Background"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      clipPath: "inherit", 
      zIndex: 0,
    }}
  />
</div>

      <div style={styles.rightSide}>
        <div style={styles.formWrapper}>
          <img src="/logo-dcwd.webp" alt="Logo" style={styles.logo} />

          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.title}>Login</h2>
            <p style={styles.subtitle}>LEAK REPORTING SYSTEM</p>

            {inputs.map(
              (
                { icon, type, placeholder, value, onChange, autoComplete, extra },
                i
              ) => (
                <div key={i} style={styles.inputGroup}>
                  {icon}
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    style={styles.input}
                    required
                    disabled={loginStore.loading}
                    autoComplete={autoComplete}
                  />
                  {extra}
                </div>
              )
            )}

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loginStore.loading ? 0.85 : 1,
                cursor: loginStore.loading ? "not-allowed" : "pointer",
              }}
              disabled={loginStore.loading}
            >
              {loginStore.loading ? <LottieSpinner size={24} /> : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

export default Login;

const getStyles = (darkMode: boolean): { [key: string]: React.CSSProperties } => ({
  container: {
    display: "flex",
    height: "100vh",
    width: "100%",
  },
leftSide: {
  flex: 1.2,
  backgroundColor: "#fff",           // background behind the image
  backgroundImage: "url('login-bg.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
},

rightSide: {
  flex: 0.8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)", 
},
  formWrapper: {
    width: 360,
    padding: "40px 30px",
    textAlign: "center",
    position: "relative",
  },
  logo: {
    width: 90,
    height: "auto",
    marginBottom: 20,
  },
  form: { display: "flex", flexDirection: "column" },
  title: { fontSize: 26, fontWeight: 800, marginBottom: 10, color: "#1a1a1a" },
  subtitle: { fontSize: 14, fontWeight: 500, marginBottom: 25, color: "#555" },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    marginBottom: 25,
    paddingLeft: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 15,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  icon: { fontSize: 16, marginRight: 6 },
  toggleIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  },
  input: {
    flex: 1,
    padding: "15px",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    fontSize: 14,
    color: "#1a1a1a",
  },
  button: {
    padding: "14px 24px",
    background: "#4169E1",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    borderRadius: 30,
    cursor: "pointer",
    fontSize: 15,
    marginTop: 10,
    width: "100%",
  },
  loadingOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
});
