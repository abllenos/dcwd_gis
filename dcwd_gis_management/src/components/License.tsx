import React, { useEffect } from 'react';
import { Typography, Form, Select, Input, DatePicker, Button, Row, Col, message, Table, Spin, Tooltip, Space } from 'antd';
import { LaptopOutlined, UserOutlined, CalendarOutlined, UnorderedListOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { licenseStore } from '../stores/licenseStore';
import Footer from './layout/Footer';
import LicenseModal from './modal/LicenseModal';
import '../styles/license.css';

const { Option } = Select;

// Constants - organized at the top for better maintainability
const SOFTWARE_OPTIONS = [
  'MapInfo Professional 19 | Trial',
  'MapInfo Professional 19 | License',
  'MapInfo Professional 17 | License',
  'MapInfo Professional 17 | Trial',
  'MapInfo Professional 12 | Trial',
  'MapInfo Proviewer 15 | Viewer',
  'QGIS | License'
];

const DEPARTMENT_OPTIONS = [
  'Information and Communication Technology Department',
  'Legal Department',
  'Pipelines and Appurtenances Maintenance Department',
  'Financial Management Department',
  'Engineering and Construction Department',
  'Accounting Department',
  'Commercial Services Department',
  'Corporate Planning Department',
  'General Services Department',
  'Community Relations and External Affairs Department',
  'Production Department',
  'Internal Audit Department',
  'Human Resource Department'
];

// Table configuration
const TABLE_COLUMNS = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: 'License Type', dataIndex: 'software', key: 'software' },
  { title: 'Department', dataIndex: 'department', key: 'department' },
  { title: 'Computer Name', dataIndex: 'deviceName', key: 'deviceName' },
  {
    title: 'Actions',
    key: 'actions',
    width: 80,
    align: 'center' as const,
    render: (_: any, record: any) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button
          className="license-table-action-button"
          onClick={() => {
            licenseStore.setSelectedUser(record);
            licenseStore.setModalVisible(true);
          }}
          title="View Details"
        />
      </div>
    ),
  },
];

