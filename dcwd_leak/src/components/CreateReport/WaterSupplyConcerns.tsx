import React, { useState, useEffect } from 'react';
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


const { Text } = Typography;

message.config({
  top: 0,     
  duration: 3,  
  maxCount: 3,  
});

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  textTransform: 'uppercase' as const,
  fontSize: 12,
  fontFamily: 'Noto Sans, sans-serif',
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

const WaterSupplyConcerns: React.FC<WaterSupplyConcernsProps> = observer(({ formType }) => {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const handleHomeClick = () => navigate('/home');

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
    <div style={{ padding: "4px 24px 24px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
        <Button icon={<HomeFilled />} onClick={handleHomeClick} type="text" style={{ fontSize: 16, color: "#00008B" }} shape="circle" />
        <Breadcrumb style={{ fontSize: 16, fontWeight: 500 }}>
          <Breadcrumb.Item>Create A Report</Breadcrumb.Item>
          <Breadcrumb.Item>Water Supply Concerns</Breadcrumb.Item>
        </Breadcrumb>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
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
                </Input.Group>
              </Form.Item>

              <Form.Item 
                name="name"
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
                name="contactNumber"
                label={<span style={labelStyle}>Contact No.</span>}
                rules={[
                  {required: true, message: 'Enter Contact No.'}, 
                  { pattern: /^\d{11}$/, message: 'Requires 11-digit number' }
                ]}
              >
                <Input placeholder="Enter contact number" />
              </Form.Item>

              <Divider orientation="left">
                <Text style={{ fontSize: 18 }} strong>
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
              <Text style={{ fontSize: 18 }} strong>
                Search Address
              </Text>
            </Divider>

            <Form.Item>
              <Input placeholder="e.g., Matina, Davao City, Davao del Sur" />
            </Form.Item>

            <div style={{ height: 613, border: "1px solid #ccc", borderRadius: 6 }}>
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

      {/* Success/Error Modal (same as ReportALeak) */}
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
