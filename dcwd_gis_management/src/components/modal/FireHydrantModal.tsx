import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Tabs, Button, Table, Typography, Space } from 'antd';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title } = Typography;

interface Props {
  visible: boolean;
  record: any;
  onCancel: () => void;
  onUpdate: () => void;
}

const statusOptions = ['Operational', 'Inactive', 'Under Maintenance'];
const hydrantTypes = ['Wet', 'Dry'];
const hydrantSizes = ['2"', '4"', '6"'];

const statusLogColumns = [
  { title: 'Description', dataIndex: 'desc', key: 'desc' },
  { title: 'Person In Charge', dataIndex: 'person', key: 'person' },
  { title: 'Administered By', dataIndex: 'admin', key: 'admin' },
  { title: 'Date and Time Updated', dataIndex: 'date', key: 'date' },
];

const statusLogData: any[] = [];

const FireHydrantModal: React.FC<Props> = ({ visible, record, onCancel, onUpdate }) => {
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
        <Title level={4} style={{ margin: 0, color: '#3a5fc8' }}>Fire Hydrant - Maintenance</Title>
      </div>
      <div style={{ padding: 0 }}>
        <Tabs defaultActiveKey="1" style={{ padding: '0 24px' }}>
          <TabPane tab="Details" key="1">
            <Form layout="vertical" initialValues={record}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Fire Hydrant ID" name="assetId">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Status" name="status">
                    <Select>
                      {statusOptions.map(opt => <Option key={opt}>{opt}</Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Location" name="location">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Date Installed" name="dateInstalled">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Barangay" name="barangay">
                    <Select>
                      <Option value="">- SELECT -</Option>
                    </Select>
                  </Form.Item>
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
                <div style={{ background: '#e9edfa', padding: 8, borderRadius: 4, marginBottom: 12, fontWeight: 600 }}>Hydrant Details</div>
                <Form layout="vertical" initialValues={record}>
                  <Form.Item label="Hydrant Size (mm)" name="size"><Select>{hydrantSizes.map(opt => <Option key={opt}>{opt}</Option>)}</Select></Form.Item>
                  <Form.Item label="Hydrant Type" name="type"><Select>{hydrantTypes.map(opt => <Option key={opt}>{opt}</Option>)}</Select></Form.Item>
                  <Form.Item label="Pressure (psi)" name="pressure"><Input /></Form.Item>
                </Form>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ background: '#e9edfa', padding: 8, borderRadius: 4, marginBottom: 12, fontWeight: 600 }}>Gate Valve Details</div>
                <Form layout="vertical" initialValues={record}>
                  <Form.Item label="Valve Type" name="valveType"><Select><Option>- SELECT -</Option></Select></Form.Item>
                  <Form.Item label="No. of Turns" name="noOfTurns"><Input /></Form.Item>
                  <Form.Item label="Depth [m]" name="depth"><Input /></Form.Item>
                </Form>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Project Details" key="3">
            <Form layout="vertical" initialValues={record}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Work Order Number" name="workOrderNo"><Input /></Form.Item>
                  <Form.Item label="Remarks" name="remarks"><Input /></Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Project Title" name="projectTitle"><Input /></Form.Item>
                  <Form.Item label="Hotlink" name="hotlink"><Input /></Form.Item>
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
              style={{ background: '#fff' }}
            />
          </TabPane>
        </Tabs>
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

export default FireHydrantModal;
