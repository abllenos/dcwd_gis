import { Modal, Form, Input, Select, Button, Row, Col, Table, Typography, Upload, Tabs, Space, DatePicker } from 'antd';
import GeometryMap from '../GeometryMap';
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

  // All fields are editable
  const fieldProps = {};

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
      style={{ top: 24 }}
      styles={{ body: { padding: 0 } }}
      destroyOnHidden
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
              <Row gutter={32}>
                <Col xs={24} md={12}>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Asset Tag" name="assetTag">
                        <Input {...fieldProps} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Status" name="status">
                        <Select options={statusOptions} {...fieldProps} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Location" name="location">
                        <Input {...fieldProps} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Date Installed" name="dateInstalled">
                        <DatePicker style={{ width: '100%' }} placeholder="Select date" {...fieldProps} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="Water Source" name="waterSource">
                    <Select options={waterSourceOptions} {...fieldProps} />
                  </Form.Item>
                  <Form.Item label="Barangay" name="barangay">
                    <Select options={barangayOptions} {...fieldProps} />
                  </Form.Item>
                  <Form.Item label="Upload Photo" name="photo" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}>
                    <Upload beforeUpload={() => false} listType="picture">
                      <Button className="btn-select" icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Location Map</label>
                    <div style={{ width: '100%', height: '500px', position: 'relative', border: '1px solid #d9d9d9', borderRadius: '6px', overflow: 'hidden' }}>
                      {open && (() => {
                        // Check for geometry data in various formats
                        const hasGeometry = initialValues?.geom;
                        const hasLatLng = initialValues?.lat && initialValues?.lng;
                        
                        console.log('Blow Off Valve Data:', {
                          geom: initialValues?.geom,
                          lat: initialValues?.lat,
                          lng: initialValues?.lng,
                          location: initialValues?.location
                        });
                        
                        if (hasGeometry || hasLatLng) {
                          // Show map with actual coordinates
                          let geometryData = hasGeometry;
                          
                          if (!geometryData && hasLatLng) {
                            geometryData = `POINT(${initialValues.lng} ${initialValues.lat})`;
                          }
                          
                          return (
                            <GeometryMap 
                              key={`blowoff-${initialValues?.id || 'default'}`}
                              geom={geometryData}
                              height={500}
                              editable={false}
                              markerColor="#2563eb"
                              markerLabel={`Blow Off Valve ${initialValues?.assetTag || initialValues?.bovnumber || ''}`}
                            />
                          );
                        }
                        
                        // Show blurred map with message when no coordinates
                        return (
                          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <div style={{ filter: 'blur(3px)', opacity: 0.5 }}>
                              <GeometryMap 
                                key={`blurred-${initialValues?.id || 'default'}`}
                                geom="POINT(125.6128 7.0731)"
                                height={500}
                                editable={false}
                                markerColor="#cccccc"
                                markerLabel="No Location"
                              />
                            </div>
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              background: 'rgba(255, 255, 255, 0.95)',
                              padding: '20px 30px',
                              borderRadius: '8px',
                              border: '2px solid #e0e0e0',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              textAlign: 'center',
                              zIndex: 1000
                            }}>
                              <div style={{ 
                                fontSize: '16px', 
                                fontWeight: 600, 
                                color: '#666',
                                marginBottom: '8px'
                              }}>
                                📍 No Coordinate Data Available
                              </div>
                              <div style={{ 
                                fontSize: '14px', 
                                color: '#999',
                                marginBottom: '8px'
                              }}>
                                Location: {initialValues?.location || 'Not specified'}
                              </div>
                              <div style={{ 
                                fontSize: '12px', 
                                color: '#bbb'
                              }}>
                                Coordinates needed to display map pin
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane tab="Technical Details" key="2">
            <Form form={form} layout="vertical" initialValues={initialValues}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Valve Size [mm]" name="valveSize"><Input {...fieldProps} /></Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="No of Turns" name="noOfTurns"><Input {...fieldProps} /></Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane tab="Project Details" key="3">
            <Form form={form} layout="vertical" initialValues={initialValues}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Work Order No." name="workOrderNo"><Input {...fieldProps} /></Form.Item>
                  <Form.Item label="Project Title" name="projectTitle"><Input {...fieldProps} /></Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Remarks" name="remarks"><Input {...fieldProps} /></Form.Item>
                  <Form.Item label="Hotlink" name="hotlink"><Input {...fieldProps} /></Form.Item>
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

          <Button className="btn-update" htmlType="submit" loading={loading} onClick={form.submit}>
            Update
          </Button>
          <Button className="btn-close" onClick={onClose}>

            Close
          </Button>
        </Space>
      </div>

    </Modal>
  );
};
export default BlowOffValveModal;
