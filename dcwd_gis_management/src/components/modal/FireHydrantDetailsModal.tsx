import React from 'react';
import { Modal, Typography, Row, Col, Button, Space } from 'antd';

const { Title, Text } = Typography;

interface FireHydrantDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  record: any;
}

const getValue = (val: any) => val && val !== '' ? <b>{val}</b> : <span style={{ color: '#888' }}>Un-Updated</span>;

const FireHydrantDetailsModal: React.FC<FireHydrantDetailsModalProps> = ({ visible, onCancel, record }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      style={{ top: 24 }}
  styles={{ body: { padding: 0 } }}
      destroyOnClose
      maskClosable
    >
      <div style={{ padding: '24px 32px 0 32px', background: 'var(--bg-secondary, #f7f9fc)', borderRadius: '8px 8px 0 0' }}>
        <Title level={4} style={{ margin: 0, color: 'var(--primary-color, #1890ff)' }}>Fire Hydrant - Details</Title>
      </div>
      <div style={{ padding: '32px 32px 0 32px', background: 'var(--bg-primary, #fff)' }}>
        <Row gutter={[24, 16]} style={{ marginBottom: 8 }}>
          <Col xs={24} md={12}>
            <Text>Asset ID: {getValue(record?.assetid)}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text>Location: {getValue(record?.location)}</Text>
          </Col>
        </Row>
        <Row gutter={[24, 16]} style={{ marginBottom: 8 }}>
          <Col xs={24} md={12}>
            <Text>Barangay: {getValue(record?.barangay)}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text>Size: {getValue(record?.size)}</Text>
          </Col>
        </Row>
        <Row gutter={[24, 16]} style={{ marginBottom: 8 }}>
          <Col xs={24} md={12}>
            <Text>Type Description: {getValue(record?.type_description)}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text>Remarks: {getValue(record?.remarks)}</Text>
          </Col>
        </Row>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 32px', background: 'var(--bg-secondary, #f7f9fc)', borderRadius: '0 0 8px 8px', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <Space>
          <Button danger onClick={onCancel}>Close</Button>
        </Space>
      </div>
    </Modal>
  );
};

export default FireHydrantDetailsModal;
