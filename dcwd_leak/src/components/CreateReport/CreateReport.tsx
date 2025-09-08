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
import MapComponent from '../Endpoints/MapView';
import '../../styles/theme.css';

const { Text } = Typography;
const { Option } = Select;

type ReportType = 'leak_report' | 'no_water_supply' | 'low_pressure' | 'water_quality' | undefined;

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  textTransform: 'uppercase' as const,
  fontSize: 12,
  fontFamily: 'Montserrat, sans-serif',
  color: 'var(--text-primary)',
};

const CreateReport: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>(undefined);
  const [lat, setLat] = useState(7.0722);
  const [lng, setLng] = useState(125.6131);
  const formRef = React.useRef<any>(null);
  const navigate = useNavigate();

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

  const reportTypeOptions = [
    { value: 'leak_report', label: 'Report A Leak' },
    { value: 'no_water_supply', label: 'No Water Supply' },
    { value: 'low_pressure', label: 'Low Pressure' },
    { value: 'water_quality', label: 'Water Quality' },
  ];

  const renderFormContent = () => {
    if (!selectedReportType) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Text style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-secondary)' }}>
            Please select a report type to begin.
          </Text>
        </div>
      );
    }

    if (selectedReportType === 'leak_report') {
      return <ReportALeak lat={lat} lng={lng} onMapClick={handleMapClick} formRef={formRef} />;
    }

    // For water supply concerns (no_water_supply, low_pressure, water_quality)
    return <WaterSupplyConcerns formType={selectedReportType} lat={lat} lng={lng} onMapClick={handleMapClick} formRef={formRef} />;
  };

  const getBreadcrumbTitle = () => {
    const typeLabels = {
      leak_report: 'Report A Leak',
      no_water_supply: 'No Water Supply',
      low_pressure: 'Low Pressure',
      water_quality: 'Water Quality',
    };
    
    return selectedReportType ? typeLabels[selectedReportType] : 'Select Report Type';
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
        }}
      >
        <Row gutter={24}>
          <Col span={10}>
            {/* Report Type Selection */}
            <Divider orientation="left">
              <Text style={{ fontSize: 18, color: 'var(--text-primary)' }} strong>
                Report Type
              </Text>
            </Divider>
            
            <Form.Item
              style={{ marginBottom: 20 }}
            >
              <Select
                placeholder="- - Select Report Type - -"
                style={{ width: '100%' }}
                value={selectedReportType}
                onChange={handleReportTypeChange}
                size="large"
              >
                {reportTypeOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Form Content */}
            {renderFormContent()}
          </Col>

          <Col span={14}>
            {/* Map Component - only show when a report type is selected */}
            {selectedReportType && (
              <>
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

                <div style={{ height: 700, border: "1px solid var(--border-color)", borderRadius: 6, marginBottom: 24 }}>
                  <MapComponent 
                    onMapClick={handleMapClick} 
                    lat={lat} 
                    lng={lng} 
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <Button 
                    danger 
                    onClick={() => {
                      // Reset form and clear selection
                      if (formRef.current) {
                        formRef.current.resetFields();
                      }
                      setSelectedReportType(undefined);
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
              </>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CreateReport;
