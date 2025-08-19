
import React from "react";
import { Modal, Button } from "antd";

interface LogoutModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      title={
        <div style={{ textAlign: "center", width: "100%" }}>
          <span style={{ fontSize: "22px", fontWeight: 600, color: "#17212e" }}>
            Confirm Logout
          </span>
        </div>
      }
      open={visible}
      closable={false} 
      onCancel={onCancel}
      footer={
        <div style={{ textAlign: "center" }}>
          <Button 
            onClick={onCancel} 
            style={{ fontSize: "16px", padding: "6px 20px" }}
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            danger 
            onClick={onConfirm} 
            style={{ marginLeft: 14, fontSize: "16px", padding: "6px 20px" }}
          >
            Logout
          </Button>
        </div>
      }
      centered
    >
      <p style={{ textAlign: "center", fontSize: "17px" }}>
        Do you want to log out of the system?
      </p>
    </Modal>
  );
};

export default LogoutModal;