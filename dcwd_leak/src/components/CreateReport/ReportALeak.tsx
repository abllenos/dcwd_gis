import React, { useState, useEffect } from 'react';
import MapComponent from '../Endpoints/MapView';
import {
  Form,
  Input,
  Button,
  Select,
  Divider,
  Typography,
  Row,
  Col,
  Breadcrumb,
  Upload,
  message
} from 'antd';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { apiGis, devApi } from '../Endpoints/Interceptor';

const { Text } = Typography;
const { Option } = Select;

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  textTransform: 'uppercase' as const,
  fontSize: 12,
  fontFamily: 'Arial, sans-serif',
};

const ReportALeak: React.FC = () => {
  const [form] = Form.useForm();
  const [lat, setLat] = useState<number>(7.0722);
  const [lng, setLng] = useState<number>(125.6131);
  const [wscode, setWscode] = useState<string>('');
  const [CT_ID, setCaretaker] = useState<string>('');
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lat !== null && lng !== null) {
      fetchWscode(lat, lng);
      fetchCaretaker(lat, lng);
    }
  }, [lat, lng]);

  const fetchWscode = async (lat: number, lng: number) => {
    try {
      const response = await apiGis.get(`helpers/leaksys/getWSS.php?lat=${lat}&lng=${lng}`);
      const data = response.data;
      if (data.success && data.data && data.data.length > 0) {
        setWscode(data.data[0].wscode);
      }
    } catch (error) {
      console.error('Error fetching wscode:', error);
    }
  };

  const fetchCaretaker = async (lat: number, lng: number) => {
    try {
      const response = await apiGis.get(`helpers/leaksys/getCaretaker.php?lat=${lat}&lng=${lng}`);
      const data = response.data;
      if (data && data.CT_ID) {
        setCaretaker(data.CT_ID);
      } else if (Array.isArray(data.data) && data.data[0]?.CT_ID) {
        setCaretaker(data.data[0].CT_ID);
      }
    } catch (error) {
      console.error('Error fetching caretaker:', error);
    }
  };

  const handleMapClick = (clickedLat: number, clickedLng: number) => {
    setLat(clickedLat);
    setLng(clickedLng);
  };

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append('Name', values.Name || '');
    formData.append('Number', values.Number || '');
    formData.append('NearestMeter', values.NearestMeter || '');
    formData.append('Address', values.address || '');
    formData.append('Landmark', values.Landmark || '');
    formData.append('LeakPressure', values.leakPressure || '');
    formData.append('Visibility', values.visibility || '');
    formData.append('TypeId', values.typeId || '');
    formData.append('SpoolID', '0');
    formData.append('Latitude', lat.toString());
    formData.append('Longitude', lng.toString());
    formData.append('wscode', wscode);
    formData.append('ct_code', CT_ID);

    const dateReported = new Date().toISOString(); // YYYY-MM-DDTHH:MM:SS.sssZ
    formData.append('DateReported', dateReported);

    if (fileList.length) {
      fileList.forEach((file) => {
        formData.append('Images', file.originFileObj);
      });
    }

    try {
      setLoading(true);
      const response = await devApi.post(
        'dcwd-gis/api/v1/admin/LeakDetection/saveLeakReport',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      message.success('Leak report submitted successfully');
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error(error);
      message.error('Failed to submit leak report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '4px 24px 24px 24px' }}>
      <Breadcrumb style={{ marginBottom: 30, fontSize: 16, fontWeight: 500 }}>
        <Breadcrumb.Item>Create A Report</Breadcrumb.Item>
        <Breadcrumb.Item>Report A Leak</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ backgroundColor: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Divider orientation="left">
            <Text style={{ fontSize: 18 }} strong>Contact Information</Text>
          </Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 4 }}><SearchOutlined style={{ fontSize: 15 }} />Search Account No or Meter No</span>}>
                <Input.Group compact style={{ display: 'flex' }}>
                  <Input style={{ flex: 1 }} placeholder="Enter Account or Meter Number" />
                  <Button type="primary">Search</Button>
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Name"
                label={<span style={labelStyle}>Name</span>}
                rules={[{ required: true, message: 'Name is required' }, { pattern: /^[A-Za-z\s]+$/, message: 'Name must contain only letters' }]}
                hasFeedback
              >
                <Input onKeyPress={(e) => { if (!/[A-Za-z\s]/.test(e.key)) e.preventDefault(); }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="Number"
                label={<span style={labelStyle}>Contact No.</span>}
                rules={[
                  { required: true, message: 'Contact number is required' },
                  { pattern: /^\d{11}$/, message: 'Enter a valid 11-digit number' },
                ]}
                hasFeedback
              >
                <Input maxLength={11} onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            <Text style={{ fontSize: 18 }} strong>Leak Information</Text>
          </Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="typeId"
                label={<span style={labelStyle}>Leak Type</span>}
                rules={[{ required: true, message: 'Please select leak type' }]}
                hasFeedback
              >
                <Select placeholder="-SELECT-">
                  <Option value="1">Service Line</Option>
                  <Option value="2">Main Line</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="leakPressure"
                label={<span style={labelStyle}>Leak Pressure</span>}
                rules={[{ required: true, message: 'Please select leak pressure' }]}
                hasFeedback
              >
                <Select placeholder="-SELECT-">
                  <Option value="1">High</Option>
                  <Option value="2">Low</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="visibility"
                label={<span style={labelStyle}>Visibility</span>}
                rules={[{ required: true, message: 'Please select visibility' }]}
                hasFeedback
              >
                <Select placeholder="-SELECT-">
                  <Option value="1">Exposed Leak</Option>
                  <Option value="2">Underground Leak</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="address"
                label={<span style={labelStyle}>Address</span>}
                rules={[{ required: true, message: 'Address is required' }, { pattern: /^[A-Za-z0-9\s.,-]+$/, message: 'Address contains invalid characters' }]}
                hasFeedback
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="Landmark"
                label={<span style={labelStyle}>Landmark</span>}
                rules={[{ required: true, message: 'Landmark is required' }, { pattern: /^[A-Za-z\s]+$/, message: 'Landmark must contain only letters' }]}
                hasFeedback
              >
                <Input onKeyPress={(e) => { if (!/[A-Za-z\s]/.test(e.key)) e.preventDefault(); }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="NearestMeter"
                label={<span style={labelStyle}>Nearest Meter</span>}
                rules={[{ required: true, message: 'Nearest Meter is required' }, { pattern: /^[a-zA-Z0-9]+$/, }
                ]}
                hasFeedback
              >
                <Input onKeyPress={(e) => { if (!/[a-zA-Z0-9]/.test(e.key)) e.preventDefault(); }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="Remarks" label={<span style={labelStyle}>Remarks</span>}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">
            <Text style={{ fontSize: 18 }} strong>Search Address</Text>
          </Divider>

          <Form.Item label={<span style={labelStyle}>Search</span>}>
            <Input placeholder="e.g., Matina, Davao City, Davao del Sur" addonAfter={<EnvironmentOutlined />} />
          </Form.Item>

          <div style={{ height: 400, border: '1px solid #ccc', marginBottom: 24 }}>
            <MapComponent lat={lat} lng={lng} onMapClick={handleMapClick} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button danger>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Submit</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ReportALeak;
