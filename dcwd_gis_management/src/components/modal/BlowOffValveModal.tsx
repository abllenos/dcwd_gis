import { Modal, Form, Input, Select, Button, Row, Col, Table, Typography, Upload, Tabs, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;

const statusOptions = [
  { value: '', label: '- SELECT -' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];
const waterSourceOptions = [
  { value: '', label: '- SELECT -' },
  { value: 'Deep Well', label: 'Deep Well' },
  { value: 'Surface', label: 'Surface' },
];
const barangayOptions = [
  { value: '', label: '- SELECT -' },
  { value: 'Barangay 1', label: 'Barangay 1' },
  { value: 'Barangay 2', label: 'Barangay 2' },
];

const statusLogColumns = [
  { title: 'Description', dataIndex: 'description', key: 'description' },
  { title: 'Person In-Charge', dataIndex: 'person', key: 'person' },
  { title: 'Administered By', dataIndex: 'admin', key: 'admin' },
  { title: 'Date and Time Updated', dataIndex: 'date', key: 'date' },
];

interface BlowOffValveModalProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Record<string, any>;
  loading?: boolean;
}

const BlowOffValveModal: React.FC<BlowOffValveModalProps> = ({ open, onClose, initialValues = {}, loading = false }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 24 }}
      bodyStyle={{ padding: 0 }}
      destroyOnClose
      maskClosable
      title={null}
    >
      <div style={{ padding: '24px 32px 0 32px', background: '#f7f9fc', borderRadius: '8px 8px 0 0' }}>
        <Title level={4} style={{ margin: 0, color: '#2563eb' }}>Blow Off Valve - Maintenance</Title>
      </div>
      <div style={{ padding: 0 }}>
        <Tabs defaultActiveKey="1" style={{ padding: '0 24px' }}>
          <TabPane tab="Details" key="1">
            <Form form={form} layout="vertical" initialValues={initialValues}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Asset Tag" name="assetTag"><Input /></Form.Item>
                  <Form.Item label="Date Installed" name="dateInstalled"><Input /></Form.Item>
                  <Form.Item label="Location" name="location"><Input /></Form.Item>
                  <Form.Item label="Water Source" name="waterSource"><Select options={waterSourceOptions} /></Form.Item>
                  <Form.Item label="Barangay" name="barangay"><Select options={barangayOptions} /></Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Status" name="status"><Select options={statusOptions} /></Form.Item>
                  <Form.Item label="Upload Photo" name="photo" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}>
                    <Upload beforeUpload={() => false} listType="picture">
                      <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane tab="Technical Details" key="2">
            <Form form={form} layout="vertical" initialValues={initialValues}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Valve Size [mm]" name="valveSize"><Input /></Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="No of Turns" name="noOfTurns"><Input /></Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane tab="Project Details" key="3">
            <Form form={form} layout="vertical" initialValues={initialValues}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Work Order No." name="workOrderNo"><Input /></Form.Item>
                  <Form.Item label="Project Title" name="projectTitle"><Input /></Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Remarks" name="remarks"><Input /></Form.Item>
                  <Form.Item label="Hotlink" name="hotlink"><Input /></Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane tab="Status Log" key="4">
            <Table
              columns={statusLogColumns}
              dataSource={[]}
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
          <Button type="primary" htmlType="submit" loading={loading} style={{ background: '#16a34a', border: 'none' }} onClick={form.submit}>
            Update
          </Button>
          <Button danger onClick={onClose} style={{ minWidth: 80 }}>
            Close
          </Button>
        </Space>
      </div>

    </Modal>
  );
};
export default BlowOffValveModal;
