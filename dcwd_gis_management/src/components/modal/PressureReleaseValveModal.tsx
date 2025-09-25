import React from 'react';

import { Modal, Typography, Row, Col, Button, Space } from 'antd';
const { Title, Text } = Typography;

interface Props {
  visible: boolean;
  record: any;
  onCancel: () => void;
  onUpdate: () => void;
}


const PressureReleaseValveModal: React.FC<Props> = ({ visible, record, onCancel }) => {
  // Helper to get value or 'Un-Updated'
  const getValue = (val: any) => val && val !== '' ? val : <span style={{ color: '#888' }}>Un-Updated</span>;
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      style={{ top: 24 }}
      bodyStyle={{ padding: 0 }}
      destroyOnClose
      maskClosable
    >
      <div style={{ padding: '24px 32px 0 32px', background: '#f7f9fc', borderRadius: '8px 8px 0 0' }}>
        <Title level={4} style={{ margin: 0, color: '#3a5fc8' }}>Pressure Release Valve - Details</Title>
      </div>
      <div style={{ padding: '32px 32px 0 32px', background: '#fff' }}>
        <Row gutter={[24, 16]} style={{ marginBottom: 8 }}>
          <Col xs={24} md={12}>
            <Text>Work Order Number: <b>{getValue(record?.workOrderNo)}</b></Text>
          </Col>
          <Col xs={24} md={12}>
            <Text>Valve Status : <b>{getValue(record?.valveStatus || record?.status)}</b></Text>
          </Col>
        </Row>
        <Row gutter={[24, 16]} style={{ marginBottom: 8 }}>
          <Col xs={24} md={12}>
            <Text>Location: <b>{getValue(record?.location)}</b></Text>
          </Col>
          <Col xs={24} md={12}>
            <Text>Brgy : <b>{getValue(record?.barangay)}</b></Text>
          </Col>
        </Row>
        <div style={{ background: '#e9edfa', borderRadius: 8, padding: '12px 24px', margin: '18px 0 0 0' }}>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Text>Size : <b>{getValue(record?.size)}</b></Text>
            </Col>
            <Col xs={24} md={12}>
              <Text>PRV Setting : <b>{getValue(record?.prvSetting)}</b></Text>
            </Col>
          </Row>
          <Row gutter={[24, 16]} style={{ marginTop: 8 }}>
            <Col xs={24} md={12}>
              <Text>Date Installed: <b>{getValue(record?.dateInstalled)}</b></Text>
            </Col>
          </Row>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 32px', background: '#f7f9fc', borderRadius: '0 0 8px 8px', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <Space>
          <Button danger onClick={onCancel}>Close</Button>
        </Space>
      </div>
    </Modal>
  );
};

export default PressureReleaseValveModal;

// Named alias export (helps some editors/tsserver detect the module after quick changes)
export const PressureReleaseValveModalComponent = PressureReleaseValveModal;
