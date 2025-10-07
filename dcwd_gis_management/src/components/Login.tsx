import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import spinnerAnimation from "../assets/spinner.json";
import {
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import logo from "../../public/logo-dcwd.webp?url";
import bgImage from "../../public/login-bg.jpg?url";
import { loginStore } from "../stores/loginStore"; 
import "./Login.css";
interface LoginProps {
  onLogin?: (token: string) => void;
}

const Login: React.FC<LoginProps> = observer(({ onLogin }) => {
  const navigate = useNavigate();
  const styles = getStyles();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await loginStore.login(onLogin || (() => {}), navigate);
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Layered wave animation - positioned at page level */}
      <div className="login-wave-container" aria-hidden>
        <svg
          className="login-wave-svg"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back wave layer - lightest */}
          <path 
            className="wave-layer wave-layer-3"
            d="M0,120L48,125.3C96,131,192,141,288,133.3C384,125,480,99,576,96C672,93,768,115,864,120C960,125,1056,115,1104,109.3L1152,104L1152,200L1104,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"
          />
          {/* Middle wave layer */}
          <path 
            className="wave-layer wave-layer-2"
            d="M0,140L48,138.7C96,137,192,135,288,128C384,121,480,111,576,117.3C672,123,768,147,864,154.7C960,163,1056,155,1104,149.3L1152,144L1152,200L1104,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"
          />
          {/* Front wave layer - darkest */}
          <path 
            className="wave-layer wave-layer-1"
            d="M0,160L48,165.3C96,171,192,181,288,176C384,171,480,149,576,144C672,139,768,149,864,157.3C960,165,1056,171,1104,173.3L1152,176L1152,200L1104,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"
          />
        </svg>
        <div className="login-wave-gradient"></div>
      </div>

      <div style={styles.leftPanel}>
        <div 
          className="login-left-panel-bg login-left-panel-animated"
          style={styles.leftPanelBg}
        ></div>
        <div className="login-left-panel-overlay"></div>
      </div>
      <div style={styles.rightPanel}>
        <div className="login-right-panel-with-wave">
        {loginStore.loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Lottie
              animationData={spinnerAnimation}
              loop={true}
              style={{ width: 120, height: 120 }}
            />
            <span
              style={{
                marginTop: 16,
                color: "#113983",
                fontWeight: "bold",
              }}
            >
              Logging in...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form} className="login-form-animated">
            <img src={logo} alt="Logo" style={styles.logo} className="login-logo-animated" />
            <h2 style={styles.title} className="login-title-animated">Login</h2>
            <p style={styles.subtitle} className="login-subtitle-animated">GIS Management System</p>

            <div style={styles.inputGroup} className="login-input-group-animated login-input-group-hover">
              <MailOutlined style={styles.icon} />
              <input
                type="text"
                placeholder="Username"
                value={loginStore.username}
                onChange={(e) => loginStore.setUsername(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup} className="login-input-group-animated login-input-group-hover">
              <LockOutlined style={styles.icon} />
              <input
                type={loginStore.showPassword ? "text" : "password"}
                placeholder="Password"
                value={loginStore.password}
                onChange={(e) => loginStore.setPassword(e.target.value)}
                style={{ ...styles.input, paddingRight: "30px" }}
                required
              />
              <span
                onClick={() => loginStore.togglePassword()}
                style={styles.toggleIcon}
              >
                {loginStore.showPassword ? (
                  <EyeInvisibleOutlined />
                ) : (
                  <EyeOutlined />
                )}
              </span>
            </div>

            <button type="submit" style={styles.button} className="login-button-animated">
              Log In
            </button>
          </form>
        )}
        </div>
      </div>
    </div>
  );
});

function getStyles(): { [key: string]: React.CSSProperties } {
  return {
    pageWrapper: {
      display: "flex",
      minHeight: "100vh",
      width: "100%",
      background: "#f5f5f5",
      position: "relative",
    },
    leftPanel: {
      flex: 1,
      clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
      position: "relative",
      zIndex: 1,
      overflow: "hidden",
    },
    leftPanelBg: {
      backgroundImage: `url(${bgImage})`,
    },
    rightPanel: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)",
      position: "relative",
      zIndex: 2,
    },
    form: {
      width: "100%",
      maxWidth: 420,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "32px 24px",
    },
    title: {
      marginBottom: 16,
      textAlign: "center",
      fontSize: 28,
      fontWeight: "bold",
      color: "#000",
    },
    subtitle: {
      marginBottom: 28,
      textAlign: "center",
      fontSize: 16,
      color: "#555",
    },
    inputGroup: {
      position: "relative",
      marginBottom: 20,
      width: "80%",
      display: "flex",
      alignItems: "center",
      background: "rgba(255,255,255,0.1)",
      border: "1px solid #ccc",
      borderRadius: 10,
      padding: "10px 14px",
      transition: "background 0.3s ease, box-shadow 0.3s ease",
    },
    input: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontSize: 15,
      color: "#113983",
    },
    icon: {
      marginRight: 10,
      fontSize: 18,
      color: "#23314bff",
    },
    toggleIcon: {
      position: "absolute",
      right: 12,
      cursor: "pointer",
      fontSize: 20,
      color: "#23314bff",
    },
    button: {
      padding: "12px 20px",
      backgroundColor: "#113983",
      color: "#fff",
      border: "none",
      fontWeight: "bold",
      borderRadius: 8,
      cursor: "pointer",
      fontSize: 16,
      width: "70%",
      marginTop: 12,
      textAlign: "center",
      transition: "background 0.25s ease",
    },
    logo: {
      width: 90,
      height: 90,
      margin: "0 auto 12px",
      display: "block",
    },
  };
}

export default Login;
