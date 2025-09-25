import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Typography, 
  Row, 
  Col, 
  Select, 
  Button, 
  Space,
  message,
  Spin,
  Alert
} from 'antd';
import { 
  FileTextOutlined, 
  PrinterOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { reportsStore } from '../stores/reportsStore';
import type { ReportFile } from '../stores/reportsStore';
import Footer from './layout/Footer';
import '../styles/reports.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Reports: React.FC = observer(() => {
  const [selectedReportType, setSelectedReportType] = useState<string>('all');

  // Function to refresh reports via store
  const handleRefreshReports = async () => {
    try {
      await reportsStore.refreshReports();
      if (!reportsStore.error) {
        message.success(`Reports refreshed! Loaded ${reportsStore.reports.length} local files`);
      } else {
        message.error(reportsStore.error);
      }
    } catch (error) {
      message.error('Error refreshing reports');
      console.error('Refresh error:', error);
    }
  };

  // Load reports when component mounts
  useEffect(() => {
    reportsStore.fetchReports();
  }, []);
  
  // Debug logging
  console.log('Reports Debug:', {
    totalReportsCount: reportsStore.reports.length,
    localReportsCount: reportsStore.localReports.length,
    isLoading: reportsStore.loading,
    error: reportsStore.error
  });



  const handleDownloadReport = (report: ReportFile) => {
    reportsStore.downloadReport(report);
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

  // Get filtered reports from store
  const filteredReports = selectedReportType === 'all' 
    ? reportsStore.reports 
    : reportsStore.reports.filter(report => 
        report.category.toLowerCase().includes(selectedReportType.toLowerCase())
      );

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
          <Col xs={24} sm={12} lg={8}>
            <div className="form-group">
              <Text strong style={{ display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>
                Data Source:
              </Text>
              <Space>
                <Text style={{ fontSize: '14px', color: 'var(--success-color)' }}>
                  Local Files (/public/reports)
                </Text>
                <Button
                  type="link"
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={handleRefreshReports}
                  loading={reportsStore.loading}
                  style={{ padding: '0 8px' }}
                >
                  Refresh
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Status Alert */}
      {reportsStore.reports.length === 0 && !reportsStore.loading && (
        <Alert
          message="No Reports Found"
          description="No reports found in the public/reports folder. Please ensure report files are available."
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {/* Error Alert */}
      {reportsStore.error && (
        <Alert
          message="Error Loading Reports"
          description={reportsStore.error}
          type="error"
          showIcon
          closable
          onClose={() => reportsStore.setError(null)}
          style={{ marginBottom: '16px' }}
        />
      )}

      {/* Loading indicator */}
      {reportsStore.loading && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: '8px' }}>
            <Text>Loading local reports...</Text>
          </div>
        </div>
      )}

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