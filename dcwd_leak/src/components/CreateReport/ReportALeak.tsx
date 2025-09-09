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
  message,
  Space,
  Card,
} from 'antd';
import { DiffOutlined, ExceptionOutlined } from '@ant-design/icons';
import { devApi } from '../Endpoints/Interceptor';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../Modals/CustomModal';


const { Text } = Typography
const { Option } = Select;

message.config({
  top: 0,     
  duration: 3,  
  maxCount: 3,  
});

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  textTransform: 'uppercase' as const,
  fontSize: 12,
  fontFamily: 'Montserrat, sans-serif',
  color: 'var(--text-primary)',
};

interface ReportALeakProps {
  lat?: number;
  lng?: number;
  onMapClick?: (lat: number, lng: number) => void;
  formRef?: React.RefObject<any>;
  customerDetails?: {
    accountNumber?: string;
    meterNumber?: string;
    customerName?: string;
    address?: string;
    connectionType?: string;
    districtMeteringArea?: string;
  };
}

const ReportALeak: React.FC<ReportALeakProps> = ({ 
  lat: propLat = 7.0722, 
  lng: propLng = 125.6131, 
  onMapClick: propOnMapClick,
  formRef,
  customerDetails = {}
}) => {
  const [form] = Form.useForm();
  const [lat, setLat] = useState(propLat);
  const [lng, setLng] = useState(propLng);
  const [wscode, setWscode] = useState<string>('');
  const [CT_ID, setCaretaker] = useState<string>('');
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<{ address?: string; NearestMeter?: string; refAccNo?: string }>({});
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Your session has expired. Please log in again.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (lat !== null && lng !== null) {
      fetchWscode(lat, lng);
      fetchCaretaker(lat, lng);
    }
  }, [lat, lng]);

  // Update form fields when customer details change
  useEffect(() => {
    if (customerDetails && Object.keys(customerDetails).length > 0) {
      const accountNumber = customerDetails.accountNumber || '';
      const RefAccAddress = accountNumber.match(/-(.*?)-/)?.[1] || '';
      const trimmedRefAccNo = RefAccAddress.substring(0, 6);

      form.setFieldsValue({
        address: customerDetails.address || '',
        NearestMeter: customerDetails.meterNumber || '',
        refAccNo: trimmedRefAccNo,
      });

      setFormValues({
        address: customerDetails.address || '',
        NearestMeter: customerDetails.meterNumber || '',
        refAccNo: trimmedRefAccNo,
      });
    }
  }, [customerDetails, form]);

  const fetchWscode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api-gis.davao-water.gov.ph/helpers/leaksys/getWSS.php?lat=${lat}&lng=${lng}`
      );
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        setWscode(data.data[0].wscode);
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
      if (data?.CT_ID) {
        setCaretaker(data.CT_ID);
      } else if (Array.isArray(data.data) && data.data[0]?.CT_ID) {
        setCaretaker(data.data[0].CT_ID);
      }
    } catch (error) {
      console.error('Error fetching caretaker: ', error);
    }
  };

  const handleMapClick = React.useCallback((clickedLat: number, clickedLng: number) => {
    setLat(clickedLat);
    setLng(clickedLng);
    if (propOnMapClick) {
      propOnMapClick(clickedLat, clickedLng);
    }
  }, [propOnMapClick]);

  const [modalData, setModalData] = useState({
    visible: false,
    title: '',
    content: '',
    type: 'success' as 'success' | 'error' | 'warning'
  });
  
  const showModal = (title: string, content: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setModalData({visible:true, title, content, type});
  };


  const handleSubmit = async (values: any) => {
    const token = localStorage.getItem('debug_token');
    if (!token) {
      showModal('Session Expired', 'Your session has expired. Please log in again.');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('ReporterName', values.Name || '');
    formData.append('ReportedNumber', values.Number || '');
    formData.append('ReferenceMtr', values.NearestMeter || '');
    formData.append('ReferenceRecaddrs', values.refAccNo || '');
    formData.append('ReportedLandmark', values.Landmark || '');
    formData.append('LeakPressure', values.leakPressure || '');
    formData.append('LeakIndicator', values.visibility || '');
    formData.append('ReportType', values.typeId || '');
    formData.append('SpoolID', '0');
    formData.append('Latitude', lat.toString());
    formData.append('Longitude', lng.toString());
    formData.append('Geom',  `${lng}, ${lat}`);
    formData.append('Remarks', values.Remarks || '');
    formData.append('ReporterType', values.reportertype || '');
    formData.append('CtCode', CT_ID || '');
    formData.append('WsCode', wscode || '');
    formData.append('DtReported', new Date().toISOString());
    formData.append('refAccNo', (values.refAccNo || '').substring(0, 6));
    formData.append('DispatchStat', '1');
    formData.append('flgLeakDetection', '0')

    if (fileList.length) {
      fileList.forEach((file) => {
        formData.append('Images', file.originFileObj);
      });
    }

    try {
      setLoading(true);
      await devApi.post(
        "dcwd-gis/api/v1/admin/LeakReport/SaveReport",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      showModal('Success','Leak report submitted successfully', 'success');
      form.resetFields();
      setFileList([]);
      
    } catch (error: any) {
      if (error.response?.status === 401) {
        showModal('Unauthorized', 'Unauthorized. Please log in again.', 'error');
        navigate('/login');
      } else {
        showModal('Submission Failed', 'Failed to submit leak report.', 'error');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <Form
        ref={formRef}
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFinishFailed={() => {
          message.error('Please complete all required fields before submitting.')
        }}  
        onValuesChange={(changedValues, allValues) => {
          setFormValues(allValues);
        }}
      >
        {/* Search Section */}
        {/* Reporter Details Section */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <div style={{
            position: 'absolute',
            top: -14,
            left: 20,
            zIndex: 10,
            backgroundColor: '#6782f5',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <DiffOutlined /> Reporter Details
          </div>
          <Card 
            style={{ 
              backgroundColor: '#fff',
              borderColor: '#d9d9d9',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              paddingTop: 12
            }}
          >
          <Form.Item 
            name="reportertype" 
            label={<span style={labelStyle}>Reporter Type</span>} 
            rules={[{required: true, message: 'Select Reporter Type'}]}
            style={{ marginBottom: 8 }}
          >
            <Select placeholder="-SELECT-">
              <Option value="1">Account Holder</Option>
              <Option value="2">Non Account Holder</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="Name" 
            label={<span style={labelStyle}>Name</span>} 
            rules={[{required: true, message: 'Enter Name'}]}
            style={{ marginBottom: 8 }}
          >
            <Input />
          </Form.Item>

          <Form.Item 
            name="Number" 
            label={<span style={labelStyle}>Contact No.</span>} 
            rules={[{required: true, message: 'Enter Contact No.'}, { pattern: /^\d{11}$/, message: 'Requires 11-digit number' }]}
            style={{ marginBottom: 8 }}
          >
            <Input />
          </Form.Item>
        </Card>
        </div>

        {/* Report Details Section */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: -14,
            left: 20,
            zIndex: 10,
            backgroundColor: '#6782f5',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 5,
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <ExceptionOutlined /> Report Details
          </div>
          <Card 
            style={{ 
              backgroundColor: '#fff',
              borderColor: '#d9d9d9',
              borderRadius: 5,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              paddingTop: 12
            }}
          >

        <Row gutter={14}>
          <Col span={12}>
            <Form.Item 
              name="address" 
              label={<span style={labelStyle}>Address</span>} 
              rules={[{required: true, message: 'Enter Address'}]}
              style={{ marginBottom: 8 }}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="Landmark" 
              label={<span style={labelStyle}>Landmark</span>} 
              rules={[{required: true, message: 'Enter Landmark'}]}
              style={{ marginBottom: 8 }}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="typeId" 
              label={<span style={labelStyle}>Leak Type</span>} 
              rules={[{required: true, message: 'Enter Leak Type'}]}
              style={{ marginBottom: 8 }}
            >
              <Select placeholder="-SELECT-">
                <Option value="54">Service Line</Option>
                <Option value="55">Main Line</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="leakPressure" 
              label={<span style={labelStyle}>Leak Pressure</span>} 
              rules={[{required: true, message: 'Enter Leak Pressure'}]}
              style={{ marginBottom: 8 }}
            >
              <Select placeholder="-SELECT-">
                <Option value="1">High</Option>
                <Option value="2">Low</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="visibility" 
              label={<span style={labelStyle}>Visibility</span>} 
              rules={[{required: true, message: 'Enter Visibility'}]}
              style={{ marginBottom: 8 }}
            >
              <Select placeholder="-SELECT-">
                <Option value="1">Exposed Leak</Option>
                <Option value="2">Underground Leak</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="coverings" 
              label={<span style={labelStyle}>Coverings</span>} 
              rules={[{required: true, message: 'Enter Coverings'}]}
              style={{ marginBottom: 8 }}
            >
              <Select placeholder="-SELECT-">
                <Option value="1">Concrete</Option>
                <Option value="2">Asphalt</Option>
                <Option value="3">Soil</Option>
                <Option value="4">Gravel</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="leakIndicator" 
              label={<span style={labelStyle}>Leak Indicator</span>} 
              rules={[{required: true, message: 'Enter Leak Indicator'}]}
              style={{ marginBottom: 8 }}
            >
              <Select placeholder="-SELECT-">
                <Option value="1">Water Pooling</Option>
                <Option value="2">Wet Ground</Option>
                <Option value="3">Sound</Option>
                <Option value="4">Visual</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="NearestMeter" 
              label={<span style={labelStyle}>Nearest Meter</span>} 
              rules={[{required: true, message: 'Enter Nearest Meter'}]}
              style={{ marginBottom: 8 }}
            >
              <Input placeholder="Enter nearest meter number" />
            </Form.Item>
          </Col>
        </Row>

        {/* Remarks - Full width at bottom */}
        <Form.Item 
          name="Remarks" 
          label={<span style={labelStyle}>Remarks</span>} 
          rules={[{required: true, message: 'Enter Remarks'}]}
          style={{ marginBottom: 8 }}
        >
          <Input.TextArea rows={3} placeholder="Enter additional remarks" />
        </Form.Item>

          {/* Hidden fields */}
          <Form.Item name="refAccNo" hidden>
            <Input type='hidden' />
          </Form.Item>
        </Card>
        </div>
      </Form>

      <CustomModal
        visible={modalData.visible}
        title={modalData.title}
        content={modalData.content}
        type={modalData.type}
        onClose={() => setModalData(prev => ({ ...prev, visible: false }))}
      />
    </>
  );
};

export default ReportALeak;
