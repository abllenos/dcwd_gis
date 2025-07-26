import React from 'react';
import { Form, Input, Button, Select, Divider, Typography, Row, Col } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  fontSize: 12,
};

const ReportALeak: React.FC = () => {
  return (
    <div style={{ padding: 5, fontFamily: 'Segoe UI, sans-serif' }}>
      <Title level={3} style={{ fontWeight: 'bold' }}>
        Report A Leak
      </Title>

      <Divider orientation="left">
        <Text strong>Contact Information</Text>
      </Divider>

      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={<span style={labelStyle}>Account No or Meter No</span>}>
                <Input.Group compact>
                <Input style={{ width: 'calc(100% - 700px)' }} placeholder="Enter account or meter number" />
                <Button type="primary">Search</Button>
                </Input.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={<span style={labelStyle}>Name</span>}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<span style={labelStyle}>Contact No.</span>}>
              <Input />
            </Form.Item>
          </Col>
          
        </Row>

        <Divider orientation="left">
          <Text strong>Leak Information</Text>
        </Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={<span style={labelStyle}>Leak Type</span>}>
              <Select placeholder="SELECT">
                <Option value="minor">Minor</Option>
                <Option value="major">Major</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<span style={labelStyle}>Leak Pressure</span>}>
              <Select placeholder="SELECT" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<span style={labelStyle}>Visibility</span>}>
              <Select placeholder="SELECT" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={<span style={labelStyle}>Address</span>}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<span style={labelStyle}>Landmark</span>}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={<span style={labelStyle}>Nearest Meter</span>}>
          <Input />
        </Form.Item>

        <Form.Item label={<span style={labelStyle}>Remarks</span>}>
          <Input.TextArea rows={3} />
        </Form.Item>

        <Divider orientation="left">
          <Text strong>Search Address</Text>
        </Divider>

        <Form.Item label={<span style={labelStyle}>Search</span>}>
          <Input placeholder="e.g., Matina, Davao City, Davao del Sur" />
        </Form.Item>

        <div style={{ height: 350, border: '1px solid #ccc', marginBottom: 16 }}>
          <iframe
            title="Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125259.98975149246!2d125.4952082!3d7.09101925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f90db8f7a5ec45%3A0x9cfc1cf02b731b02!2sDavao%20City!5e0!3m2!1sen!2sph!4v1625094609834!5m2!1sen!2sph"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button danger>Cancel</Button>
          <Button type="primary">Submit</Button>
        </div>
      </Form>
    </div>
  );
};

export default ReportALeak;
