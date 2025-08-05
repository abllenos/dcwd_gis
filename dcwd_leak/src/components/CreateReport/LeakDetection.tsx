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
  InputNumber,
  Breadcrumb,
} from 'antd';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';
import { DatePicker} from 'antd';


const { Text } = Typography;
const { Option } = Select;

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  textTransform: 'uppercase' as const,
  fontSize: 12,
  fontFamily: 'Arial, sans-serif',
};

const LeakDetection: React.FC = () => {
  const [form] = Form.useForm();
  const [lat, setLat] = useState<number>(7.0722);
  const [lng, setLng] = useState<number>(125.6131);
  const [wscode, setWscode] = useState<string>('');
  const [CT_ID, setCaretaker] = useState<string>('');
  const [Name, setName] = useState<string>('');
  const [ContactNo, setContactNo] = useState<string>('');
  const [Address, setAddress] = useState<string>('');
  const [Landmark, setLandmark] = useState<string>('');
  const [NearestMeter, setNearestMeter] = useState<string>('');
  const [TypeID, setLeakType] = useState<string>('');
  const [LeakIndicator, setLeakIndicator] = useState<string>('');
  const [Covering, setCovering] = useState<string>('');
  const [NrlwLevel, setNRWLevel] = useState<number>(0.0);
  const [Dma, setDMA] = useState<string>('');
  const [Remarks, setRemarks] = useState<string>('');
  const [DateTime, setDateTime] = useState<Date>( new Date());
  
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
                <Input value={Name} onChange={(e) => setName(e.target.value)} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={labelStyle}>Contact #</span>}>
                <Input value={ContactNo} onChange ={(e) => setContactNo(e.target.value) }/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={labelStyle}>Address</span>}>
                <Input value={Address} onChange={(e) => setAddress(e.target.value)} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={labelStyle}>Landmark</span>}>
                <Input value={Landmark} onChange={(e)=> setLandmark(e.target.value)} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span style={labelStyle}>Nearest Meter</span>}>
                <Input value={NearestMeter} onChange={(e) => setNearestMeter(e.target.value)}/>
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
                  value={moment(DateTime)}
                  onChange={(value) => setDateTime(value?.toDate() ?? new Date())}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>Leak Type</span>}>
                <Select placeholder="-SELECT-" value={TypeID} onChange={(value) => setLeakType(value)}>
                  <Option value="1">UnIdentified</Option>
                  <Option value="2">Serviceline</Option>
                  <Option value="3">Mainline</Option>
                  <Option value="4">Others</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>Leak Indicator</span>}>
                <Select placeholder="-SELECT-" value={LeakIndicator} onChange={(value) => setLeakIndicator(value)}>
                  <Option value="1">Exposed/Surface</Option>
                  <Option value="2">Underground/Non-Surface</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>Covering</span>}>
                <Select placeholder="-SELECT-" value={Covering} onChange={(value) => setCovering(value)}>
                  <Option value="1">Concrete</Option>
                  <Option value="2">Gravel</Option>
                  <Option value="3">Soil</Option>
                  <Option value="4">Asphalt</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<span style={labelStyle}>NRW Level</span>}>
                <InputNumber<number>
                  min={0}
                  max={100}
                  step={0.01}
                  value={NrlwLevel} onChange={(value) => setNRWLevel(value ?? 0)}
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
                <Input value={Dma} onChange={(e) => setDMA(e.target.value)}/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<span style={labelStyle}>Remarks</span>}>
                <Input.TextArea 
                rows={3} 
                value={Remarks}
                onChange={(e) => setRemarks(e.target.value)}
                />
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

          <div style={{ height: 400, border: '1px solid #ccc', marginBottom: 24 }}>
             <MapComponent lat={lat} lng={lng} onMapClick={handleMapClick} />     
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
