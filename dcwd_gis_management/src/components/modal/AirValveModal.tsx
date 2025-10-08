
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Tabs, Button, Table, Typography, Space, Card } from 'antd';
import GeometryMap from "../GeometryMap";
import { coordinatesToWKB } from "../../utils/wkbParser";

const { Option } = Select;
const { TabPane } = Tabs;
const { Title } = Typography;

interface AirValveModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: (values: any) => void;
  record: any;
}

const statusOptions = ['Operational', 'Inactive', 'Under Maintenance'];
const valveTypes = ['Type A', 'Type B'];
const valveSizes = ['2"', '4"', '6"'];
const valveBrands = ['Brand X', 'Brand Y'];

const statusLogColumns = [
  { title: 'Description', dataIndex: 'desc', key: 'desc' },
  { title: 'Person In Charge', dataIndex: 'person', key: 'person' },
  { title: 'Administered By', dataIndex: 'admin', key: 'admin' },
  { title: 'Date and Time Updated', dataIndex: 'date', key: 'date' },
];

const statusLogData: any[] = [];

const AirValveModal: React.FC<AirValveModalProps> = ({ visible, onCancel, onUpdate, record }) => {
  const [form] = Form.useForm();

  // Map API fields to form fields
  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        assetTag: record.arv_number || '',
        status: record.status || '',
        dateInstalled: record.date_installed || '',
        location: record.location || '',
        waterSource: record.water_source || '',
        barangay: record.barangay || '',
        avSerialNo: record.arv_serial_no || '',
        avType: record.type || '',
        avSize: record.size || '',
        avBrand: record.brand || '',
        gateSerialNo: record.gate_serial_no || '',
        gateValveSize: record.gate_valve_size || '',
        gateValveBrand: record.gate_valve_brand || '',
        noOfTurns: record.no_of_turns || '',
        depth: record.depth || '',
        workOrderNo: record.wonumber || '',
        remarks: record.remarks || '',
        projectTitle: record.project_title || '',
        hotlink: record.hotlink || '',
        geom: record.geom || '',
        project_remarks: record.project_remarks || record.remarks || '',
      });
    } else {
      form.resetFields();
    }
  }, [record, form]);

  const handleUpdate = () => {
    form.validateFields().then(values => {
      // Map form fields back to API fields
      const updatePayload = {
        ...record,
        arv_number: values.assetTag,
        status: values.status,
        date_installed: values.dateInstalled,
        location: values.location,
        water_source: values.waterSource,
        barangay: values.barangay,
        arv_serial_no: values.avSerialNo,
        type: values.avType,
        size: values.avSize,
        brand: values.avBrand,
        gate_serial_no: values.gateSerialNo,
        gate_valve_size: values.gateValveSize,
        gate_valve_brand: values.gateValveBrand,
        no_of_turns: values.noOfTurns,
        depth: values.depth,
        wonumber: values.workOrderNo,
        remarks: values.remarks,
        project_title: values.projectTitle,
        hotlink: values.hotlink,
        geom: values.geom || record?.geom, // Preserve or update the geometry
        project_remarks: values.project_remarks || values.remarks,
      };
      onUpdate(updatePayload);
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
        <Title level={4} style={{ margin: 0, color: '#3a5fc8' }}>Air Valve - Maintenance</Title>
      </div>
      <div style={{ padding: '32px', background: '#fff' }}>
        <Form form={form} layout="vertical">
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
                      <Form.Item label="Location" name="location">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Date Installed" name="dateInstalled">
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="Water Source" name="waterSource">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Barangay" name="barangay">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Remarks" name="remarks">
                    <Input.TextArea rows={3} style={{ resize: 'none' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Location Map</label>
                    {visible && (
                      <GeometryMap 
                        key={record?.id || 'new'}
                        geom={record?.geom} 
                        height={500}
                        editable={false}
                        markerColor="#0088cc"
                        markerLabel="Air Valve"
                        onLocationChange={(lng: number, lat: number) => {
                          const wkb = coordinatesToWKB(lng, lat);
                          form.setFieldsValue({ geom: wkb });
                        }}
                      />
                    )}
                  </div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Technical Details" key="2">
              <Row gutter={32}>
                <Col xs={24} md={12}>
                  <Card size="small" title={<span style={{ color: '#fff' }}>Air Valve Details</span>} headStyle={{ background: '#3a5fc8', color: '#fff' }} bodyStyle={{ background: '#f7f9fc' }}>
                    <Form.Item label="Air Valve Serial No." name="avSerialNo"><Input /></Form.Item>
                    <Form.Item label="Air Valve Type" name="avType"><Select allowClear>{valveTypes.map(opt => <Option key={opt}>{opt}</Option>)}</Select></Form.Item>
                    <Form.Item label="Air Valve Size" name="avSize"><Select allowClear>{valveSizes.map(opt => <Option key={opt}>{opt}</Option>)}</Select></Form.Item>
                    <Form.Item label="Air Valve Brand" name="avBrand"><Select allowClear>{valveBrands.map(opt => <Option key={opt}>{opt}</Option>)}</Select></Form.Item>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small" title={<span style={{ color: '#fff' }}>Gate Valve Details</span>} headStyle={{ background: '#3a5fc8', color: '#fff' }} bodyStyle={{ background: '#f7f9fc' }}>
                    <Form.Item label="Serial No." name="gateSerialNo"><Input /></Form.Item>
                    <Form.Item label="Valve Size" name="gateValveSize"><Input /></Form.Item>
                    <Form.Item label="Gate Valve Brand" name="gateValveBrand"><Input /></Form.Item>
                    <Form.Item label="No. of Turns" name="noOfTurns"><Input /></Form.Item>
                    <Form.Item label="Depth" name="depth"><Input /></Form.Item>
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Project Details" key="3">
              <Row gutter={32}>
                <Col xs={24} md={12}>
                  <Form.Item label="Work Order Number" name="workOrderNo"><Input /></Form.Item>
                  <Form.Item label="Remarks" name="project_remarks"><Input /></Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Project Title" name="projectTitle"><Input /></Form.Item>
                  <Form.Item label="Hotlink" name="hotlink"><Input /></Form.Item>
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

export default AirValveModal;
