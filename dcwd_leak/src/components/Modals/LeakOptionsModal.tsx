import React from "react";
import { Modal, Button, Row, Col } from "antd";
import {
  StopOutlined,
  FallOutlined,
  ExclamationCircleOutlined,
  AlertOutlined,
  WarningOutlined,
} from "@ant-design/icons";

interface LeakOptionsModalProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (option: string) => void;
}

const baseButtonStyle: React.CSSProperties = {
  height: 120,
  fontSize: 16,
  fontWeight: 600,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 8,
  backgroundColor: "#6782f5",
  color: "#fff",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
  transition: "all 0.25s ease-in-out",
};

const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.backgroundColor = "#5a6fd8";
  e.currentTarget.style.transform = "translateY(-4px)";
};

const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.backgroundColor = "#6782f5";
  e.currentTarget.style.transform = "translateY(0)";
};

const LeakOptionsModal: React.FC<LeakOptionsModalProps> = ({
  visible,
  onCancel,
  onSelect,
}) => {
  return (
    <Modal
      className="leak-options-modal"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={600}
      title={
        <div style={{ 
          fontSize: 18, 
          fontWeight: 700, 
          textAlign: "center",
          color: "#6782f5",
          padding: "8px 0",
          borderBottom: "2px solid #6782f5",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px"
        }}>
          <WarningOutlined style={{ fontSize: 20 }} />
          SELECT ISSUE TYPE
        </div>
      }
      bodyStyle={{ paddingTop: 24, paddingBottom: 24 }}
      maskClosable={false}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Button
            type="primary"
            block
            style={baseButtonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => onSelect("no_water")}
            aria-label="Select No Water"
          >
            <StopOutlined style={{ fontSize: 28, marginBottom: 8 }} />
            NO WATER
          </Button>
        </Col>

        <Col span={12}>
          <Button
            type="primary"
            block
            style={baseButtonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => onSelect("low_pressure")}
            aria-label="Select Low Pressure"
          >
            <FallOutlined style={{ fontSize: 28, marginBottom: 8 }} />
            LOW PRESSURE
          </Button>
        </Col>

        <Col span={12}>
          <Button
            type="primary"
            block
            style={baseButtonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => onSelect("no_water_supply")}
            aria-label="Select No Water Supply"
          >
            <ExclamationCircleOutlined style={{ fontSize: 28, marginBottom: 8 }} />
            NO WATER SUPPLY
          </Button>
        </Col>

        <Col span={12}>
          <Button
            type="primary"
            block
            style={baseButtonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => onSelect("report_leak")}
            aria-label="Select Report Leak"
          >
            <AlertOutlined style={{ fontSize: 28, marginBottom: 8 }} />
            REPORT LEAK
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default LeakOptionsModal;
