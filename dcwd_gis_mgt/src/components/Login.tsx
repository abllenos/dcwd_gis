import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Typography, Card, Row, Col, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../AuthContext'; 
import './css/Login.css';
import dcwd from '../assets/image/dcwd.jpg';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const showErrorModal = (message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleLogin = (values: { username: string; password: string }) => {
    const { username, password } = values;

    fetch('https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/userlogin/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ username, password }),
})
  .then(async response => {
    const data = await response.json();
    console.log('API raw response:', data);

    if (response.ok && data.statusCode === 200 && data.data?.token) {
  
      localStorage.setItem('token', data.data.token);

      localStorage.setItem('user', JSON.stringify(data.data));
      login(); 
      navigate('/dashboard');
    } else {
      showErrorModal(data.message || 'Invalid credentials. Please try again.');
    }
  })
  .catch(error => {
    console.error('Login error:', error);
    showErrorModal('An error occurred during login. Please check your network or try again later.');
  });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'relative' }}>      
      <Card 
        style={{
          width: 600, 
          padding: '40px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
          backdropFilter: 'blur(8px)', 
          background: 'rgba(255, 255, 255, 0.2)'
        }}
      >
        <Row gutter={16} align="middle">
          <Col xs={24} md={10}>
            <img 
              src={dcwd}
              alt="Login illustration" 
              style={{ width: '100%', borderRadius: '8px' }} 
            />
          </Col>

          <Col xs={24} md={14}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Login</Title>
            <Form
              name="login-form"
              initialValues={{ remember: true }}
              onFinish={handleLogin}
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input 
                  placeholder="Username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  autoComplete="off" 
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setModalVisible(false)}>
            OK
          </Button>
        ]}
        title={
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
            <Text strong style={{ color: '#ff4d4f' }}>Login Alert</Text>
          </span>
        }
        centered
      >
        <Text>{modalMessage}</Text>
      </Modal>
    </div>
  );
};

export default Login;
