import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Typography,
  Card,
  Row,
  Col,
  Modal,
  Spin,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import dcwd from "../assets/image/dcwd.jpg";
import { authStore } from "./stores/AuthStore";
import { useAuth } from "../AuthContext";

const { Title, Text } = Typography;

const Login: React.FC = observer(() => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values: { username: string; password: string }) => {
    authStore.setUsername(values.username);
    authStore.setPassword(values.password);

    const result = await authStore.loginRequest();

    if (result.success && result.token) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      login();

      navigate("/dashboard");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card
        style={{
          width: 600,
          padding: "40px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          backdropFilter: "blur(8px)",
          background: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <Row gutter={16} align="middle">
          <Col xs={24} md={10}>
            <img src={dcwd} alt="Login illustration" style={{ width: "100%", borderRadius: "8px" }} />
          </Col>

          <Col xs={24} md={14}>
            <Title level={4} style={{ textAlign: "center", marginBottom: "20px" }}>GIS Management System</Title>
            <Form name="login-form" onFinish={handleLogin} layout="vertical">
              <Form.Item name="username" rules={[{ required: true, message: "Please input your username!" }]}>
                <Input
                  placeholder="Username"
                  value={authStore.username}
                  onChange={(e) => authStore.setUsername(e.target.value)}
                />
              </Form.Item>

              <Form.Item name="password" rules={[{ required: true, message: "Please input your password!" }]}>
                <Input.Password
                  placeholder="Password"
                  value={authStore.password}
                  onChange={(e) => authStore.setPassword(e.target.value)}
                  autoComplete="off"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: "100%" }} disabled={authStore.loading}>
                  {authStore.loading ? <Spin /> : "Login"}
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>

      <Modal
        open={!!authStore.error}
        onCancel={() => (authStore.error = null)}
        footer={[
          <Button key="ok" type="primary" onClick={() => (authStore.error = null)}>
            OK
          </Button>,
        ]}
        title={
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: "20px" }} />
            <Text strong style={{ color: "#ff4d4f" }}>Login Alert</Text>
          </span>
        }
        centered
      >
        <Text>{authStore.error}</Text>
      </Modal>
    </div>
  );
});

export default Login;
