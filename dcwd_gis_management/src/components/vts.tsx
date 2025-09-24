import React from 'react';
import { Card, Table, Typography, Row, Col, Input, Space, Button, Dropdown, Select } from 'antd';
import { UserOutlined, EnvironmentOutlined, GlobalOutlined, DownOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { licenseStore } from '../stores/licenseStore';
import Footer from './layout/Footer';
import '../styles/vts.css';

const { Title, Text } = Typography;

const VTS: React.FC = observer(() => {
  const [filteredUsers, setFilteredUsers] = React.useState(licenseStore.registeredUsers);
  const [pageSize, setPageSize] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInitialized = React.useRef(false);

  // Update filtered users when the license store data changes
  React.useEffect(() => {
    setFilteredUsers(licenseStore.registeredUsers);
    setCurrentPage(1); // Reset to first page when data changes
  }, [licenseStore.registeredUsers]);

  // Fetch license data when component mounts
  React.useEffect(() => {
    if (licenseStore.registeredUsers.length === 0) {
      licenseStore.fetchRegisteredUsers();
    }
  }, []);

  React.useEffect(() => {
    // Initialize the map when component mounts
    if (mapRef.current && !mapInitialized.current && window.MapAPI) {
      const mapId = 'vts-map';
      mapRef.current.id = mapId;

      // Create the map with Davao City coordinates
      window.MapAPI.createMap(mapId, {
        center: [7.0731, 125.6128], // Davao City center
        zoom: 14,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      // Add Davao water facilities instead of generic markers
      window.MapAPI.addDavaoWaterFacilities(mapId);

      mapInitialized.current = true;
    }

    // Cleanup function
    return () => {
      if (mapInitialized.current && window.MapAPI) {
        window.MapAPI.destroyMap('vts-map');
        mapInitialized.current = false;
      }
    };
  }, []);

  const handleSearch = (value: string) => {
    const filtered = licenseStore.registeredUsers.filter(user =>
      user.deviceName.toLowerCase().includes(value.toLowerCase()) ||
      user.department.toLowerCase().includes(value.toLowerCase()) ||
      user.id.toString().toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Pagination helpers
  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);
    setPageSize(newPageSize);
    
    // Adjust current page if it would be out of bounds with the new page size
    const newTotalPages = Math.ceil(filteredUsers.length / newPageSize);
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    } else {
      setCurrentPage(1); // Reset to first page for better UX
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Simple pagination logic
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3; // Reduced for smaller right panel
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const handleUserClick = (userId: number) => {
    // Example of how to interact with the map when a user is clicked
    if (window.MapAPI) {
      const map = window.MapAPI.getMap('vts-map');
      if (map) {
        // Focus on Davao city bounds when user is selected
        window.MapAPI.focusOnDavaoCity('vts-map');
        console.log(`User ${userId} selected, map focused on Davao area`);
      }
    }
  };

  const handleMapLayerChange = (layerType: 'googleMaps' | 'googleSatellite' | 'googleHybrid' | 'googleTerrain') => {
    if (window.MapAPI) {
      window.MapAPI.switchTileLayer('vts-map', layerType);
    }
  };

  const mapLayerItems = [
    {
      key: 'googleMaps',
      label: 'Google Maps',
      onClick: () => handleMapLayerChange('googleMaps'),
    },
    {
      key: 'googleSatellite',
      label: 'Satellite',
      onClick: () => handleMapLayerChange('googleSatellite'),
    },
    {
      key: 'googleHybrid',
      label: 'Hybrid',
      onClick: () => handleMapLayerChange('googleHybrid'),
    },
    {
      key: 'googleTerrain',
      label: 'Terrain',
      onClick: () => handleMapLayerChange('googleTerrain'),
    },
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a: any, b: any) => a.id - b.id,
    },
    {
      title: 'Computer Name',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: 140,
      sorter: (a: any, b: any) => a.deviceName.localeCompare(b.deviceName),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 180,
      sorter: (a: any, b: any) => a.department.localeCompare(b.department),
    },
  ];

  return (
    <div className="vts-container">
      {/* Page Header */}
      <div className="vts-header">
        <Title level={2} className="vts-header-title">
          DCWD (VTS)
        </Title>
        <Text className="vts-header-description">
          sample text here as description
        </Text>
      </div>

      {/* Main Content */}
      <Row gutter={20} className="vts-main-content">
        {/* Map Section - Left Side */}
        <Col span={16}>
          <Card 
            title={
              <Space>
                <EnvironmentOutlined />
                Davao City Water District Map
              </Space>
            }
            extra={
              <Dropdown menu={{ items: mapLayerItems }} trigger={['click']}>
                <Button size="small" type="text">
                  <Space>
                    <GlobalOutlined />
                    Layer
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            }
            className="vts-map-card"
          >
            {/* Map container */}
            <div 
              ref={mapRef}
              className="vts-map-container"
            />
          </Card>
        </Col>

        {/* User List Section - Right Side */}
        <Col span={8}>
          <Card 
            title={
              <Space>
                <UserOutlined />
                Registered Users ({totalItems})
              </Space>
            }
            className="vts-user-card"
          >
            {/* Display and Search Controls */}
            <div className="vts-controls-container">
              <div className="vts-display-controls">
                <Typography.Text className="vts-control-text">Display</Typography.Text>
                <Select 
                  value={pageSize.toString()} 
                  size="small" 
                  style={{ width: 60 }}
                  onChange={handlePageSizeChange}
                  options={[
                    { value: '10', label: '10' },
                    { value: '20', label: '20' },
                    { value: '50', label: '50' }
                  ]}
                />
                <Typography.Text className="vts-control-text">records per page</Typography.Text>
              </div>
              <div className="vts-search-controls">
                <Typography.Text className="vts-control-text">Search:</Typography.Text>
                <Input.Search
                  placeholder=""
                  allowClear
                  size="small"
                  style={{ width: 140 }}
                  enterButton
                  onSearch={handleSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="vts-user-table-container">
              {totalItems > 0 ? (
                <Table
                  columns={columns}
                  dataSource={paginatedUsers}
                  pagination={false}
                  size="small"
                  scroll={{ y: 'calc(100vh - 400px)' }}
                  className="vts-user-table"
                  rowKey="id"
                  onRow={(record) => ({
                    onClick: () => handleUserClick(record.id)
                  })}
                />
              ) : (
                <div className="vts-empty-state">
                  <UserOutlined className="vts-empty-state-icon" />
                  <Text className="vts-empty-state-text">
                    {licenseStore.registeredUsers.length === 0 
                      ? 'No registered users yet' 
                      : 'No users found matching your search criteria'
                    }
                  </Text>
                </div>
              )}

              {/* Pagination Controls */}
              <div className="vts-pagination-container">
                <Typography.Text className="vts-pagination-text">
                  Showing {totalItems > 0 ? startIndex + 1 : 0} to {totalItems > 0 ? endIndex : 0} of {totalItems} entries
                </Typography.Text>
                <div className="vts-pagination-buttons">
                  <Button 
                    size="small" 
                    disabled={currentPage === 1 || totalItems === 0}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      (currentPage === 1 || totalItems === 0) 
                        ? "vts-pagination-button-disabled" 
                        : "vts-pagination-button"
                    }
                  >
                    Previous
                  </Button>
                  {totalItems > 0 ? getPageNumbers().map(pageNum => (
                    <Button 
                      key={pageNum}
                      size="small" 
                      type={pageNum === currentPage ? "primary" : "default"}
                      className={
                        pageNum === currentPage 
                          ? "vts-pagination-button-active" 
                          : "vts-pagination-button"
                      }
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )) : (
                    <Button 
                      size="small" 
                      disabled
                      className="vts-pagination-button-disabled"
                    >
                      1
                    </Button>
                  )}
                  <Button 
                    size="small" 
                    disabled={currentPage === totalPages || totalPages === 0 || totalItems === 0}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      (currentPage === totalPages || totalPages === 0 || totalItems === 0)
                        ? "vts-pagination-button-disabled" 
                        : "vts-pagination-button"
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom spacing before footer */}
      <div className="vts-footer-spacing"></div>

      <Footer />
    </div>
  );
});

export default VTS;
