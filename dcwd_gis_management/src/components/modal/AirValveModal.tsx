
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Tabs, Button, Table, Typography, Space } from 'antd';

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
      };
      onUpdate(updatePayload);
    });
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      style={{ top: 24 }}
  styles={{ body: { padding: 0 } }}
      destroyOnClose
      maskClosable
    >
      <div style={{ padding: '24px 32px 0 32px', background: '#f7f9fc', borderRadius: '8px 8px 0 0' }}>
        <Title level={4} style={{ margin: 0, color: '#3a5fc8' }}>Air Valve - Maintenance</Title>
      </div>
      <div style={{ padding: 0 }}>
        <Form form={form} layout="vertical">
          <Tabs defaultActiveKey="1" style={{ padding: '0 24px' }}>
            <TabPane tab="Details" key="1">
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Asset Tag" name="assetTag">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Status" name="status">
                    <Select allowClear>
                      {statusOptions.map(opt => <Option key={opt}>{opt}</Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Date Installed" name="dateInstalled">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Location" name="location">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Water Source" name="waterSource">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Barangay" name="barangay">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <div style={{ minHeight: 200, background: '#fff', border: '1px solid #eee', borderRadius: 6 }} />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Technical Details" key="2">
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <div style={{ background: '#e9edfa', padding: 8, borderRadius: 4, marginBottom: 12, fontWeight: 600 }}>Air Valve Details</div>
                  <Form.Item label="Air Valve Serial No." name="avSerialNo"><Input /></Form.Item>
                  <Form.Item label="Air Valve Type" name="avType"><Select allowClear>{valveTypes.map(opt => <Option key={opt}>{opt}</Option>)}</Select></Form.Item>
                  <Form.Item label="Air Valve Size" name="avSize"><Select allowClear>{valveSizes.map(opt => <Option key={opt}>{opt}</Option>)}</Select></Form.Item>
                  <Form.Item label="Air Valve Brand" name="avBrand"><Select allowClear>{valveBrands.map(opt => <Option key={opt}>{opt}</Option>)}</Select></Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <div style={{ background: '#e9edfa', padding: 8, borderRadius: 4, marginBottom: 12, fontWeight: 600 }}>Gate Valve Details</div>
                  <Form.Item label="Serial No." name="gateSerialNo"><Input /></Form.Item>
                  <Form.Item label="Valve Size" name="gateValveSize"><Input /></Form.Item>
                  <Form.Item label="Gate Valve Brand" name="gateValveBrand"><Input /></Form.Item>
                  <Form.Item label="No. of Turns" name="noOfTurns"><Input /></Form.Item>
                  <Form.Item label="Depth" name="depth"><Input /></Form.Item>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Project Details" key="3">
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
        </Form>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 32px', background: '#f7f9fc', borderRadius: '0 0 8px 8px', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <Space>
          <Button type="primary" onClick={handleUpdate} style={{ background: '#2563eb', borderColor: '#2563eb' }}>Update</Button>
          <Button danger onClick={onCancel}>Close</Button>
        </Space>
      </div>
    </Modal>
  );
};

export default AirValveModal;
