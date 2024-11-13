import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Typography, Card, Row, Col } from 'antd';
import { useAuth } from '../AuthContext'; 
import './css/Login.css';
import dcwd from '../assets/image/dcwd.jpg'

const { Title } = Typography;

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (values: { username: string; password: string }) => {
    const { username, password } = values;

    if (username === '002481' && password === 'abllenos') {
      login();
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
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
    </div>
  );
};

export default Login;
