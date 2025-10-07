import React from 'react';
import { Modal, Row, Col, Typography, Table } from 'antd';
import GeometryMap from '../GeometryMap';

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
      width={1200}
      style={{ top: 24 }}
      bodyStyle={{ padding: 0 }}
      destroyOnClose
      maskClosable
    >
      <div style={{ padding: '24px 32px 0 32px', background: '#f7f9fc', borderRadius: '8px 8px 0 0' }}>
        <Title level={4} style={{ margin: 0, color: '#3a5fc8' }}>Pressure Setting Valve - Details</Title>
      </div>
      <div style={{ padding: '32px', background: '#fff' }}>
        <Row gutter={32}>
          {/* Left Column - Details */}
          <Col xs={24} lg={14}>
            <div style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>PSV Number:</Text><br/>
                  <Text>{record?.psv_number || 'N/A'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Account Number:</Text><br/>
                  <Text>{record?.accountnumber || 'N/A'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Location:</Text><br/>
                  <Text>{record?.location || 'N/A'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Meter Number:</Text><br/>
                  <Text>{record?.meter_number || 'N/A'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Size:</Text><br/>
                  <Text>{record?.size || 'N/A'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Brand Description:</Text><br/>
                  <Text>{record?.brand_name || 'N/A'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Pressure Setting:</Text><br/>
                  <Text>{record?.pressure_setting || 'N/A'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Remarks:</Text><br/>
                  <Text>{record?.remarks || 'N/A'}</Text>
                </Col>
              </Row>
            </div>
            
            {/* Status Log */}
            <div>
              <Title level={5}>Status Log</Title>
              <Table
                columns={statusLogColumns}
                dataSource={statusLogData}
                pagination={false}
                size="small"
                bordered
                style={{ background: '#fff' }}
              />
            </div>
          </Col>
          
          {/* Right Column - Map */}
          <Col xs={24} lg={10}>
            <div style={{ position: 'sticky', top: 0 }}>
              <Title level={5} style={{ marginBottom: 16 }}>Location Map</Title>
              <GeometryMap
                geom={record?.geom}
                height={400}
                editable={false}
                markerColor="#3a5fc8"
                markerLabel={`PSV ${record?.psv_number || 'Location'}`}
              />
            </div>
          </Col>
        </Row>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 32px', background: '#f7f9fc', borderRadius: '0 0 8px 8px', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <button onClick={onCancel} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontWeight: 600 }}>Close</button>
      </div>
    </Modal>
  );
};

export default PressureSettingValveDetailsModal;