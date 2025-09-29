import React from 'react';
import { Modal, Row, Col, Typography, Table } from 'antd';

const { Title, Text } = Typography;

interface Props {
  visible: boolean;
  record: any;
  onCancel: () => void;
}

const statusLogColumns = [
  { title: 'Description', dataIndex: 'desc', key: 'desc' },
  { title: 'Person In Charge', dataIndex: 'person', key: 'person' },
  { title: 'Administered By', dataIndex: 'admin', key: 'admin' },
  { title: 'Date and Time Updated', dataIndex: 'date', key: 'date' },
];
const statusLogData: any[] = [];

const PressureSettingValveDetailsModal: React.FC<Props> = ({ visible, record, onCancel }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      style={{ top: 24 }}
      bodyStyle={{ padding: 0 }}
      destroyOnClose
      maskClosable
    >
      <div style={{ padding: '24px 32px 0 32px', background: '#f7f9fc', borderRadius: '8px 8px 0 0' }}>
        <Title level={4} style={{ margin: 0, color: '#3a5fc8' }}>Pressure Setting Valve - Details</Title>
      </div>
      <div style={{ padding: '32px 32px 0 32px', background: '#fff' }}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Text strong>PSV Number:</Text> <Text>{record?.psv_number}</Text><br/>
            <Text strong>Account Number:</Text> <Text>{record?.accountnumber}</Text><br/>
            <Text strong>Location:</Text> <Text>{record?.location}</Text><br/>
            <Text strong>Meter Number:</Text> <Text>{record?.meter_number}</Text><br/>
            <Text strong>Size:</Text> <Text>{record?.size}</Text><br/>
            <Text strong>Brand Description:</Text> <Text>{record?.brand_name}</Text><br/>
            <Text strong>Pressure Setting:</Text> <Text>{record?.pressure_setting}</Text><br/>
            <Text strong>Remarks:</Text> <Text>{record?.remarks}</Text><br/>
          </Col>
        </Row>
        <div style={{ marginTop: 24 }}>
          <Title level={5}>Status Log</Title>
          <Table
            columns={statusLogColumns}
            dataSource={statusLogData}
            pagination={false}
            size="small"
            bordered
            style={{ background: '#fff', padding: 16 }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 32px', background: '#f7f9fc', borderRadius: '0 0 8px 8px', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <button onClick={onCancel} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontWeight: 600 }}>Close</button>
      </div>
    </Modal>
  );
};

export default PressureSettingValveDetailsModal;