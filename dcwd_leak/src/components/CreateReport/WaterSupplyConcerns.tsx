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

const { Text } = Typography;
const { Option } = Select;

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  textTransform: 'uppercase' as const,
  fontSize: 12,
  fontFamily: 'Arial, sans-serif',
};

interface WaterSupplyConcernsProps {
  formType: 'no_water' | 'low_pressure' | 'no_water_supply' | 'leak_report';
}

const formTypeToJMSCodeMap: Record<
  WaterSupplyConcernsProps['formType'],
  { value: string; label: string }
> = {
  no_water: { value: '1', label: 'No Water' },
  low_pressure: { value: '2', label: 'Low Pressure' },
  no_water_supply: { value: '3', label: 'Water Quality Complaints' },
  leak_report: { value: '4', label: 'Leak Report' },
};

const WaterSupplyConcerns: React.FC<WaterSupplyConcernsProps> = ({ formType }) => {
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
  }, [lat, lng]);

  useEffect(() => {

    const jmsCode = formTypeToJMSCodeMap[formType]?.value;
    form.setFieldsValue({ jmsCode });
  }, [formType, form]);

  const fetchWscode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api-gis.davao-water.gov.ph/helpers/leaksys/getWSS.php?lat=${lat}&lng=${lng}`
      );
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
      const response = await fetch(
        `https://api-gis.davao-water.gov.ph/helpers/leaksys/getCaretaker.php?lat=${lat}&lng=${lng}`
      );
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
    <div style={{ padding: "4px 24px 24px 24px" }}>
      <Breadcrumb style={{ marginBottom: 30, fontSize: 16, fontWeight: 500 }}>
        <Breadcrumb.Item>Create A Report</Breadcrumb.Item>
        <Breadcrumb.Item>Water Supply Concerns</Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Row gutter={24}>
          <Col span={10}>
            <Form layout="vertical" form={form}>
              <Divider orientation="left">
                <Text style={{ fontSize: 18 }} strong>
                  Contact Information
                </Text>
              </Divider>

              <Form.Item
                label={
                  <span style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 4 }}>
                    <SearchOutlined style={{ fontSize: 15 }} />
                    Search Account No or Meter No
                  </span>
                }
              >
                <Input.Group compact style={{ display: "flex" }}>
                  <Input style={{ flex: 1 }} placeholder="Enter Account or Meter Number" />
                  <Button type="primary">Search</Button>
                </Input.Group>
              </Form.Item>

              <Form.Item label={<span style={labelStyle}>Name</span>}>
                <Input />
              </Form.Item>

              <Form.Item label={<span style={labelStyle}>Nearest Meter</span>}>
                <Input />
              </Form.Item>

              <Form.Item label={<span style={labelStyle}>Location</span>}>
                <Input />
              </Form.Item>

              <Form.Item label={<span style={labelStyle}>Contact No.</span>}>
                <Input />
              </Form.Item>

              <Divider orientation="left">
                <Text style={{ fontSize: 18 }} strong>
                  Complaint Details
                </Text>
              </Divider>

              <Form.Item name="jmsCode" hidden>
                <Input />
              </Form.Item>

              <div style={{ marginBottom: 13 }}>
                <span style={labelStyle}>JMS Code</span>
                <div
                  style={{
                    padding: "6px 11px",
                    border: "1px solid #d9d9d9",
                    borderRadius: 4,
                    marginTop: 8,
                  }}
                >
                  {formTypeToJMSCodeMap[formType]?.label || "N/A"}
                </div>
              </div>

              <Form.Item name="Remarks" label={<span style={labelStyle}>Remarks</span>}>
                <Input.TextArea rows={3} />
              </Form.Item>
            </Form>
          </Col>

          <Col span={14}>
            <Divider orientation="left">
              <Text style={{ fontSize: 18 }} strong>
                Search Address
              </Text>
            </Divider>

            <Form.Item>
              <Input placeholder="e.g., Matina, Davao City, Davao del Sur" />
            </Form.Item>

            <div style={{ height: 613, border: "1px solid #ccc", borderRadius: 6 }}>
              <MapComponent lat={lat} lng={lng} onMapClick={handleMapClick} />
            </div>

            <div style={{width: '100%', display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <Button danger>Cancel</Button>
              <Button type="primary">Submit</Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default WaterSupplyConcerns;
