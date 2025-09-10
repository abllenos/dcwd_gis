import React from "react";
import { Modal, Button, Row, Col } from "antd";
import {
  ExperimentOutlined,
  FallOutlined,
  ExclamationCircleOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import '../../styles/modal.css';

interface LeakOptionsModalProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (option: string) => void;
}

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

      closeIcon={false}
      title={null}
      style={{ padding: 0 }}

    >
      <div style={{ padding: 16 }}>
        <div className="leak-options-modal-header">
          <span className="leak-options-modal-header-title">
            SELECT ISSUE TYPE
          </span>
        </div>
        
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Button
              type="primary"
              block
              className="leak-options-modal-button"
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
              className="leak-options-modal-button"
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
              className="leak-options-modal-button"
              onClick={() => onSelect("water_quality")}
              aria-label="Select Water Quality"
            >
              <ExperimentOutlined style={{ fontSize: 28, marginBottom: 8 }} />
              WATER QUALITY
            </Button>
          </Col>

          <Col span={12}>
            <Button
              type="primary"
              block
              className="leak-options-modal-button"
              onClick={() => onSelect("report_leak")}
              aria-label="Select Report Leak"
            >
              <AlertOutlined style={{ fontSize: 28, marginBottom: 8 }} />
              REPORT LEAK
            </Button>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default LeakOptionsModal;
