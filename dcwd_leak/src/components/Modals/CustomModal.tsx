import React from 'react';
import { Modal } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

interface CustomModalProps {
  visible: boolean;
  title: string;
  content: string;
  type?: 'success' | 'error' | 'warning';
  onClose: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  content,
  type = 'success',
  onClose
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleOutlined style={{ fontSize: 'clamp(36px, 4vw, 48px)', color: '#52c41a' }} />;
      case 'error':
        return <CloseCircleOutlined style={{ fontSize: 'clamp(36px, 4vw, 48px)', color: '#ff4d4f' }} />;
      case 'warning':
        return <ExclamationCircleOutlined style={{ fontSize: 'clamp(36px, 4vw, 48px)', color: '#faad14' }} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      open={visible}
      footer={null}
      onCancel={onClose}
      centered
      width="clamp(300px, 40vw, 500px)"
    >
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        {getIcon()}
        <h2 style={{ marginTop: 16, fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 'bold' }}>
          {title}
        </h2>
        <p style={{ fontSize: 'clamp(14px, 1.5vw, 18px)' }}>{content}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </Modal>
  );
};

export default CustomModal;
