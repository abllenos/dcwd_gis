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
      <div style={styles.leftPanel} />
      <div style={styles.rightPanel}>
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
          <form onSubmit={handleSubmit} style={styles.form}>
            <img src={logo} alt="Logo" style={styles.logo} />
            <h2 style={styles.title}>Login</h2>
            <p style={styles.subtitle}>GIS Management System</p>

            <div style={styles.inputGroup}>
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

            <div style={styles.inputGroup}>
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

            <button type="submit" style={styles.button}>
              Log In
            </button>
          </form>
        )}
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
    },
    leftPanel: {
      flex: 1,
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
      filter: "blur(1px)",
    },
    rightPanel: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0 100%)",
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
