import React from 'react';
import { Modal, Button } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { MODAL_SIZES, MODAL_COLORS, BUTTON_STYLES } from './ModalDesignSystem';

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
        return <CheckCircleOutlined style={{ fontSize: 48, color: MODAL_COLORS.success }} />;
      case 'error':
        return <CloseCircleOutlined style={{ fontSize: 48, color: MODAL_COLORS.danger }} />;
      case 'warning':
        return <ExclamationCircleOutlined style={{ fontSize: 48, color: MODAL_COLORS.warning }} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      open={visible}
      footer={[
        <Button
          key="close"
          type="primary"
          style={BUTTON_STYLES.primary}
          onClick={onClose}
        >
          Close
        </Button>,
      ]}
      onCancel={onClose}
      centered
      width={MODAL_SIZES.small}
      closeIcon={false}
      title={null}
    >
      <div style={{ textAlign: 'center', padding: 24 }}>
        {getIcon()}
        <h2 style={{ 
          marginTop: 16, 
          fontSize: 20, 
          fontWeight: 600,
          color: '#262626',
          marginBottom: 12
        }}>
          {title}
        </h2>
        <p style={{ 
          fontSize: 16, 
          color: '#595959',
          lineHeight: 1.5,
          margin: 0
        }}>
          {content}
        </p>
      </div>
    </Modal>
  );
};

export default CustomModal;
