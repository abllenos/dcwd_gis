// src/pages/Logout.tsx
import React, { useState } from 'react';
import { Modal, Result, Spin, Button, Space } from 'antd';
import { LoadingOutlined, LogoutOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleConfirmLogout = () => {
    setLoading(true);
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 1500);
  };

  const handleCancel = () => {
    setVisible(false);
    navigate(-1); 
  };

  return (
    <Modal
      open={visible}
      closable={false}
      centered
      footer={null}
      width={480}
      bodyStyle={{ padding: 32 }}
      maskClosable={false}
    >
      {loading ? (
        <Result
          icon={<Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />} />}
          title="Logging you out..."
          subTitle="Please wait while we safely end your session."
        />
      ) : (
        <Result
          status="warning"
          title="Are you sure you want to log out?"
          subTitle="You will need to log in again to access your account."
          extra={
            <Space size="middle">
              <Button
                type="primary"
                icon={<LogoutOutlined />}
                onClick={handleConfirmLogout}
              >
                Yes, Log Out
              </Button>
              <Button
                icon={<CloseCircleOutlined />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Space>
          }
        />
      )}
    </Modal>
  );
};

export default Logout;
