import React, { useState } from 'react';
import {
  Select,
  Typography,
  Breadcrumb,
  Button,
  Row,
  Col,
  Divider,
  Form,
  Input,
} from 'antd';
import { HomeFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReportALeak from './ReportALeak';
import WaterSupplyConcerns from './WaterSupplyConcerns';
import CustomerAccountDetails from './CustomerAccountDetails';
import MapComponent from '../Endpoints/MapView';
import '../../styles/theme.css';

const { Text } = Typography;
const { Option } = Select;

type ReportType = 'leak_report' | 'no_water_supply' | 'low_pressure' | 'water_quality' | undefined;

const CreateReport: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('leak_report');
  const [lat, setLat] = useState(7.0722);
  const [lng, setLng] = useState(125.6131);
  const [customerDetails, setCustomerDetails] = useState<{
    accountNumber?: string;
    meterNumber?: string;
    customerName?: string;
    address?: string;
    connectionType?: string;
    districtMeteringArea?: string;
  }>({});
  const formRef = React.useRef<any>(null);
  const navigate = useNavigate();

  const handleCustomerFound = (details: typeof customerDetails, lat?: number, lng?: number) => {
    setCustomerDetails(details);
    if (lat !== undefined && lng !== undefined) {
      setLat(lat);
      setLng(lng);
    }
  };

  const handleCustomerNotFound = () => {
    setCustomerDetails({});
    setLat(7.0722);
    setLng(125.6131);
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleReportTypeChange = (value: ReportType) => {
    setSelectedReportType(value);
  };

  const handleMapClick = React.useCallback((clickedLat: number, clickedLng: number) => {
    setLat(clickedLat);
    setLng(clickedLng);
  }, []);

  const getBreadcrumbTitle = () => {
    const typeLabels = {
      leak_report: 'Report A Leak',
      no_water_supply: 'No Water Supply',
      low_pressure: 'Low Pressure',
      water_quality: 'Water Quality',
    };
    
    return selectedReportType ? typeLabels[selectedReportType] : 'Create A Report';
  };

  return (
    <div style={{ padding: '4px 24px 24px 24px', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button 
            icon={<HomeFilled />} 
            onClick={handleHomeClick} 
            type="text" 
            style={{ fontSize: 16, color: "#00008B" }} 
            shape="circle" 
          />
          <Breadcrumb
            style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}
            items={[
              { title: "Create A Report" },
              { title: getBreadcrumbTitle() }
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
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Row gutter={24} style={{ flex: 1, display: 'flex' }}>
          <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
            <Divider orientation="center">
              <Text style={{ fontSize: 18, color: 'var(--text-primary)' }} strong>
                Report Information
              </Text>
            </Divider>

            <CustomerAccountDetails
              customerDetails={customerDetails}
              onCustomerFound={handleCustomerFound}
              onCustomerNotFound={handleCustomerNotFound}
            />

            {selectedReportType === 'leak_report' ? (
              <ReportALeak 
                lat={lat} 
                lng={lng} 
                onMapClick={handleMapClick} 
                formRef={formRef}
                customerDetails={customerDetails}
                onReportTypeChange={handleReportTypeChange}
                selectedReportType={selectedReportType}
              />
            ) : (
              <WaterSupplyConcerns 
                formType={selectedReportType || 'no_water_supply'} 
                lat={lat} 
                lng={lng} 
                onMapClick={handleMapClick} 
                formRef={formRef}
                customerDetails={customerDetails}
                onReportTypeChange={handleReportTypeChange}
                selectedReportType={selectedReportType}
              />
            )}
          </Col>

          <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
            <Divider orientation="left">
              <Text style={{ fontSize: 18, color: 'var(--text-primary)' }} strong>
                Search Address
              </Text>
            </Divider>
            
            <Form.Item style={{ marginBottom: 20 }}>
              <Input
                placeholder="e.g., Matina, Davao City, Davao del Sur"
                style={{ 
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </Form.Item>

            <div style={{ 
              flex: 1, 
              minHeight: 400,
              border: "1px solid var(--border-color)", 
              borderRadius: 6, 
              marginBottom: 24,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <MapComponent 
                onMapClick={handleMapClick} 
                lat={lat} 
                lng={lng} 
              />
            </div>
          </Col>
        </Row>

        {/* Action Buttons - Always at bottom */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 8, 
          marginTop: 24,
          paddingTop: 16,
          borderTop: '1px solid var(--border-color)'
        }}>
          <Button 
            danger 
            onClick={() => {
              // Reset form and clear all state
              if (formRef.current) {
                formRef.current.resetFields();
              }
              setSelectedReportType('leak_report');
              setCustomerDetails({});
              setLat(7.0722);
              setLng(125.6131);
            }}
            size="large"
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            size="large"
            onClick={() => {
              // Trigger form submission
              if (formRef.current) {
                formRef.current.submit();
              }
            }}
          >
            Submit
          </Button>
        </div>
      </div>

    </div>
  );
};

export default CreateReport;
