import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
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
  message,
} from 'antd';
import { SearchOutlined, HomeFilled } from '@ant-design/icons';
import CustomModal from '../Modals/CustomModal';
import { waterSupplyConcernsStore } from '../../stores/waterSupplyConcernsStore';
import { useNavigate } from 'react-router-dom';
import { Space } from 'antd';
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
}

const formTypeToJMSCodeMap: Record<
  WaterSupplyConcernsProps['formType'],
  { value: string; label: string }
> = {
  water_quality: { value: '59', label: 'Water Quality' },
  low_pressure: { value: '58', label: 'Low Pressure' },
  no_water_supply: { value: '57', label: 'Water Supply' },
  leak_report: { value: '4', label: 'Leak Report' },
};

const WaterSupplyConcerns: React.FC<WaterSupplyConcernsProps> = observer(({ formType }) => {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const handleHomeClick = () => navigate('/home');

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
    if (waterSupplyConcernsStore.lat !== null && waterSupplyConcernsStore.lng !== null) {
      waterSupplyConcernsStore.fetchWscode(waterSupplyConcernsStore.lat, waterSupplyConcernsStore.lng);
      waterSupplyConcernsStore.fetchCaretaker(waterSupplyConcernsStore.lat, waterSupplyConcernsStore.lng);
    }
  }, [waterSupplyConcernsStore.lat, waterSupplyConcernsStore.lng]);

  useEffect(() => {
    const jmsCode = formTypeToJMSCodeMap[formType]?.value;
    form.setFieldsValue({ jmsCode });
    waterSupplyConcernsStore.setFormValues({ jmsCode });
  }, [formType, form]);

  const handleMapClick = (clickedLat: number, clickedLng: number) => {
    waterSupplyConcernsStore.setLocation(clickedLat, clickedLng);
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
    <div style={{ padding: "4px 24px 24px 24px", backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
        <Button 
          icon={<HomeFilled />} 
          onClick={handleHomeClick} 
          type="text" 
          style={{ 
            fontSize: 16, 
            color: "var(--btn-primary-color)",
            backgroundColor: 'transparent'
          }} 
          shape="circle" 
        />
        <Breadcrumb
          style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}
          items={[
            { title: "Create A Report"},
            { title: "Water Supply Concerns"}
          ]}
        />

        </div>
      </div>
      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          padding: 24,
          borderRadius: 8,
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <Row gutter={24}>
          <Col span={10}>
            <Form 
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
              <Divider orientation="left">
                <Text style={{ fontSize: 18, color: 'var(--text-primary)' }} strong>
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

              <Form.Item 
                name="Name"
                label={<span style={labelStyle}>Name</span>}
                rules={[{required: true, message: 'Enter Name'}]}
              >
                <Input placeholder="Enter customer name" />
              </Form.Item>

              <Form.Item 
                name="nearestMeter"
                label={<span style={labelStyle}>Nearest Meter</span>}
                rules={[{required: true, message: 'Enter Nearest Meter'}]}
              >
                <Input placeholder="Enter nearest meter" />
              </Form.Item>

              <Form.Item 
                name="location"
                label={<span style={labelStyle}>Location</span>}
                rules={[{required: true, message: 'Enter Location'}]}
              >
                <Input placeholder="Enter location" />
              </Form.Item>

              <Form.Item 
                name="landmark"
                label={<span style={labelStyle}>Landmark</span>}
              >
                <Input placeholder="Enter landmark (optional)" />
              </Form.Item>

              <Form.Item 
                name="Number"
                label={<span style={labelStyle}>Contact No.</span>}
                rules={[
                  {required: true, message: 'Enter Contact No.'}, 
                  { pattern: /^\d{11}$/, message: 'Requires 11-digit number' }
                ]}
              >
                <Input placeholder="Enter contact number" />
              </Form.Item>

              <Form.Item 
                name="reportertype"
                label={<span style={labelStyle}>Reporter Type</span>}
                rules={[{required: true, message: 'Select Reporter Type'}]}
              >
                <Select placeholder="-SELECT-">
                  <Option value="1">Account Holder</Option>
                  <Option value="2">Non Account Holder</Option>
                </Select>
              </Form.Item>

              <Divider orientation="left">
                <Text style={{ fontSize: 18, color: 'var(--text-primary)' }} strong>
                  Complaint Details
                </Text>
              </Divider>

              <Form.Item name="jmsCode" hidden>
                <Input type='hidden' />
              </Form.Item>

              <Form.Item 
                name="remarks" 
                label={<span style={labelStyle}>Remarks</span>}
                rules={[{required: true, message: 'Enter Remarks'}]}
              >
                <Input.TextArea rows={3} placeholder="Enter additional remarks" />
              </Form.Item>
            </Form>
          </Col>

          <Col span={14}>
            <Divider orientation="left">
              <Text style={{ fontSize: 18, color: 'var(--text-primary)' }} strong>
                Search Address
              </Text>
            </Divider>

            <Form.Item>
              <Input 
                placeholder="e.g., Matina, Davao City, Davao del Sur"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </Form.Item>

            <div style={{ height: 613, border: "1px solid var(--border-color)", borderRadius: 6 }}>
              <MapComponent 
                lat={waterSupplyConcernsStore.lat} 
                lng={waterSupplyConcernsStore.lng} 
                onMapClick={handleMapClick} 
              />
            </div>

            <div style={{width: '100%', display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <Button 
                danger
                onClick={() => { 
                  form.resetFields();
                  waterSupplyConcernsStore.resetForm();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={waterSupplyConcernsStore.loading}
                onClick={() => form.submit()}
              >
                Submit
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* Success/Error Modal */}
      <CustomModal
        visible={waterSupplyConcernsStore.modalData.visible}
        title={waterSupplyConcernsStore.modalData.title}
        content={waterSupplyConcernsStore.modalData.content}
        type={waterSupplyConcernsStore.modalData.type}
        onClose={() => waterSupplyConcernsStore.closeModal()}
      />
    </div>
  );
});

export default WaterSupplyConcerns;
