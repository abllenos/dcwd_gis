import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  message,
  Card,
} from 'antd';
import { DiffOutlined, ExceptionOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import CustomModal from '../Modals/CustomModal';
import { reportALeakStore, type ReportType, type CustomerDetails } from '../../stores/reportALeakStore';

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
  customerDetails?: CustomerDetails;
  onReportTypeChange?: (value: ReportType) => void;
  selectedReportType?: ReportType;
}

const ReportALeak: React.FC<ReportALeakProps> = observer(({ 
  lat: propLat = 7.0722, 
  lng: propLng = 125.6131, 
  onMapClick: propOnMapClick,
  formRef,
  customerDetails = {},
  onReportTypeChange,
  selectedReportType = 'leak_report'
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Initialize store location with props
  useEffect(() => {
    reportALeakStore.setLocation(propLat, propLng);
  }, [propLat, propLng]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Your session has expired. Please log in again.');
      navigate('/login');
    }
  }, [navigate]);

  // Reset form when report type changes
  useEffect(() => {
    form.resetFields();
    reportALeakStore.resetForm();
  }, [selectedReportType, form]);

  // Update form fields when customer details change
  useEffect(() => {
    if (customerDetails && Object.keys(customerDetails).length > 0) {
      reportALeakStore.setCustomerDetails(customerDetails);
      
      form.setFieldsValue({
        address: reportALeakStore.formValues.address || '',
        ReferenceMeter: reportALeakStore.formValues.ReferenceMeter || '',
        refAccNo: reportALeakStore.formValues.refAccNo || '',
      });
    }
  }, [customerDetails, form]);

  const handleMapClick = React.useCallback((clickedLat: number, clickedLng: number) => {
    reportALeakStore.setLocation(clickedLat, clickedLng);
    if (propOnMapClick) {
      propOnMapClick(clickedLat, clickedLng);
    }
  }, [propOnMapClick]);


  const handleSubmit = async (values: any) => {
    await reportALeakStore.submitReport(values, navigate);
    if (reportALeakStore.modalData.type === 'success') {
      form.resetFields();
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
          reportALeakStore.setFormValues(allValues);
        }}
      >
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="reportType" 
                label={<span style={labelStyle}>MO Type:</span>} 
                rules={[{ required: true, message: 'Select MO Type' }]}
                style={{ marginBottom: 8 }}
                initialValue={selectedReportType}
              >
                <Select 
                  placeholder="- - Select MO Type - -" 
                  value={selectedReportType}
                  onChange={(value) => {
                    reportALeakStore.setReportType(value);
                    onReportTypeChange?.(value);
                  }}
                  style={{ 
                    borderColor: '#ff4d4f',
                    boxShadow: '0 0 0 2px rgba(244, 9, 12, 0.61)',
                    borderRadius: 8,
                  }}
                >
                  <Option value="leak_report">Report A Leak</Option>
                  <Option value="no_water_supply">No Water Supply</Option>
                  <Option value="low_pressure">Low Pressure</Option>
                  <Option value="water_quality">Water Quality</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="reportertype" 
                label={<span style={labelStyle}>Account Type:</span>} 
                rules={[{ required: true, message: 'Select Acccount Type' }]}
                style={{ marginBottom: 8 }}
              >
                <Select placeholder="- SELECT -">
                  <Option value="1">Account Holder</Option>
                  <Option value="2">Non Account Holder</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="Name" 
                label={<span style={labelStyle}>Name:</span>} 
                rules={[{ required: true, message: 'Enter Name' }]}
                style={{ marginBottom: 8 }}
              >
                <Input placeholder="Enter customer name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="Number" 
                label={<span style={labelStyle}>Contact No.:</span>} 
                rules={[
                  { required: true, message: 'Enter Contact No.' }, 
                  { pattern: /^\d{11}$/, message: 'Requires 11-digit number' }
                ]}
                style={{ marginBottom: 8 }}
              >
                <Input placeholder="Enter contact number" />
              </Form.Item>
            </Col>
          </Row>
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

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="ReferenceMeter" 
              label={<span style={labelStyle}>Reference Meter:</span>} 
              rules={[{ required: true, message: 'Enter Reference Meter' }]}
              style={{ marginBottom: 8 }}
            >
              <Input placeholder="Enter reference meter number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="Landmark" 
              label={<span style={labelStyle}>Landmark:</span>} 
              rules={[{ required: true, message: 'Enter Landmark' }]}
              style={{ marginBottom: 8 }}
            >
              <Input placeholder="Enter landmark" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="typeId" 
              label={<span style={labelStyle}>Leak Type:</span>} 
              rules={[{ required: true, message: 'Select Leak Type' }]}
              style={{ marginBottom: 8 }}
            >
              <Select placeholder="- SELECT -">
                <Option value="37">Unidentified</Option>
                <Option value="38">Serviceline</Option>
                <Option value="39">Mainline</Option>
                <Option value="40">Others</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="leakPressure" 
              label={<span style={labelStyle}>Leak Pressure:</span>} 
              rules={[{ required: true, message: 'Select Leak Pressure' }]}
              style={{ marginBottom: 8 }}
            >
              <Select placeholder="- SELECT -">
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
              label={<span style={labelStyle}>Visibility:</span>} 
              rules={[{ required: true, message: 'Select Visibility' }]}
              style={{ marginBottom: 8 }}
            >
              <Select placeholder="- SELECT -">
                <Option value="1">Surface</Option>
                <Option value="2">Non-Surface</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="coverings" 
              label={<span style={labelStyle}>Coverings:</span>} 
              rules={[{ required: true, message: 'Select Coverings' }]}
              style={{ marginBottom: 8 }}
            >
              <Select placeholder="- SELECT -">
                <Option value="1">Concrete</Option>
                <Option value="2">Asphalt</Option>
                <Option value="3">Soil</Option>
                <Option value="4">Gravel</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {!reportALeakStore.isCustomerSearched && (
            <Col span={12}>
              <Form.Item 
                name="address" 
                label={<span style={labelStyle}>Address:</span>} 
                rules={[{ required: !reportALeakStore.isCustomerSearched, message: 'Enter Address' }]}
                style={{ marginBottom: 8 }}
              >
                <Input placeholder="Enter address" />
              </Form.Item>
            </Col>
          )}
          <Col span={reportALeakStore.isCustomerSearched ? 24 : 12}>
            <Form.Item 
              name="Remarks" 
              label={<span style={labelStyle}>Remarks:</span>} 
              rules={[{ required: true, message: 'Enter Remarks' }]}
              style={{ marginBottom: 8 }}
            >
              <Input.TextArea rows={3} placeholder="Enter additional remarks" />
            </Form.Item>
          </Col>
        </Row>

        {/* Hidden fields */}
        <Form.Item name="refAccNo" hidden>
          <Input type="hidden" />
        </Form.Item>
        </Card>
        </div>
      </Form>

      <CustomModal
        visible={reportALeakStore.modalData.visible}
        title={reportALeakStore.modalData.title}
        content={reportALeakStore.modalData.content}
        type={reportALeakStore.modalData.type}
        onClose={() => reportALeakStore.hideModal()}
      />
    </>
  );
});

export default ReportALeak;
