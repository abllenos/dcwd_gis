import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Tabs, Button, Table, Typography, Space, Card, DatePicker } from 'antd';
import GeometryMap from '../GeometryMap';
import { coordinatesToWKB } from '../../utils/wkbParser';

const { Option } = Select;
const { TabPane } = Tabs;
const { Title } = Typography;

interface Props {
  visible: boolean;
  record: any;
  onCancel: () => void;
  onUpdate: (values: any) => void;
}

const statusOptions = ['Operational', 'Inactive', 'Under Maintenance'];
const prvSizes = ['50mm', '75mm', '100mm', '150mm'];

const statusLogColumns = [
  { title: 'Description', dataIndex: 'desc', key: 'desc' },
  { title: 'Person In Charge', dataIndex: 'person', key: 'person' },
  { title: 'Administered By', dataIndex: 'admin', key: 'admin' },
  { title: 'Date and Time Updated', dataIndex: 'date', key: 'date' },
];

const statusLogData: any[] = [];

const PressureReleaseValveModal: React.FC<Props> = ({ visible, record, onCancel, onUpdate }) => {
  const [form] = Form.useForm();

  // Map API fields to form fields
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        prvNumber: record.prvNumber || '',
        status: record.status || '',
        location: record.location || '',
        dateInstalled: record.dateInstalled || '',
        barangay: record.barangay || '',
        size: record.size || '',
        prvSetting: record.prvSetting || '',
        inletPressure: record.inletPressure || '',
        outletPressure: record.outletPressure || '',
        manufacturer: record.manufacturer || '',
        model: record.model || '',
        serialNumber: record.serialNumber || '',
        workOrderNo: record.workOrderNo || '',
        remarks: record.remarks || '',
        projectTitle: record.projectTitle || '',
        hotlink: record.hotlink || '',
        geom: record.geom || ''
      });
    } else {
      form.resetFields();
    }
  }, [record, form]);

  const handleUpdate = () => {
    form.validateFields().then(values => {
      onUpdate({ ...record, ...values });
    });
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1200}
      style={{ top: 24 }}
      bodyStyle={{ padding: 0 }}
      destroyOnClose
      maskClosable={false}
    >
      <div style={{ padding: '24px 32px', background: '#fff', borderRadius: '8px 8px 0 0', borderBottom: '1px solid #e8e8e8' }}>
        <Title level={4} style={{ margin: 0, color: '#3a5fc8' }}>Pressure Release Valve - Maintenance</Title>
      </div>
      <div style={{ padding: '32px', background: '#fff' }}>
        <Form form={form} layout="vertical">
          <Tabs defaultActiveKey="1" type="card" style={{ marginBottom: 0 }}>
            <TabPane tab="Details" key="1">
              <Row gutter={32}>
                <Col xs={24} md={12}>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="PRV Number" name="prvNumber">
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
                      <Form.Item label="Location" name="location">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Date Installed" name="dateInstalled">
                        <DatePicker 
                          style={{ width: '100%' }} 
                          placeholder="Select date"
                          format="YYYY-MM-DD"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="Barangay" name="barangay">
                    <Select allowClear>
                      <Option value="">- SELECT -</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Remarks" name="remarks">
                    <Input.TextArea rows={3} style={{ resize: 'none' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Location Map</label>
                  <div style={{ 
                    height: '480px', 
                    width: '100%',
                    maxWidth: '500px',
                    borderRadius: '6px', 
                    overflow: 'hidden',
                    border: '1px solid #e8e8e8',
                    position: 'relative'
                  }}>
                    {(() => {
                      // Helper function to create WKB-like geom string from lat/lon
                      const createGeomFromCoords = (lat: number, lon: number) => {
                        return `POINT(${lon} ${lat})`;
                      };

                      let lat: number | null = null;
                      let lon: number | null = null;
                      let geomString: string | undefined = undefined;

                      // Try to extract coordinates from various formats
                      if (record?.lat && record?.lon) {
                        lat = parseFloat(record.lat);
                        lon = parseFloat(record.lon);
                      } else if (record?.latitude && record?.longitude) {
                        lat = parseFloat(record.latitude);
                        lon = parseFloat(record.longitude);
                      } else if (record?.coordinates && record.coordinates.length === 2) {
                        lat = record.coordinates[0];
                        lon = record.coordinates[1];
                      } else if (record?.geom) {
                        geomString = record.geom;
                      }

                      // Create geom string if we have valid coordinates
                      if (lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon)) {
                        geomString = createGeomFromCoords(lat, lon);
                      }

                      return visible && geomString ? (
                        <GeometryMap 
                          key={record?.id || 'new'}
                          geom={geomString}
                          height={480}
                          editable={false}
                          markerColor="#0088cc"
                          markerLabel={`PRV: ${record?.prvNumber || 'Unknown'}`}
                          onLocationChange={(lng: number, lat: number) => {
                            const wkb = coordinatesToWKB(lng, lat);
                            form.setFieldsValue({ geom: wkb });
                          }}
                        />
                      ) : (
                        // Show blurred map with overlay when no coordinates
                        <div style={{ position: 'relative', height: '100%' }}>
                          <div style={{ 
                            filter: 'blur(3px)', 
                            opacity: 0.5,
                            height: '100%'
                          }}>
                            <GeometryMap 
                              height={480}
                              editable={false}
                              markerColor="#cccccc"
                              markerLabel="No Location"
                            />
                          </div>
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            padding: '16px'
                          }}>
                            <div style={{
                              fontSize: '48px',
                              color: '#d9d9d9',
                              marginBottom: '16px'
                            }}>
                              📍
                            </div>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: 600,
                              color: '#999',
                              marginBottom: '8px'
                            }}>
                              No Location Data
                            </div>
                            <div style={{
                              fontSize: '14px',
                              color: '#666',
                              lineHeight: '1.4'
                            }}>
                              Geographic coordinates are not available for this pressure release valve
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Technical Details" key="2">
              <Row gutter={32}>
                <Col xs={24} md={12}>
                  <Card size="small" title={<span style={{ color: '#fff' }}>PRV Details</span>} headStyle={{ background: '#3a5fc8', color: '#fff' }} bodyStyle={{ background: '#f7f9fc' }}>
                    <Form.Item label="Valve Size" name="size">
                      <Select allowClear>{prvSizes.map(opt => <Option key={opt}>{opt}</Option>)}</Select>
                    </Form.Item>
                    <Form.Item label="PRV Setting (psi)" name="prvSetting">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Inlet Pressure (psi)" name="inletPressure">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Outlet Pressure (psi)" name="outletPressure">
                      <Input />
                    </Form.Item>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small" title={<span style={{ color: '#fff' }}>Additional Details</span>} headStyle={{ background: '#3a5fc8', color: '#fff' }} bodyStyle={{ background: '#f7f9fc' }}>
                    <Form.Item label="Manufacturer" name="manufacturer">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Model" name="model">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Serial Number" name="serialNumber">
                      <Input />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Project Details" key="3">
              <Row gutter={32}>
                <Col xs={24} md={12}>
                  <Form.Item label="Work Order Number" name="workOrderNo">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Remarks" name="remarks">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Project Title" name="projectTitle">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Hotlink" name="hotlink">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Status Log" key="4">
              <Table
                columns={statusLogColumns}
                dataSource={statusLogData}
                pagination={false}
                bordered
                size="small"
                style={{ marginTop: 16 }}
                locale={{ emptyText: 'No status log entries.' }}
              />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <Button type="primary" style={{ backgroundColor: '#1677ff' }}>Renew</Button>
              </div>
            </TabPane>
          </Tabs>
        </Form>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 32px', background: '#fff', borderTop: '1px solid #e8e8e8', borderRadius: '0 0 8px 8px', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <Space>
          <Button type="primary" onClick={handleUpdate} style={{ background: '#00c29b', borderColor: '#00c29b' }}>Update</Button>
          <Button danger onClick={onCancel}>Close</Button>
        </Space>
      </div>
    </Modal>
  );
};

export default PressureReleaseValveModal;

// Named alias export (helps some editors/tsserver detect the module after quick changes)
export const PressureReleaseValveModalComponent = PressureReleaseValveModal;