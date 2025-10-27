import React, { useEffect } from "react";
import { Modal, Form, Input, Row, Col, Button, Typography, Space, Tabs, Select, Table, DatePicker } from "antd";
import type { IsolationValve } from '../types/isolationValve';
import GeometryMap from "../../components/GeometryMap";
import { coordinatesToWKB } from "../../utils/wkbParser";

const { Title } = Typography;

interface IsolationValveEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: (values: any) => void;
  record: IsolationValve | null;
}

const IsolationValveEditModal: React.FC<IsolationValveEditModalProps> = ({ visible, onCancel, onUpdate, record }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  }, [record, form]);

  const handleUpdate = () => {
    form.validateFields().then(values => {
      onUpdate(values);
    });
  };

  // Example dropdown options (replace with real data as needed)
  const statusOptions = [
    { value: 'Operational', label: 'Operational' },
    { value: 'Needs Repair', label: 'Needs Repair' },
    { value: 'Out of Service', label: 'Out of Service' },
  ];
  const barangayOptions = [
    { value: 'Communal', label: 'Communal' },
    { value: 'Other', label: 'Other' },
  ];
  const brandOptions = [
    { value: 'Brand A', label: 'Brand A' },
    { value: 'Brand B', label: 'Brand B' },
  ];
  const valveTypeOptions = [
    { value: 'Gate Valve', label: 'Gate Valve' },
    { value: 'Butterfly Valve', label: 'Butterfly Valve' },
  ];

  // Status Log Table columns (example)
  const statusLogColumns = [
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Person In-Charge', dataIndex: 'person', key: 'person' },
    { title: 'Administered By', dataIndex: 'admin', key: 'admin' },
    { title: 'Date and Time Updated', dataIndex: 'date', key: 'date' },
  ];
  // Example status log data
  const statusLogData: any[] = [];

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1200}
      style={{ top: 24 }}
      styles={{ body: { padding: 0 } }}
      destroyOnClose
      maskClosable={false}
    >
      <div style={{ padding: '24px 32px', background: 'var(--bg-secondary, #fff)', borderRadius: '8px 8px 0 0', borderBottom: '1px solid var(--border-color, #e8e8e8)' }}>
        <Title level={4} style={{ margin: 0, color: 'var(--primary-color, #1890ff)' }}>Isolation Valve - Maintenance</Title>
      </div>
      <div style={{ padding: '32px', background: 'var(--bg-primary, #fff)' }}>
        <Form form={form} layout="vertical">
          <Tabs defaultActiveKey="1" type="card" style={{ marginBottom: 0 }}>
            <Tabs.TabPane tab="Details" key="1">
              <Row gutter={32}>
                <Col xs={24} md={12}>
                  <Row gutter={[16, 0]} style={{ marginBottom: 12 }}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="GV Number" name="gvnumber" style={{ marginBottom: 16 }}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Status" name="status" style={{ marginBottom: 16 }}>
                        <Select options={statusOptions} allowClear />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={[16, 0]} style={{ marginBottom: 12 }}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Location" name="location" style={{ marginBottom: 16 }}>
                        <Input placeholder={record?.location || "Enter location"} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Date Installed" name="date_installed" style={{ marginBottom: 16 }}>
                        <DatePicker 
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                          placeholder="Select date"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="Water Source" name="water_source" style={{ marginBottom: 16 }}>
                    <Select options={[
                      { label: 'Main Line', value: 'main_line' },
                      { label: 'Distribution', value: 'distribution' },
                      { label: 'Service Line', value: 'service_line' }
                    ]} allowClear />
                  </Form.Item>

                  <Form.Item label="Barangay" name="barangay" style={{ marginBottom: 16 }}>
                    <Select options={barangayOptions} allowClear />
                  </Form.Item>

                  <Form.Item label="Valve Classification" name="valve_classification" style={{ marginBottom: 16 }}>
                    <Select options={[
                      { label: 'Gate Valve', value: 'gate' },
                      { label: 'Ball Valve', value: 'ball' },
                      { label: 'Butterfly Valve', value: 'butterfly' }
                    ]} allowClear />
                  </Form.Item>

                  <Form.Item label="Remarks" name="remarks" style={{ marginBottom: 0 }}>
                    <Input.TextArea rows={4} style={{ resize: 'none' }} />
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
                        markerColor="#ff4d4f"
                        markerLabel="Isolation Valve"
                        onLocationChange={(lng: number, lat: number) => {
                          const wkb = coordinatesToWKB(lng, lat);
                          form.setFieldsValue({ geom: wkb });
                        }}
                      />
                    )}
                  </div>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Technical Details" key="2">
              <Row gutter={32}>
                <Col xs={24} md={8}>
                  <Form.Item label="Valve Size [mm]" name="size"><Input /></Form.Item>
                  <Form.Item label="No. of Turns" name="noofturns"><Input /></Form.Item>
                  <Form.Item label="Depth [ft]" name="depth"><Input /></Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Elevation [ft]" name="elevation"><Input /></Form.Item>
                  <Form.Item label="Valve Status" name="valve_status"><Select options={statusOptions} allowClear /></Form.Item>
                  <Form.Item label="Valve Type" name="valve"><Select options={valveTypeOptions} allowClear /></Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Brand" name="brand"><Select options={brandOptions} allowClear /></Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Project Details" key="3">
              <Row gutter={32}>
                <Col xs={24} md={12}>
                  <Form.Item label="Work Order No" name="wonumber"><Input /></Form.Item>
                  <Form.Item label="Project Title" name="project_title"><Input /></Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Valve Purpose" name="purpose"><Input /></Form.Item>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Status Log" key="4">
              <Table
                columns={statusLogColumns}
                dataSource={statusLogData}
                pagination={false}
                bordered
                size="small"
                style={{ marginTop: 16 }}
                locale={{ emptyText: 'No status log entries.' }}
              />
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 32px', background: 'var(--bg-secondary, #fff)', borderTop: '1px solid var(--border-color, #e8e8e8)', borderRadius: '0 0 8px 8px', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <Space>
          <Button type="primary" onClick={handleUpdate}>Update</Button>
          <Button danger onClick={onCancel}>Close</Button>
        </Space>
      </div>
    </Modal>
  );
};

export default IsolationValveEditModal;
