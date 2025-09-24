import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Typography, 
  Row, 
  Col, 
  Select, 
  Button, 
  Space
} from 'antd';
import { 
  FileTextOutlined, 
  PrinterOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import Footer from './layout/Footer';
import '../styles/reports.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface ReportFile {
  id: number;
  fileName: string;
  displayName: string;
  description: string;
  fileSize: string;
  uploadDate: string;
  category: string;
  filePath: string; // Path to the actual file
}

const Reports: React.FC = observer(() => {
  const [selectedReportType, setSelectedReportType] = useState<string>('all');
  const [availableReports] = useState<ReportFile[]>([
    {
      id: 1,
      fileName: 'CPDPipelineCostAnalysis_2025-09-23.csv',
      displayName: 'CPD Pipeline Cost Analysis',
      description: 'Comprehensive cost analysis of pipeline infrastructure for September 2025',
      fileSize: '6.5 MB',
      uploadDate: '2025-09-23',
      category: 'Infrastructure',
      filePath: '/reports/CPDPipelineCostAnalysis_2025-09-23.csv'
    },
    {
      id: 2,
      fileName: 'CustomerListing_Zone01_2025-09-23.csv',
      displayName: 'Customer Listing - Zone 01',
      description: 'Complete customer database listing for Zone 01 as of September 2025',
      fileSize: '2.4 MB',
      uploadDate: '2025-09-23',
      category: 'Customer',
      filePath: '/reports/CustomerListing_Zone01_2025-09-23.csv'
    }
  ]);

  const handleDownloadReport = (report: ReportFile) => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = report.filePath;
    link.download = report.fileName;
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Downloading: ${report.displayName} (${report.fileName})`);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv':
        return '📊';
      case 'pdf':
        return '📄';
      case 'xlsx':
      case 'xls':
        return '📈';
      default:
        return '📋';
    }
  };

  const columns = [
    {
      title: 'Report Name',
      dataIndex: 'displayName',
      key: 'displayName',
      render: (text: string, record: ReportFile) => (
        <div style={{ minWidth: '180px' }}>
          <Text strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
            <span style={{ marginRight: '8px', fontSize: '16px' }}>
              {getFileIcon(record.fileName)}
            </span>
            {text}
          </Text>
          <br />
          <Text 
            type="secondary" 
            style={{ 
              fontSize: '12px', 
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {record.category}
          </Text>
          <br />
          <Text 
            type="secondary" 
            style={{ 
              fontSize: '11px', 
              color: 'var(--text-tertiary)',
              fontStyle: 'italic'
            }}
          >
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string) => (
        <div>
          <Text code style={{ fontSize: '12px', backgroundColor: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>
            {text}
          </Text>
          <br />
          <Text style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            {text.split('.').pop()?.toUpperCase()} FILE
          </Text>
        </div>
      ),
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      sorter: (a: ReportFile, b: ReportFile) => 
        new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime(),
    },
    {
      title: 'File Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ReportFile) => {
        const isCSV = record.fileName.toLowerCase().endsWith('.csv');
        return (
          <Space size="small">
            <Button 
              size="small" 
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadReport(record)}
              type="primary"
              style={{ 
                borderRadius: '6px',
                fontWeight: '500'
              }}
            >
              Download
            </Button>
            <Button 
              size="small" 
              icon={<PrinterOutlined />}
              onClick={() => window.open(record.filePath, '_blank')}
              style={{ 
                borderRadius: '6px',
                fontWeight: '500'
              }}
              title={isCSV ? "Open CSV file" : "View file"}
            >
              {isCSV ? 'Open' : 'View'}
            </Button>
          </Space>
        );
      },
    },
  ];

  const filteredReports = selectedReportType === 'all' 
    ? availableReports 
    : availableReports.filter(report => report.category.toLowerCase() === selectedReportType.toLowerCase());

  return (
    <div className="reports-container">
      {/* Page Header */}
      <div className="reports-header">
        <Title level={2} className="reports-header-title">
          <FileTextOutlined style={{ marginRight: '12px' }} />
          Reports Library
        </Title>
        <Text className="reports-header-description">
          Access and download available reports for DCWD GIS Management
        </Text>
      </div>

      {/* Filter Section */}
      <Card 
        title={
          <Space>
            <FileTextOutlined />
            Filter Reports
          </Space>
        }
        className="reports-generation-card"
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} lg={8}>
            <div className="form-group">
              <Text strong style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
                Report Category:
              </Text>
              <Select
                value={selectedReportType}
                onChange={setSelectedReportType}
                style={{ width: '100%' }}
                placeholder="Select report category"
                size="large"
              >
                <Option value="all">All Categories</Option>
                <Option value="infrastructure">Infrastructure</Option>
                <Option value="customer">Customer Reports</Option>
                <Option value="performance">Performance</Option>
                <Option value="maintenance">Maintenance</Option>
                <Option value="gis">GIS Analysis</Option>
                <Option value="system">System Reports</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div className="form-group">
              <Text strong style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
                Total Reports:
              </Text>
              <Text style={{ fontSize: '18px', fontWeight: '600', color: 'var(--primary-color)' }}>
                {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} available
              </Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Reports Table */}
      <Card 
        title={
          <Space>
            <FileTextOutlined />
            Available Reports ({filteredReports.length})
          </Space>
        }
        className="reports-table-card"
      >
        <Table
          columns={columns}
          dataSource={filteredReports}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Bottom spacing before footer */}
      <div className="reports-footer-spacing"></div>

      <Footer />
    </div>
  );
});

export default Reports;
