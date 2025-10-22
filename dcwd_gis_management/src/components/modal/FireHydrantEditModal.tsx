import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Row, Col, Button, Typography, Space, Tabs, Table, Card, DatePicker } from "antd";
import type { FireHydrant } from '../../stores/fireHydrantListStore';
import GeometryMap from "../GeometryMap";
import { coordinatesToWKB } from "../../utils/wkbParser";

const { Title } = Typography;

interface FireHydrantEditModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: (values: any) => void;
  record: FireHydrant | null;
}

const FireHydrantEditModal: React.FC<FireHydrantEditModalProps> = ({ visible, onCancel, onUpdate, record }) => {
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
  const hydrantClassOptions = [
    { value: 'Class A', label: 'Class A' },
    { value: 'Class B', label: 'Class B' },
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
      bodyStyle={{ padding: 0 }}
      destroyOnClose
      maskClosable={false}
    >
      <div style={{ padding: '24px 32px', background: 'var(--bg-secondary, #fff)', borderRadius: '8px 8px 0 0', borderBottom: '1px solid var(--border-color, #e8e8e8)' }}>
        <Title level={4} style={{ margin: 0, color: 'var(--primary-color, #1890ff)' }}>Fire Hydrant - Maintenance</Title>
      </div>
      <div style={{ padding: '32px', background: 'var(--bg-primary, #fff)' }}>
        <Form form={form} layout="vertical">
          <Tabs defaultActiveKey="1" type="card" style={{ marginBottom: 0 }}>
            <Tabs.TabPane tab="Details" key="1">
              <Row gutter={32}>
                <Col xs={24} md={12}>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Fire Hydrant ID" name="assetid"><Input /></Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Status" name="status"><Select options={statusOptions} allowClear /></Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item label="Location" name="location"><Input /></Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item label="Date Installed" name="date_installed"><DatePicker style={{ width: '100%' }} /></Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label="Water Source" name="water_source"><Select options={statusOptions} allowClear /></Form.Item>
                  <Form.Item label="Barangay" name="barangay"><Select options={barangayOptions} allowClear /></Form.Item>
                  <Form.Item label="Hydrant Classification" name="hydrant_classification"><Select options={hydrantClassOptions} allowClear /></Form.Item>
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
                        markerColor="#ff0000"
                        markerLabel="Fire Hydrant"
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
                <Col xs={24} md={12}>
                  <Card size="small" title={<span>Hydrant Details</span>} headStyle={{ background: 'var(--primary-color, #1890ff)', color: '#fff' }} bodyStyle={{ background: 'var(--primary-hover-bg, #f7f9fc)' }}>
                    <Form.Item label="Hydrant Size [mm]" name="size"><Input /></Form.Item>
                    <Form.Item label="Pressure [psi]" name="pressure"><Input /></Form.Item>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card size="small" title={<span>Gate Valve Details</span>} headStyle={{ background: 'var(--primary-color, #1890ff)', color: '#fff' }} bodyStyle={{ background: 'var(--primary-hover-bg, #f7f9fc)' }}>
                    <Form.Item label="Valve Type" name="valve_type"><Select options={valveTypeOptions} allowClear /></Form.Item>
                    <Form.Item label="No. of Turns" name="valve_turns"><Input /></Form.Item>
                    <Form.Item label="Valve Size [mm]" name="valve_size"><Input /></Form.Item>
                    <Form.Item label="Depth [ft]" name="valve_depth"><Input /></Form.Item>
                  </Card>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Project Details" key="3">
              <Row gutter={32}>
                <Col xs={24} md={12}>
                  <Form.Item label="Work Order" name="work_order"><Input /></Form.Item>
                  <Form.Item label="Remarks" name="project_remarks"><Input /></Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Project Title" name="project_title"><Input /></Form.Item>
                  <Form.Item label="Tapping Details" name="tapping_details"><Input /></Form.Item>
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

export default FireHydrantEditModal;
