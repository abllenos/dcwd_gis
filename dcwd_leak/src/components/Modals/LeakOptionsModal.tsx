import React from "react";
import { Modal, Button, Row, Col } from "antd";
import {
  FrownOutlined,
  ArrowDownOutlined,
  ExperimentOutlined,
  ToolOutlined,
} from "@ant-design/icons";

interface LeakOptionsModalProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (option: string) => void;
}

const buttonStyle: React.CSSProperties = {
  height: 120,
  fontSize: 16,
  fontWeight: 600, // a bit bolder for emphasis
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 8, // rounded corners for nicer UI
  boxShadow: '0 2px 6px rgba(0,0,0,0.15)', // subtle shadow
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
        <div style={{ fontSize: 18, fontWeight: 700 }}>
          Create a Leak - Select Issue Type
        </div>
      }
      bodyStyle={{ paddingTop: 24, paddingBottom: 24 }}
      maskClosable={false} // avoid closing when clicking outside accidentally
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Button
            type="primary"
            block
            style={buttonStyle}
            onClick={() => onSelect("no_water")}
            aria-label="Select No Water"
          >
            <FrownOutlined style={{ fontSize: 28, marginBottom: 8 }} />
            NO WATER
          </Button>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            block
            style={buttonStyle}
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
            style={buttonStyle}
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
            style={buttonStyle}
            onClick={() => onSelect("leak_report")}
            aria-label="Select Leak Report"
          >
            <ToolOutlined style={{ fontSize: 28, marginBottom: 8 }} />
            LEAK REPORT
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default LeakOptionsModal;
