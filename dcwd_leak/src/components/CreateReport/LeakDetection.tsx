import React from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Divider,
  Typography,
  Row,
  Col,
  InputNumber,
  Breadcrumb,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { DatePicker} from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  textTransform: 'uppercase' as const,
  fontSize: 12,
  fontFamily: 'Arial, sans-serif',
};

const LeakDetection: React.FC = () => {
  return (
    <div style={{ padding: '4px 24px 24px 24px' }}>
      <Breadcrumb style={{ marginBottom: 30, fontSize: 16, fontWeight: 500 }}>
        <Breadcrumb.Item>Create A Report</Breadcrumb.Item>
        <Breadcrumb.Item>Leak Detection</Breadcrumb.Item>
      </Breadcrumb>


      <div
        style={{
          backgroundColor: '#fff',
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <Form layout="vertical">
          <Divider orientation="left">
            <Text style={{ fontSize: 18 }} strong>
              Contact Information
            </Text>
          </Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <SearchOutlined style={{ fontSize: 15 }} />
                    Search Account No or Meter No
                  </span>
                }
              >
                <Input.Group compact style={{ display: 'flex' }}>
                  <Input style={{ flex: 1 }} placeholder="Enter Account or Meter Number" />
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
              <Form.Item label={<span style={labelStyle}>Contact #</span>}>
                <Input />
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
            <Col span={12}>
              <Form.Item label={<span style={labelStyle}>Nearest Meter</span>}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            <Text style={{ fontSize: 18 }} strong>
              Leak Details
            </Text>
          </Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>Date & Time</span>}>
                <DatePicker
                  showTime={{ format: 'hh:mm A' }}
                  format="DD/MM/YY hh:mm A"
                  style={{ width: '100%' }}
                  placeholder="dd/mm/yy --:-- --"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>Leak Type</span>}>
                <Select placeholder="-SELECT-">
                  <Option value="serviceline">Serviceline</Option>
                  <Option value="mainline">Mainline</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>Leak Indicator</span>}>
                <Select placeholder="-SELECT-" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>Covering</span>}>
                <Select placeholder="-SELECT-">
                  <Option value="concrete">Concrete</Option>
                  <Option value="gravel">Gravel</Option>
                  <Option value="soil">Soil</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>NRW Level</span>}>
                <InputNumber<number>
                  min={0}
                  max={100}
                  step={0.01}
                  defaultValue={0.0}
                  style={{ width: '100%' }}
                  formatter={(value) =>
                    !isNaN(Number(value)) ? Number(value).toFixed(2) : '0.00'
                  }
                  parser={(value) => parseFloat(value || '0')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>DMA</span>}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={labelStyle}>Remarks</span>}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            <Text style={{ fontSize: 18 }} strong>
              Search Address
            </Text>
          </Divider>

          <Form.Item label={<span style={labelStyle}>Search</span>}>
            <Input placeholder="e.g., Matina, Davao City, Davao del Sur" />
          </Form.Item>

          <div style={{ height: 350, border: '1px solid #ccc', marginBottom: 24 }}>
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
    </div>
  );
};

export default LeakDetection;
