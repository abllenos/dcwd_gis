import { Modal, Form, Input, Select, Button, Row, Col, Typography } from 'antd';
import React from 'react';

const { Title } = Typography;

interface PipeConditionAssessmentModalProps {
  open: boolean;
  onClose: () => void;
  assetId: number | string;
}

const selectOptions = [
  { value: '', label: '- SELECT -' },
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
];

const PipeConditionAssessmentModal: React.FC<PipeConditionAssessmentModalProps> = ({ open, onClose, assetId }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 24 }}
      destroyOnClose
      title={null}
    >
      <div style={{ padding: '24px 32px 0 32px' }}>
        <Title level={4} style={{ margin: 0 }}>Pipe Condition Assessment</Title>
        <div style={{ fontWeight: 600, margin: '18px 0 8px 0' }}>Asset ID: {assetId}</div>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Operational Status" name="operationalStatus">
                <Select options={selectOptions} />
              </Form.Item>
              <Form.Item label="Pipe Type" name="pipeType">
                <Select options={selectOptions} />
              </Form.Item>
              <Form.Item label="Year Installed" name="yearInstalled">
                <Input placeholder="Unupdated" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Pipe Material" name="pipeMaterial">
                <Select options={selectOptions} />
              </Form.Item>
              <Form.Item label="Pipe Size [mm]" name="pipeSize">
                <Input placeholder="Unupdated" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Pipe Age" name="pipeAge">
                <Input placeholder="Unupdated" disabled />
              </Form.Item>
              <Form.Item label="Depth [meters]" name="depth">
                <Input placeholder="Unupdated" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ fontWeight: 600, margin: '24px 0 8px 0' }}>Impact Scoring</div>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Service Demand" name="serviceDemand">
                <Select options={selectOptions} />
              </Form.Item>
              <Form.Item label="Traffic Impact" name="trafficImpact">
                <Select options={selectOptions} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Customer Criticality" name="customerCriticality">
                <Select options={selectOptions} />
              </Form.Item>
              <Form.Item label="Material Type" name="materialType">
                <Select options={selectOptions} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Land Use" name="landUse">
                <Select options={selectOptions} />
              </Form.Item>
              <Form.Item label="Frequency of Pipe Failure" name="pipeFailureFreq">
                <Select options={selectOptions} />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
            <Button type="primary" htmlType="submit" style={{ background: '#16c784', border: 'none' }}>
              Save
            </Button>
            <Button danger onClick={onClose} style={{ minWidth: 80 }}>
              Close
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default PipeConditionAssessmentModal;
