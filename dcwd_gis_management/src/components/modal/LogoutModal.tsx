
import React from "react";
import { Modal, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import "./LogoutModal.css";

interface LogoutModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      className="logout-modal"
      title={
        <div className="logout-modal-title-container">
          <div className="logout-modal-icon">
            <LogoutOutlined />
          </div>
          <h3 className="logout-modal-title">Confirm Logout</h3>
        </div>
      }
      open={visible}
      closable={false} 
      onCancel={onCancel}
      footer={
        <div className="logout-modal-buttons">
          <Button 
            className="btn-cancel"
            onClick={onCancel} 
          >
            Cancel
          </Button>
          <Button 
            className="btn-danger" 
            onClick={onConfirm}
          >
            Logout
          </Button>
        </div>
      }
      centered
      width={440}
    >
      <p className="logout-modal-message">
        Do you want to log out of the system?
      </p>
    </Modal>
  );
};

export default LogoutModal;