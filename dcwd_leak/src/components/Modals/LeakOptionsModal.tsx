import React from "react";
import { Modal, Button, Row, Col } from "antd";
import {
  CloseCircleOutlined,
  ArrowDownOutlined,
  ExperimentOutlined,
  ToolOutlined,
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
  backgroundColor: "#71AEEA",
  color: "#fff",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
  transition: "all 0.25s ease-in-out",
};

const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.backgroundColor = "#00509E";
  e.currentTarget.style.transform = "translateY(-4px)";
};

const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.backgroundColor = "#71AEEA";
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
        <div style={{ fontSize: 18, fontWeight: 700, textAlign: "center" }}>
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
            <CloseCircleOutlined style={{ fontSize: 28, marginBottom: 8 }} />
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
            <ArrowDownOutlined style={{ fontSize: 28, marginBottom: 8 }} />
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
            <ExperimentOutlined style={{ fontSize: 28, marginBottom: 8 }} />
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
            <ToolOutlined style={{ fontSize: 28, marginBottom: 8 }} />
            REPORT LEAK
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default LeakOptionsModal;
