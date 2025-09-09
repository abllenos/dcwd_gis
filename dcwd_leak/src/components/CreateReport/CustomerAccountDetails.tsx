import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Space,
  Card,
  Row,
  Col,
  Typography,
} from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { devApi } from '../Endpoints/Interceptor';
import CustomModal from '../Modals/CustomModal';

const { Text } = Typography;

interface CustomerDetails {
  accountNumber?: string;
  meterNumber?: string;
  customerName?: string;
  address?: string;
  connectionType?: string;
  districtMeteringArea?: string;
}

interface CustomerAccountDetailsProps {
  customerDetails: CustomerDetails;
  onCustomerFound: (details: CustomerDetails, lat?: number, lng?: number) => void;
  onCustomerNotFound: () => void;
}

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  textTransform: 'uppercase' as const,
  fontSize: 12,
  fontFamily: 'Montserrat, sans-serif',
  color: 'var(--text-primary)',
};

const CustomerAccountDetails: React.FC<CustomerAccountDetailsProps> = ({
  customerDetails = {},
  onCustomerFound,
  onCustomerNotFound
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [modalData, setModalData] = useState({
    visible: false,
    title: '',
    content: '',
    type: 'warning' as 'warning' | 'error' | 'success'
  });
  const navigate = useNavigate();

  const showModal = (title: string, content: string, type: 'warning' | 'error' | 'success' = 'warning') => {
    setModalData({ visible: true, title, content, type });
  };

  const handleSearchCustomer = async () => {
    if (!searchValue.trim()) {
      showModal('Warning', 'Please enter an account number or meter number', 'warning');
      return;
    }

    const token = localStorage.getItem('debug_token');
    if (!token) {
      showModal('Session Expired', 'Your session has expired. Please log in again.', 'error');
      navigate('/login');
      return;
    }

    try {
      setSearchLoading(true);
      const response = await devApi.get(
        `dcwd-gis/api/v1/admin/customer/SearchAccountOrMeterNumber`,
        {
          params: { searchValue },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.statusCode === 200 && response.data.data?.length > 0) {
        const customer = response.data.data[0];

        const customerDetails: CustomerDetails = {
          accountNumber: customer.accountNumber || '',
          meterNumber: customer.meterNumber || '',
          customerName: customer.customerName || customer.name || 'AJ VIRAY',
          address: customer.address || '',
          connectionType: customer.connectionType || 'Residential',
          districtMeteringArea: customer.districtMeteringArea || 'DM-01',
        };

        const newLat = parseFloat(customer.latitude);
        const newLng = parseFloat(customer.longitude);

        onCustomerFound(
          customerDetails,
          !isNaN(newLat) ? newLat : undefined,
          !isNaN(newLng) ? newLng : undefined
        );
      } else if (response.data?.statusCode === 404) {
        showModal('Not Found', response.data.message || 'Account or Meter Number not found in the database.');
        onCustomerNotFound();
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error searching customer:', error);
      showModal('Error', 'Failed to search customer. Please try again.', 'error');
      onCustomerNotFound();
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <>
      {/* Customer Search Section */}
      <Form.Item style={{ marginBottom: 16 }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="Account No. / Meter No."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={handleSearchCustomer}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            loading={searchLoading}
            onClick={handleSearchCustomer}
          >
            Search
          </Button>
        </Space.Compact>
      </Form.Item>

      {/* Customer/Account Details Section */}
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
          <UserOutlined /> Customer/Account Details
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
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <Text style={{ ...labelStyle, display: 'block', marginBottom: 4 }}>Account No. / Meter No.</Text>
                <Text style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                  {customerDetails.accountNumber && customerDetails.meterNumber 
                    ? `${customerDetails.accountNumber} / ${customerDetails.meterNumber}`
                    : '01-000001-0 / A1234567783'
                  }
                </Text>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text style={{ ...labelStyle, display: 'block', marginBottom: 4 }}>Name</Text>
                <Text style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                  {customerDetails.customerName || 'AJ VIRAY'}
                </Text>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text style={{ ...labelStyle, display: 'block', marginBottom: 4 }}>Address</Text>
                <Text style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                  {customerDetails.address || 'Davao City'}
                </Text>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text style={{ ...labelStyle, display: 'block', marginBottom: 4 }}>Connection Type</Text>
                <Text style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                  {customerDetails.connectionType || 'Residential'}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <Text style={{ ...labelStyle, display: 'block', marginBottom: 4 }}>Caretaker</Text>
                <Text style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                  CT-01
                </Text>
              </div>
              <div>
                <Text style={{ ...labelStyle, display: 'block', marginBottom: 4 }}>Address</Text>
                <Text style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                  {customerDetails.address || 'Davao City'}
                </Text>
              </div>
              <div>
                <Text style={{ ...labelStyle, display: 'block', marginBottom: 4 }}>Water Supply System</Text>
                <Text style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                  Dumoy
                </Text>
              </div>
              <div>
                <Text style={{ ...labelStyle, display: 'block', marginBottom: 4 }}>District Metering Area</Text>
                <Text style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                  {customerDetails.districtMeteringArea || 'DM-01'}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

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

export default CustomerAccountDetails;
