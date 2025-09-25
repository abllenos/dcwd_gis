import React from 'react';
import { Modal, Typography, Row, Col, Button, Space } from 'antd';
import type { IsolationValve } from '../types/isolationValve';

const { Title, Text } = Typography;

interface IsolationValveDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  record: IsolationValve | null;
}

const getValue = (val: any) => val && val !== '' ? <b>{val}</b> : <span style={{ color: '#888' }}>Un-Updated</span>;

const IsolationValveDetailsModal: React.FC<IsolationValveDetailsModalProps> = ({ visible, onCancel, record }) => {
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
        <Title level={4} style={{ margin: 0, color: '#3a5fc8' }}>Isolation Valve - Details</Title>
      </div>
      <div style={{ padding: '32px 32px 0 32px', background: '#fff' }}>
        <Row gutter={[24, 16]} style={{ marginBottom: 8 }}>
          <Col xs={24} md={12}>
            <Text>GV Number: {getValue(record?.gvnumber)}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text>WO Number: {getValue(record?.wonumber)}</Text>
          </Col>
        </Row>
        <Row gutter={[24, 16]} style={{ marginBottom: 8 }}>
          <Col xs={24} md={12}>
            <Text>Location: {getValue(record?.location)}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text>Barangay: {getValue(record?.barangay)}</Text>
          </Col>
        </Row>
        <Row gutter={[24, 16]} style={{ marginBottom: 8 }}>
          <Col xs={24} md={12}>
            <Text>Size: {getValue(record?.size)}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text>No. of Turns: {getValue(record?.noofturns)}</Text>
          </Col>
        </Row>
        <Row gutter={[24, 16]} style={{ marginBottom: 8 }}>
          <Col xs={24} md={12}>
            <Text>Depth: {getValue(record?.depth)}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text>Brand: {getValue(record?.brand)}</Text>
          </Col>
        </Row>
        <Row gutter={[24, 16]} style={{ marginBottom: 8 }}>
          <Col xs={24} md={12}>
            <Text>Type: {getValue(record?.valve)}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text>Project Title: {getValue(record?.project_title)}</Text>
          </Col>
        </Row>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 32px', background: '#f7f9fc', borderRadius: '0 0 8px 8px', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <Space>
          <Button danger onClick={onCancel}>Close</Button>
        </Space>
      </div>
    </Modal>
  );
};

export default IsolationValveDetailsModal;
