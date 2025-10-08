import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Tabs, Button, Table, Typography, Space, DatePicker } from 'antd';
import GeometryMap from '../GeometryMap';

const { Option } = Select;
const { TabPane } = Tabs as any;
const { Title } = Typography;

interface Props {
  visible: boolean;
  record: any;
  onCancel: () => void;
  onUpdate: () => void;
}

const statusOptions = ['Operational', 'Inactive', 'Under Maintenance'];
const valveTypes = ['Pressure Regulator', 'Pressure Reducing Valve', 'Pressure Sustaining'];

const statusLogColumns = [
  { title: 'Description', dataIndex: 'desc', key: 'desc' },
  { title: 'Person In Charge', dataIndex: 'person', key: 'person' },
  { title: 'Administered By', dataIndex: 'admin', key: 'admin' },
  { title: 'Date and Time Updated', dataIndex: 'date', key: 'date' },
];

const statusLogData: any[] = [];

const PressureSettingValveModal: React.FC<Props> = ({ visible, record, onCancel, onUpdate }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1200}
      style={{ top: 24 }}
      styles={{ body: { padding: 0 } }}
      destroyOnClose
      maskClosable
    >
      <div style={{ padding: '24px 32px 0 32px', background: '#f7f9fc', borderRadius: '8px 8px 0 0' }}>
        <Title level={4} style={{ margin: 0, color: '#3a5fc8' }}>Pressure Setting Valve - Maintenance</Title>
      </div>

      <div style={{ padding: '32px', background: '#fff' }}>
        <Form layout="vertical" initialValues={record}>
          <Tabs defaultActiveKey="1" type="card" style={{ marginBottom: 0 }}>
            <TabPane tab="Details" key="1">
              <Row gutter={32}>
                <Col xs={24} md={12}>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Asset Tag" name="assetTag">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Status" name="status">
                        <Select allowClear>
                          {statusOptions.map(opt => <Option key={opt}>{opt}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="PS Number" name="psNumber">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Date Installed" name="dateInstalled">
                        <DatePicker style={{ width: '100%' }} placeholder="Select date" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="Location" name="location">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Barangay" name="barangay">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Location Map</label>
                    <GeometryMap
                      geom={record?.geom}
                      height={400}
                      editable={true}
                      markerColor="#3a5fc8"
                      markerLabel={`PSV ${record?.psNumber || record?.ps_number || 'Location'}`}
                      onLocationChange={(lng, lat) => {
                        console.log('Location updated:', { lng, lat });
                        // You can handle location changes here if needed
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Technical Details" key="2">
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <div style={{ background: '#e9edfa', padding: 8, borderRadius: 4, marginBottom: 12, fontWeight: 600 }}>Valve Details</div>
                  <Form.Item label="Valve Type" name="type">
                    <Select>
                      {valveTypes.map(v => <Option key={v}>{v}</Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Set Pressure [psi]" name="setPressure"><Input /></Form.Item>
                  <Form.Item label="Operating Range" name="operatingRange"><Input /></Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <div style={{ background: '#e9edfa', padding: 8, borderRadius: 4, marginBottom: 12, fontWeight: 600 }}>Installation</div>
                  <Form.Item label="Elevation [m]" name="elevation"><Input /></Form.Item>
                  <Form.Item label="Remarks" name="remarks"><Input /></Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Project Details" key="3">
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Work Order Number" name="workOrderNo"><Input /></Form.Item>
                  <Form.Item label="Remarks" name="projectRemarks"><Input /></Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Project Title" name="projectTitle"><Input /></Form.Item>
                  <Form.Item label="Purpose" name="purpose"><Input /></Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Status Log" key="4">
              <Table
                columns={statusLogColumns}
                dataSource={statusLogData}
                pagination={false}
                size="small"
                bordered
                style={{ background: '#fff', padding: 16 }}
              />
            </TabPane>
          </Tabs>
        </Form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 32px', background: '#f7f9fc', borderRadius: '0 0 8px 8px', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <Space>
          <Button type="primary" onClick={onUpdate} style={{ background: '#2563eb', borderColor: '#2563eb' }}>Update</Button>
          <Button danger onClick={onCancel}>Close</Button>
        </Space>
      </div>
    </Modal>
  );
};

export default PressureSettingValveModal;
