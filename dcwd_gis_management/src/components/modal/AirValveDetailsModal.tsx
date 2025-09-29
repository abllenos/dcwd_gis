import React from 'react';
import { Modal, Typography, Row, Col, Button, Space } from 'antd';

const { Title, Text } = Typography;

interface AirValveDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  record: any;
}

const getValue = (val: any) => val && val !== '' ? <b>{val}</b> : <span style={{ color: '#888' }}>Un-Updated</span>;

const AirValveDetailsModal: React.FC<AirValveDetailsModalProps> = ({ visible, onCancel, record }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      style={{ top: 24 }}
      bodyStyle={{ padding: 0 }}
      destroyOnClose
      maskClosable
    >
      <div style={{ padding: '24px 32px 0 32px', background: '#f7f9fc', borderRadius: '8px 8px 0 0' }}>
        <Title level={4} style={{ margin: 0, color: '#3a5fc8' }}>Air Valve - Details</Title>
      </div>
      <div style={{ padding: '32px 32px 0 32px', background: '#fff' }}>
        <Row gutter={[24, 16]} style={{ marginBottom: 8 }}>
          <Col xs={24} md={12}>
            <Text>Location: {getValue(record?.location)}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text>Valve Status : {getValue(record?.status)}</Text>
          </Col>
        </Row>
        <div style={{ background: '#e9edfa', borderRadius: 8, padding: '12px 24px', margin: '18px 0 0 0' }}>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Text>Work Order Number : {getValue(record?.wonumber)}</Text>
            </Col>
            <Col xs={24} md={12}>
              <Text>Serial No. : {getValue(record?.arv_serial_no)}</Text>
            </Col>
          </Row>
          <Row gutter={[24, 16]} style={{ marginTop: 8 }}>
            <Col xs={24} md={12}>
              <Text>Brand : {getValue(record?.brand)}</Text>
            </Col>
            <Col xs={24} md={12}>
              <Text>Valve Size : {getValue(record?.size)}</Text>
            </Col>
          </Row>
          <Row gutter={[24, 16]} style={{ marginTop: 8 }}>
            <Col xs={24} md={12}>
              <Text>Date Commissioned : {getValue(record?.date_installed)}</Text>
            </Col>
          </Row>
        </div>
        <div style={{ background: '#e9edfa', borderRadius: 8, padding: '12px 24px', margin: '18px 0 0 0' }}>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Text>Barangay : {getValue(record?.barangay)}</Text>
            </Col>
            <Col xs={24} md={12}>
              <Text>Water Source : {getValue(record?.water_source)}</Text>
            </Col>
          </Row>
          <Row gutter={[24, 16]} style={{ marginTop: 8 }}>
            <Col xs={24} md={12}>
              <Text>Project Title : {getValue(record?.project_title)}</Text>
            </Col>
            <Col xs={24} md={12}>
              <Text>Remarks : {getValue(record?.remarks)}</Text>
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

export default AirValveDetailsModal;
