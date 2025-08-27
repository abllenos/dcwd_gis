import React, { useState } from 'react';
import {
  Breadcrumb,
  Card,
  Button,
  Modal,
  Select,
  message,
  DatePicker,
  Input,
  Collapse,
} from 'antd';
import { HomeOutlined, PlusOutlined, FolderOutlined, FileTextOutlined, CaretRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;
const { Panel } = Collapse;
const { Search } = Input;

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string | undefined>();

  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [activeReportTitle, setActiveReportTitle] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');

  // Report categories data structure
  const reportCategories = [
    {
      key: 'change-account',
      title: 'Change of Account Name',
      icon: <FolderOutlined />,
      reports: [
        'Daily Transaction Summary',
        'Monthly Transaction Summary',
        'Summary of Debit Memo',
        'Summary of MCR'
      ]
    },
    {
      key: 'admin-reports',
      title: 'Admin Reports',
      icon: <FolderOutlined />,
      reports: [
        'All CDM Transactions',
        'All Online Transactions',
        'All Walk-in Transactions',
        'Debit Memo Summary',
        'Credit Memo Summary',
        'MCR Summary'
      ]
    },
    {
      key: 'reconnection',
      title: 'Reconnection of Water Service',
      icon: <FolderOutlined />,
      reports: [
        'Daily Transaction Summary',
        'Monthly Transaction Summary',
        'Summary of Debit Memo by Type'
      ]
    },
    {
      key: 'disconnection',
      title: 'Disconnection of Water Service',
      icon: <FolderOutlined />,
      reports: [
        'Daily Transaction Summary',
        'Monthly Transaction Summary',
        'Summary of Debit Memo by Type'
      ]
    },
    {
      key: 'high-consumption',
      title: 'High Water Consumption',
      icon: <FolderOutlined />,
      reports: [
        'Monthly High Consumption Report',
        'Annual Consumption Analysis'
      ]
    }
  ];

  const handleHomeClick = () => navigate('/home');

  const handleReportClick = (reportTitle: string) => {
    setActiveReportTitle(reportTitle);
    setReportModalVisible(true);
  };

  const handleReportModalOk = () => {
    message.success(`Report generated: ${activeReportTitle}`);
    setReportModalVisible(false);
    setActiveReportTitle(null);
  };

  const handleCancel = () => {
    setReportModalVisible(false);
    setActiveReportTitle(null);
  };

  const getModalTitle = () => {
    if (activeReportTitle?.includes('Daily') || activeReportTitle?.includes('Summary of Debit Memo')) {
      return 'Select Date Range';
    } else if (activeReportTitle?.includes('Monthly')) {
      return 'Select Month Range';
    } else if (activeReportTitle?.includes('Summary of Debit Memo')) {
      return 'Select Date Range and Type';
    }
    return 'Select Date Range';
  };

  const renderModalContent = () => {
    if (activeReportTitle?.includes('Daily') && !activeReportTitle?.includes('Summary of Debit Memo')) {
      // Daily Transaction Summary Modal
      return (
        <div style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>
              Start Date
            </label>
            <DatePicker 
              placeholder="07/08/2023"
              style={{ width: '100%', height: 40 }}
              format="MM/DD/YYYY"
            />
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>
              End Date
            </label>
            <DatePicker 
              placeholder="07/09/2023"
              style={{ width: '100%', height: 40 }}
              format="MM/DD/YYYY"
            />
          </div>
        </div>
      );
    } else if (activeReportTitle?.includes('Monthly')) {
      // Monthly Transaction Summary Modal
      return (
        <div style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>
              Start Month
            </label>
            <DatePicker 
              picker="month"
              placeholder="Select start month"
              style={{ width: '100%', height: 40 }}
            />
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>
              End Month
            </label>
            <DatePicker 
              picker="month"
              placeholder="Select end month"
              style={{ width: '100%', height: 40 }}
            />
          </div>
        </div>
      );
    } else if (activeReportTitle?.includes('Summary of Debit Memo')) {
      // Summary of Debit Memo Modal with Type selector
      return (
        <div style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>
              Start Date
            </label>
            <DatePicker 
              placeholder="Select start date"
              style={{ width: '100%', height: 40 }}
              format="MM/DD/YYYY"
            />
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>
              End Date
            </label>
            <DatePicker 
              placeholder="Select end date"
              style={{ width: '100%', height: 40 }}
              format="MM/DD/YYYY"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>
              Select Type
            </label>
            <Select 
              placeholder="Select type"
              style={{ width: '100%', height: 40 }}
              suffixIcon={<CaretRightOutlined style={{ transform: 'rotate(90deg)' }} />}
            >
              <Option value="reconnection">Reconnection</Option>
              <Option value="disconnection">Disconnection</Option>
              <Option value="installation">New Installation</Option>
              <Option value="maintenance">Maintenance</Option>
            </Select>
          </div>
        </div>
      );
    } else {
      // Default date range modal
      return (
        <div style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>
              Start Date
            </label>
            <DatePicker 
              style={{ width: '100%', height: 40 }}
              format="MM/DD/YYYY"
            />
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>
              End Date
            </label>
            <DatePicker 
              style={{ width: '100%', height: 40 }}
              format="MM/DD/YYYY"
            />
          </div>
        </div>
      );
    }
  };

  const filteredCategories = reportCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.reports.some(report => report.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderReportItem = (reportTitle: string) => (
    <div
      key={reportTitle}
      onClick={() => handleReportClick(reportTitle)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        cursor: 'pointer',
        borderRadius: '4px',
        marginBottom: '4px',
        transition: 'all 0.2s',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#e3f2fd';
        e.currentTarget.style.borderColor = '#1976d2';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#f8f9fa';
        e.currentTarget.style.borderColor = '#e9ecef';
      }}
    >
      <FileTextOutlined style={{ marginRight: 8, color: '#1976d2' }} />
      <span style={{ color: '#333', fontSize: '14px' }}>{reportTitle}</span>
    </div>
  );

  return (
    <div style={{ padding: '4px 24px 24px 24px' }}>
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            icon={<HomeOutlined />}
            onClick={handleHomeClick}
            type="text"
            style={{ fontSize: 16, color: '#00008B', margin: 0 }}
            shape="circle"
          />
          <Breadcrumb style={{ fontSize: 16, fontWeight: 500, margin: 0, marginLeft: 8 }}>
            <Breadcrumb.Item>/ Reports</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Search
          placeholder="Search here..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      {/* Reports Card */}
      <Card
        style={{
          marginBottom: 0,
          width: '100%',
          maxWidth: '100%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
        bodyStyle={{ padding: 24 }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
          }}
        >
          <div>
            <Collapse
              ghost
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              style={{ backgroundColor: 'white' }}
            >
              {filteredCategories.slice(0, Math.ceil(filteredCategories.length / 2)).map((category) => (
                <Panel
                  header={
                    <div style={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '16px' }}>
                      {category.icon}
                      <span style={{ marginLeft: 8 }}>{category.title}</span>
                    </div>
                  }
                  key={category.key}
                  style={{
                    marginBottom: 8,
                    backgroundColor: 'white',
                    border: '1px solid #e8e8e8',
                    borderRadius: 6,
                  }}
                >
                  <div style={{ paddingLeft: 24 }}>
                    {category.reports.map((report) => renderReportItem(report))}
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>
          
          <div>
            <Collapse
              ghost
              expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              style={{ backgroundColor: 'white' }}
            >
              {filteredCategories.slice(Math.ceil(filteredCategories.length / 2)).map((category) => (
                <Panel
                  header={
                    <div style={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '16px' }}>
                      {category.icon}
                      <span style={{ marginLeft: 8 }}>{category.title}</span>
                    </div>
                  }
                  key={category.key}
                  style={{
                    marginBottom: 8,
                    backgroundColor: 'white',
                    border: '1px solid #e8e8e8',
                    borderRadius: 6,
                  }}
                >
                  <div style={{ paddingLeft: 24 }}>
                    {category.reports.map((report) => renderReportItem(report))}
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>
      </Card>

      {/* Report Details Modal */}
      <Modal
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: '16px', 
            fontWeight: 600,
            color: '#333'
          }}>
            {getModalTitle()}
          </div>
        }
        open={reportModalVisible}
        onCancel={handleCancel}
        width={480}
        centered
        styles={{
          header: {
            paddingBottom: '16px',
            borderBottom: '1px solid #f0f0f0'
          },
          body: {
            paddingTop: '0px'
          }
        }}
        footer={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '12px',
            paddingTop: '20px',
            borderTop: '1px solid #f0f0f0'
          }}>
            <Button 
              onClick={handleCancel}
              style={{
                height: '40px',
                paddingLeft: '20px',
                paddingRight: '20px',
                borderRadius: '6px',
                fontWeight: 500
              }}
              icon={<span style={{ marginRight: 4 }}>✕</span>}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={handleReportModalOk}
              style={{
                height: '40px',
                paddingLeft: '20px',
                paddingRight: '20px',
                borderRadius: '6px',
                fontWeight: 500,
                backgroundColor: '#4F46E5'
              }}
              icon={<span style={{ marginRight: 4 }}>🖨</span>}
            >
              Print Preview
            </Button>
          </div>
        }
      >
        <div style={{ 
          backgroundColor: '#fff',
          borderRadius: '8px'
        }}>
          
          {renderModalContent()}
        </div>
      </Modal>
    </div>
  );
};

export default Reports;
