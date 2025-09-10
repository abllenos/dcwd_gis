import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Form,
  Input,
  Button,
  Select,
  Divider,
  Typography,
  message,
  Space,
  Card,
} from 'antd';
import { SearchOutlined, DiffOutlined, ExceptionOutlined } from '@ant-design/icons';
import CustomModal from '../Modals/CustomModal';
import { waterSupplyConcernsStore } from '../../stores/waterSupplyConcernsStore';
import { useNavigate } from 'react-router-dom';
import '../../styles/theme.css';

const { Text } = Typography;
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

interface WaterSupplyConcernsProps {
  formType: 'water_quality' | 'low_pressure' | 'no_water_supply' | 'leak_report';
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

const formTypeToJMSCodeMap: Record<
  WaterSupplyConcernsProps['formType'],
  { value: string; label: string }
> = {
  water_quality: { value: '59', label: 'Water Quality' },
  low_pressure: { value: '58', label: 'Low Pressure' },
  no_water_supply: { value: '60', label: 'No Water Supply' },
  leak_report: { value: '57', label: 'Leak Report' },
};

const WaterSupplyConcerns: React.FC<WaterSupplyConcernsProps> = observer(({ 
  formType, 
  lat: propLat = 7.0722, 
  lng: propLng = 125.6131, 
  onMapClick: propOnMapClick,
  formRef,
  customerDetails = {}
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const showModal = (title: string, content: string, type: 'success' | 'error' | 'warning' = 'success') => {
    waterSupplyConcernsStore.showModal(title, content, type);
  };

  useEffect(() => {
    const token = localStorage.getItem('debug_token');
    if (!token) {
      message.error('Your session has expired. Please log in again.');
      return;
    }
  }, []);

  useEffect(() => {
    const jmsCode = formTypeToJMSCodeMap[formType]?.value;
    if (jmsCode) {
      waterSupplyConcernsStore.setFormValues({ jmsCode });
    }
  }, [formType]);

  useEffect(() => {
    if (propLat && propLng) {
      waterSupplyConcernsStore.setLocation(propLat, propLng);
      waterSupplyConcernsStore.fetchWscode(propLat, propLng);
      waterSupplyConcernsStore.fetchCaretaker(propLat, propLng);
    }
  }, [propLat, propLng]);

  const handleMapClick = (clickedLat: number, clickedLng: number) => {
    waterSupplyConcernsStore.setLocation(clickedLat, clickedLng);
    if (propOnMapClick) {
      propOnMapClick(clickedLat, clickedLng);
    }
  };

  const handleSubmit = async (values: any) => {
    const success = await waterSupplyConcernsStore.submitConcern(values);
    if (success) {
      form.resetFields();
    }
  };

  const handleSearchCustomer = async () => {
    const customerData = await waterSupplyConcernsStore.searchCustomer();
    if (customerData) {
      form.setFieldsValue(customerData);
    }
  };

  return (
    <>
      <Form 
        ref={formRef}
        layout="vertical" 
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={() => {
          message.error('Please complete all required fields before submitting.')
        }}
        onValuesChange={(changedValues, allValues) => {
          waterSupplyConcernsStore.setFormValues(allValues);
        }}
      >
        {/* Search Section */}
        <Form.Item
          label={
            <span style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 4 }}>
              <SearchOutlined style={{ fontSize: 15 }} />
              Search Account No or Meter No
            </span>
          }
        >
          <Space.Compact style={{ width: '100%' }}>
            <Input 
              style={{ flex: 1 }} 
              placeholder="Enter Account or Meter Number"
              value={waterSupplyConcernsStore.formValues.searchValue || ''}
              onChange={(e) => waterSupplyConcernsStore.setFormValues({ searchValue: e.target.value })}
              onPressEnter={handleSearchCustomer}
            />
            <Button 
              type="primary" 
              onClick={handleSearchCustomer}
              loading={waterSupplyConcernsStore.searchLoading}
            >
              Search
            </Button>
          </Space.Compact>
        </Form.Item>

        {/* Reporter Details Section */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <div style={{
            position: 'absolute',
            top: -12,
            left: 20,
            zIndex: 10,
            backgroundColor: '#6782f5',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 20,
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
              paddingTop: 12,
              padding: '32px 20px 20px 20px',
            }}

          >
          <Form.Item 
            name="reporterType" 
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
            <Input placeholder="Enter customer name" />
          </Form.Item>

          <Form.Item 
            name="Number" 
            label={<span style={labelStyle}>Contact No.</span>}
            rules={[
              {required: true, message: 'Enter Contact No.'}, 
              { pattern: /^\d{11}$/, message: 'Requires 11-digit number' }
            ]}
            style={{ marginBottom: 8 }}
          >
            <Input placeholder="Enter contact number" />
          </Form.Item>
        </Card>
        </div>

        {/* Report Details Section */}
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <div style={{
            position: 'absolute',
            top: -12,
            left: 20,
            zIndex: 10,
            backgroundColor: '#6782f5',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 20,
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
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              paddingTop: 12,
              padding: '32px 20px 20px 20px',
            }}
            
          >

        <Form.Item 
          name="nearestMeter"
          label={<span style={labelStyle}>Nearest Meter No.</span>}
          rules={[{required: true, message: 'Enter Nearest Meter No.'}]}
          style={{ marginBottom: 8 }}
        >
          <Input placeholder="Enter nearest meter number" />
        </Form.Item>

        <Form.Item 
          name="location"
          label={<span style={labelStyle}>Location</span>}
          rules={[{required: true, message: 'Enter Location'}]}
          style={{ marginBottom: 8 }}
        >
          <Input placeholder="Enter location" />
        </Form.Item>

        <Form.Item 
          name="remarks" 
          label={<span style={labelStyle}>Remarks</span>}
          rules={[{required: true, message: 'Enter Remarks'}]}
          style={{ marginBottom: 8 }}
        >
          <Input.TextArea rows={3} placeholder="Enter additional remarks" />
        </Form.Item>

          {/* Hidden fields */}
          <Form.Item 
            name="complaintType" 
            hidden
            initialValue={formTypeToJMSCodeMap[formType]?.label}
          >
            <Input type="hidden" />
          </Form.Item>
        </Card>
        </div>
      </Form>

      <CustomModal
        visible={waterSupplyConcernsStore.modalData.visible}
        title={waterSupplyConcernsStore.modalData.title}
        content={waterSupplyConcernsStore.modalData.content}
        type={waterSupplyConcernsStore.modalData.type}
        onClose={() => waterSupplyConcernsStore.closeModal()}
      />
    </>
  );
});

export default WaterSupplyConcerns;
