import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Tabs, Button, Table, Typography, Space } from 'antd';

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
const valveTypes = ['Spring', 'Pilot', 'Balanced'];
const valveBrands = ['Brand A', 'Brand B'];

const statusLogColumns = [
  { title: 'Description', dataIndex: 'desc', key: 'desc' },
  { title: 'Person In Charge', dataIndex: 'person', key: 'person' },
  { title: 'Administered By', dataIndex: 'admin', key: 'admin' },
  { title: 'Date and Time Updated', dataIndex: 'date', key: 'date' },
];

const statusLogData: any[] = [];

const PressureReleaseValveModal: React.FC<Props> = ({ visible, record, onCancel, onUpdate }) => {
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
        <Title level={4} style={{ margin: 0, color: '#3a5fc8' }}>Pressure Release Valve - Maintenance</Title>
      </div>

      <div style={{ padding: 0 }}>
        <Tabs defaultActiveKey="1" style={{ padding: '0 24px' }}>
          <TabPane tab="Details" key="1">
            <Form layout="vertical" initialValues={record}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Asset Tag" name="assetTag"><Input /></Form.Item>
                  <Form.Item label="PRV Number" name="prvNumber"><Input /></Form.Item>
                  <Form.Item label="Status" name="status">
                    <Select>
                      {statusOptions.map(opt => <Option key={opt}>{opt}</Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Date Installed" name="dateInstalled"><Input /></Form.Item>
                  <Form.Item label="Location" name="location"><Input /></Form.Item>
                  <Form.Item label="Barangay" name="barangay"><Input /></Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <div style={{ minHeight: 200, background: '#fff', border: '1px solid #eee', borderRadius: 6 }} />
                </Col>
              </Row>
            </Form>
          </TabPane>

          <TabPane tab="Technical Details" key="2">
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <div style={{ background: '#e9edfa', padding: 8, borderRadius: 4, marginBottom: 12, fontWeight: 600 }}>Valve Details</div>
                <Form layout="vertical" initialValues={record}>
                  <Form.Item label="Valve Type" name="type">
                    <Select>
                      {valveTypes.map(v => <Option key={v}>{v}</Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Size [mm]" name="size"><Input /></Form.Item>
                  <Form.Item label="Brand" name="brand">
                    <Select>
                      {valveBrands.map(b => <Option key={b}>{b}</Option>)}
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ background: '#e9edfa', padding: 8, borderRadius: 4, marginBottom: 12, fontWeight: 600 }}>Installation</div>
                <Form layout="vertical" initialValues={record}>
                  <Form.Item label="Elevation [m]" name="elevation"><Input /></Form.Item>
                  <Form.Item label="Valve Status" name="valveStatus"><Select>{statusOptions.map(s => <Option key={s}>{s}</Option>)}</Select></Form.Item>
                  <Form.Item label="Remarks" name="remarks"><Input /></Form.Item>
                </Form>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Project Details" key="3">
            <Form layout="vertical" initialValues={record}>
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
            </Form>
          </TabPane>

          <TabPane tab="Status Log" key="4">
            <Table
              columns={statusLogColumns}
              dataSource={statusLogData}
              pagination={false}
              size="small"
              bordered
            />
          </TabPane>
        </Tabs>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 32px', background: '#f7f9fc', borderRadius: '0 0 8px 8px', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <Space>
          <Button type="primary" onClick={onUpdate} style={{ background: '#00c29b', borderColor: '#00c29b' }}>Update</Button>
          <Button danger onClick={onCancel}>Close</Button>
        </Space>
      </div>
    </Modal>
  );
};

export default PressureReleaseValveModal;

// Named alias export (helps some editors/tsserver detect the module after quick changes)
export const PressureReleaseValveModalComponent = PressureReleaseValveModal;
