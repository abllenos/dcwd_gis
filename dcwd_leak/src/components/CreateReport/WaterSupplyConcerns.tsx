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
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  textTransform: 'uppercase' as const,
  fontSize: 12,
  fontFamily: 'Arial, sans-serif',
};

const WaterSupplyConcerns: React.FC = () => {
    const [form] = Form.useForm();
    const [lat, setLat] = useState<number>(7.0722);
    const [lng, setLng] = useState<number>(125.6131);
    const [wscode, setWscode] = useState<string>('');
    const [CT_ID, setCaretaker] = useState<string>('');
    
    useEffect(() => {
      if (lat !== null && lng !== null) {
        fetchWscode(lat, lng);
        fetchCaretaker(lat, lng);
      }
      console.log('WSCODE:', wscode);
      console.log('Caretaker:', CT_ID);
    }, [lat, lng, wscode, CT_ID]);
  
  
    const fetchWscode = async (lat: number, lng: number) => {
    try {
        const response = await fetch(`https://api-gis.davao-water.gov.ph/helpers/leaksys/getWSS.php?lat=${lat}&lng=${lng}`);
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setWscode(data.data[0].wscode);
        } else {
          console.warn('No wscode found in response:', data);
        }
      } catch (error) {
        console.error('Error fetching wscode: ', error);
      }
    };
  
    const fetchCaretaker = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://api-gis.davao-water.gov.ph/helpers/leaksys/getCaretaker.php?lat=${lat}&lng=${lng}`);
      const data = await response.json();
      
      if (data && data.CT_ID) {
        setCaretaker(data.CT_ID);
      } else if (Array.isArray(data.data) && data.data[0]?.CT_ID) {
        setCaretaker(data.data[0].CT_ID);
      }
    } catch (error) {
      console.error('Error fetching caretaker: ', error);
    }
  };
  
    const handleMapClick = (clickedLat: number, clickedLng: number) => {
      setLat(clickedLat);
      setLng(clickedLng);
    };
  return (
    <div style={{ padding: '4px 24px 24px 24px' }}>
      <Breadcrumb style={{ marginBottom: 30, fontSize: 16, fontWeight: 500 }}>
        <Breadcrumb.Item>Create A Report</Breadcrumb.Item>
        <Breadcrumb.Item>Water Supply Concerns</Breadcrumb.Item>
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
          {/* Contact Info */}
          <Divider orientation="left">
            <Text style={{ fontSize: 18 }} strong>Contact Information</Text>
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
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>Name</span>}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>Nearest Meter</span>}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>Location</span>}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>Contact No.</span>}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* Complaint Info */}
          <Divider orientation="left">
            <Text style={{ fontSize: 18 }} strong>Complaint Details</Text>
          </Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>JMS Code</span>}>
                <Select placeholder="-SELECT-">
                  <Option value="nowater">No Water</Option>
                  <Option value="lowpressure">Low Pressure</Option>
                  <Option value="waterquality">Water Quality Complaints</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>Complaint Details</span>}>
                <Select placeholder="-SELECT-" />
              </Form.Item>
            </Col>
          </Row>

          {/* Address Search */}
          <Divider orientation="left">
            <Text style={{ fontSize: 18 }} strong>Search Address</Text>
          </Divider>

          <Form.Item label={<span style={labelStyle}>Search</span>}>
            <Input placeholder="e.g., Matina, Davao City, Davao del Sur" />
          </Form.Item>

          <div style={{ height: 400, border: '1px solid #ccc', marginBottom: 24 }}>
            <MapComponent lat={lat} lng={lng} onMapClick={handleMapClick} />
          </div>

          <Row gutter={16}>
            <Col span={12}><Form.Item label={<span style={labelStyle}>Latitude</span>}><Input value={lat?.toFixed(6) || ''} readOnly /></Form.Item></Col>
            <Col span={12}><Form.Item label={<span style={labelStyle}>Longitude</span>}><Input value={lng?.toFixed(6) || ''} readOnly /></Form.Item></Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button danger>Cancel</Button>
            <Button type="primary">Submit</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default WaterSupplyConcerns;