const License: React.FC = observer(() => {
  const [form] = Form.useForm();

  // Initialize data on component mount - using MobX store only
  useEffect(() => {
    if (licenseStore.registeredUsers.length === 0) {
      licenseStore.fetchRegisteredUsers();
    }
  }, []);

  // Event handlers - all using MobX store actions, no local state
  const handleSubmit = (values: any) => {
    const userData = {
      software: values.software,
      deviceName: values.deviceName,
      department: values.department,
      userId: values.userId,
      installationDate: values.installationDate?.format('DD/MM/YYYY'),
    };
    
    licenseStore.addUser(userData);
    message.success('User registered successfully!');
    form.resetFields();
  };

  const handleSearch = (value: string) => {
    licenseStore.setSearchText(value);
    licenseStore.setCurrentPage(1);
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);
    licenseStore.setPageSize(newPageSize);
    const newTotalPages = Math.ceil(licenseStore.filteredUsers.length / newPageSize);
    licenseStore.setCurrentPage(Math.max(1, Math.min(licenseStore.currentPage, newTotalPages)));
  };

  const handlePageChange = (page: number) => {
    licenseStore.setCurrentPage(page);
  };

  const handleRefreshUsers = async () => {
    try {
      message.loading('Refreshing users...', 1);
      licenseStore.clearUsers();
      const result = await licenseStore.fetchRegisteredUsers();
      if (result.success) {
        message.success(`Refreshed! Loaded ${result.count || 0} registered users`);
      } else {
        message.error(result.error || 'Failed to refresh users');
      }
    } catch (error) {
      message.error('An error occurred while refreshing users');
      console.error('Refresh error:', error);
    }
  };

  // Computed values from MobX store - no local state needed
  const totalItems = licenseStore.filteredUsers.length;
  const totalPages = Math.ceil(totalItems / licenseStore.pageSize);
  const startIndex = (licenseStore.currentPage - 1) * licenseStore.pageSize;
  const endIndex = Math.min(startIndex + licenseStore.pageSize, totalItems);
  const paginatedUsers = licenseStore.filteredUsers.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const currentPage = licenseStore.currentPage;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      for (let i = startPage; i <= endPage; i++) pages.push(i);
    }
    return pages;
  };



  return (
    <div className="license-container">

      {/* Registration Form Section */}
      <div className="license-form-header">
        <Typography.Title level={4} className="license-form-title">
          Create / Update Registered Users
        </Typography.Title>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="license-form-container"
      >
        <Row gutter={[16, 0]} align="bottom">
          <Col xs={24} sm={12} md={6} lg={4}>
            <Form.Item
              label={<span className="license-form-label">Software<span className="license-required-asterisk">*</span></span>}
              name="software"
              rules={[{ required: true, message: 'Please select software!' }]}
            >
              <Select 
                placeholder="- SELECT -"
                className="license-form-input"
                suffixIcon={<span>⚙️</span>}
              >
                {SOFTWARE_OPTIONS.map((option: string) => (
                  <Option key={option} value={option}>{option}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

            <Col xs={24} sm={12} md={6} lg={5}>
              <Form.Item
                label={<span className="license-form-label">Device Name<span className="license-required-asterisk">*</span></span>}
                name="deviceName"
                rules={[{ required: true, message: 'Please enter device name!' }]}
              >
                <Input 
                  placeholder="Device Name" 
                  className="license-form-input"
                  prefix={<LaptopOutlined />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item
                label={<span className="license-form-label">Department<span className="license-required-asterisk">*</span></span>}
                name="department"
                rules={[{ required: true, message: 'Please select department!' }]}
              >
                <Select 
                  placeholder="- SELECT -"
                  className="license-form-input"
                  suffixIcon={<span>⚙️</span>}
                >
                  {DEPARTMENT_OPTIONS.map((option: string) => (
                    <Option key={option} value={option}>{option}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item
                label={<span className="license-form-label">User ID<span className="license-required-asterisk">*</span></span>}
                name="userId"
                rules={[{ required: true, message: 'Please enter user ID!' }]}
              >
                <Input 
                  placeholder="User ID" 
                  className="license-form-input"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item
                label={<span className="license-form-label">Installation Date<span className="license-required-asterisk">*</span></span>}
                name="installationDate"
                rules={[{ required: true, message: 'Please select installation date!' }]}
              >
                <DatePicker 
                  style={{ width: '100%', height: '40px' }} 
                  placeholder="dd/mm/yyyy"
                  format="DD/MM/YYYY"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={3}>
              <Form.Item>
                <Button style={{ background: '#2563eb', borderColor: '#2563eb' }}
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />}
                  className="license-register-button"
                >
                  Register
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>

      {/* Registered Users List Section */}
      <div className="license-list-header">
        <Typography.Title level={4} className="license-list-title">
          List of Registered Users
        </Typography.Title>
        <Space>
          <Tooltip title="Refresh Users">
            <Button style={{ background: '#2563eb', borderColor: '#2563eb' }}
              type="text"
              icon={<ReloadOutlined />}
              onClick={handleRefreshUsers}
              loading={licenseStore.loading}
              className="license-action-button"
            >
              Refresh
            </Button>
          </Tooltip>
        </Space>
      </div>

      <div className="license-list-container">
        {/* All Users Tab */}
        <div className="license-tab-container">
          <div className="license-tab-header">
            <Typography.Text className="license-tab-text">
              All Users
            </Typography.Text>
          </div>
          
          {/* Content Area with Tab Connection */}
          <div className="license-tab-content">
            {/* Display and Search Controls */}
            <div className="license-controls-container">
              <div className="license-display-controls">
                <Typography.Text className="license-control-text">Display</Typography.Text>
                <Select 
                  value={licenseStore.pageSize.toString()} 
                  size="small" 
                  style={{ width: 80 }}
                  onChange={handlePageSizeChange}
                  options={[
                    { value: '10', label: '10' },
                    { value: '25', label: '25' },
                    { value: '50', label: '50' },
                    { value: '100', label: '100' }
                  ]}
                />
                <Typography.Text className="license-control-text">records per page</Typography.Text>
              </div>
              <div className="license-search-controls">
                <Typography.Text className="license-control-text">Search:</Typography.Text>
                <Input.Search
                  size="small"
                  placeholder=""
                  style={{ width: 200 }}
                  enterButton
                  onSearch={handleSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            
            {totalItems > 0 ? (
              <Spin spinning={licenseStore.loading} tip="Loading users...">
                <Table
                  columns={TABLE_COLUMNS}
                  dataSource={paginatedUsers}
                  rowKey="key"
                  pagination={false}
                  size="small"
                  className="license-table"
                  scroll={{ x: true }}
                />
              </Spin>
            ) : licenseStore.loading ? (
              <div className="license-loading-state">
                <Spin size="large" />
                <Typography.Text className="license-loading-text">
                  Loading registered users...
                </Typography.Text>
              </div>
            ) : (
              <div className="license-empty-state">
                <UnorderedListOutlined className="license-empty-icon" />
                <Typography.Text className="license-empty-text">
                  {licenseStore.registeredUsers.length === 0 
                    ? 'No registered users yet' 
                    : 'No users found matching your search criteria'
                  }
                </Typography.Text>
              </div>
            )}

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8, marginTop: 16 }}>
              <Typography.Text style={{ fontSize: 12 }}>
                Showing {totalItems > 0 ? startIndex + 1 : 0} to {totalItems > 0 ? endIndex : 0} of {totalItems} entries
                {licenseStore.searchText && ` (filtered from ${licenseStore.registeredUsers.length} total entries)`}
              </Typography.Text>
              <Space>
                <Button size="small" disabled={licenseStore.currentPage === 1 || totalItems === 0} onClick={() => handlePageChange(licenseStore.currentPage - 1)}>Previous</Button>
                {totalItems > 0 ? getPageNumbers().map(pageNum => (
                  <Button 
                    key={pageNum} 
                    size="small" 
                    type={pageNum === licenseStore.currentPage ? 'primary' : 'default'} 
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )) : (
                  <Button size="small" disabled>1</Button>
                )}
                <Button size="small" disabled={licenseStore.currentPage === totalPages || totalPages === 0 || totalItems === 0} onClick={() => handlePageChange(licenseStore.currentPage + 1)}>Next</Button>
              </Space>
            </div>
          </div>
        </div>
      </div>



      {/* License Modals */}
      <LicenseModal />

      <Footer />
    </div>
  );
});

export default License;