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
      <div style={{ padding: '24px 32px 0 32px', background: 'var(--bg-secondary, #f7f9fc)', borderRadius: '8px 8px 0 0' }}>
        <Title level={4} style={{ margin: 0, color: 'var(--primary-color, #1890ff)' }}>Pressure Setting Valve - Details</Title>
      </div>
      <div style={{ padding: '32px', background: 'var(--bg-primary, #fff)' }}>
        <Row gutter={32}>
          {/* Left Column - Details */}
          <Col xs={24} lg={14}>
            <div style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong style={{ color: 'var(--text-primary, #000)' }}>PSV Number:</Text><br/>
                  <Text style={{ color: 'var(--text-secondary, #666)' }}>{record?.psv_number || 'N/A'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong style={{ color: 'var(--text-primary, #000)' }}>Account Number:</Text><br/>
                  <Text style={{ color: 'var(--text-secondary, #666)' }}>{record?.accountnumber || 'N/A'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong style={{ color: 'var(--text-primary, #000)' }}>Location:</Text><br/>
                  <Text style={{ color: 'var(--text-secondary, #666)' }}>{record?.location || 'N/A'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong style={{ color: 'var(--text-primary, #000)' }}>Meter Number:</Text><br/>
                  <Text style={{ color: 'var(--text-secondary, #666)' }}>{record?.meter_number || 'N/A'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong style={{ color: 'var(--text-primary, #000)' }}>Size:</Text><br/>
                  <Text style={{ color: 'var(--text-secondary, #666)' }}>{record?.size || 'N/A'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong style={{ color: 'var(--text-primary, #000)' }}>Brand Description:</Text><br/>
                  <Text style={{ color: 'var(--text-secondary, #666)' }}>{record?.brand_name || 'N/A'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong style={{ color: 'var(--text-primary, #000)' }}>Pressure Setting:</Text><br/>
                  <Text style={{ color: 'var(--text-secondary, #666)' }}>{record?.pressure_setting || 'N/A'}</Text>
                </Col>
                <Col span={12}>
                  <Text strong style={{ color: 'var(--text-primary, #000)' }}>Remarks:</Text><br/>
                  <Text style={{ color: 'var(--text-secondary, #666)' }}>{record?.remarks || 'N/A'}</Text>
                </Col>
              </Row>
            </div>
            
            {/* Status Log */}
            <div>
              <Title level={5} style={{ color: 'var(--text-primary, #000)' }}>Status Log</Title>
              <Table
                columns={statusLogColumns}
                dataSource={statusLogData}
                pagination={false}
                size="small"
                bordered
                style={{ background: 'var(--bg-primary, #fff)' }}
              />
            </div>
          </Col>
          
          {/* Right Column - Map */}
          <Col xs={24} lg={10}>
            <div style={{ position: 'sticky', top: 0 }}>
              <Title level={5} style={{ marginBottom: 16, color: 'var(--text-primary, #000)' }}>Location Map</Title>
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 32px', background: 'var(--bg-secondary, #f7f9fc)', borderRadius: '0 0 8px 8px', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <button onClick={onCancel} style={{ background: 'var(--primary-color, #1890ff)', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 18px', fontWeight: 600 }}>Close</button>
      </div>
    </Modal>
  );
};

export default PressureSettingValveDetailsModal;