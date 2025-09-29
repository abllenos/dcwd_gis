import React from 'react';
import { Card, Table, Typography, Row, Col, Input, Space, Button, Dropdown, Select, Alert, Spin, message } from 'antd';
import { UserOutlined, EnvironmentOutlined, GlobalOutlined, DownOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { vtsStore } from '../stores/vtsStore';
import Footer from './layout/Footer';
import '../styles/vts.css';

const { Title, Text } = Typography;

const VTS: React.FC = observer(() => {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInitialized = React.useRef(false);

  // Fetch VTS data when component mounts
  React.useEffect(() => {
    if (vtsStore.users.length === 0) {
      vtsStore.fetchUsers();
    }
  }, []);

  // Handle refresh from API
  const handleRefreshFromAPI = async () => {
    try {
      await vtsStore.forceRefreshFromAPI();
      if (!vtsStore.error) {
        message.success(`VTS data refreshed! Loaded ${vtsStore.users.length} users from API`);
      } else {
        message.error(vtsStore.error);
      }
    } catch (error) {
      message.error('Error refreshing VTS data');
      console.error('Refresh error:', error);
    }
  };

  React.useEffect(() => {
    // Initialize the map when component mounts
    if (mapRef.current && !mapInitialized.current && window.MapAPI && !vtsStore.mapState.initialized) {
      const mapId = 'vts-map';
      mapRef.current.id = mapId;

      // Create the map with coordinates from store
      window.MapAPI.createMap(mapId, {
        center: vtsStore.mapState.center,
        zoom: vtsStore.mapState.zoom,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      // Add Davao water facilities instead of generic markers
      window.MapAPI.addDavaoWaterFacilities(mapId);

      mapInitialized.current = true;
      vtsStore.setMapInitialized(true);
    }

    // Cleanup function
    return () => {
      if (mapInitialized.current && window.MapAPI) {
        window.MapAPI.destroyMap('vts-map');
        mapInitialized.current = false;
        vtsStore.setMapInitialized(false);
      }
    };
  }, []);

  const handleSearch = (value: string) => {
    vtsStore.setSearchText(value);
  };

  // Pagination helpers
  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);
    vtsStore.setPageSize(newPageSize);
  };

  const handlePageChange = (page: number) => {
    vtsStore.setCurrentPage(page);
  };

  // Get computed values from store
  const totalItems = vtsStore.totalItems;
  const totalPages = vtsStore.totalPages;
  const startIndex = vtsStore.startIndex;
  const endIndex = vtsStore.endIndex;
  const paginatedUsers = vtsStore.paginatedUsers;
  const currentPage = vtsStore.currentPage;
  const pageSize = vtsStore.pageSize;
  const pageNumbers = vtsStore.pageNumbers;

  const handleUserClick = (userId: number) => {
    // Focus on user location and select in store
    vtsStore.focusOnUser(userId);
    
    // Example of how to interact with the map when a user is clicked
    if (window.MapAPI) {
      const map = window.MapAPI.getMap('vts-map');
      if (map) {
        // Focus on user location if coordinates are available
        const user = vtsStore.users.find(u => u.id === userId);
        if (user && user.coordinates) {
          window.MapAPI.setView('vts-map', user.coordinates, 16);
        } else {
          // Fallback to Davao city bounds
          window.MapAPI.focusOnDavaoCity('vts-map');
        }
        console.log(`User ${userId} selected, map focused on user location`);
      }
    }
  };

  const handleMapLayerChange = (layerType: 'googleMaps' | 'googleSatellite' | 'googleHybrid' | 'googleTerrain') => {
    vtsStore.setMapLayer(layerType);
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
            {/* Data Source Alert */}
            {!vtsStore.isUsingAPIData && !vtsStore.loading && (
              <Alert
                message="Using Sample Data"
                description="Click refresh to load live data from License API"
                type="info"
                showIcon
                style={{ marginBottom: '12px', fontSize: '12px' }}
                action={
                  <Button 
                    size="small" 
                    type="primary"
                    onClick={handleRefreshFromAPI}
                    loading={vtsStore.loading}
                  >
                    Load API Data
                  </Button>
                }
              />
            )}

            {/* Error Alert */}
            {vtsStore.error && (
              <Alert
                message="Error Loading Data"
                description={vtsStore.error}
                type="error"
                showIcon
                closable
                onClose={() => vtsStore.setError(null)}
                style={{ marginBottom: '12px', fontSize: '12px' }}
              />
            )}

            {/* Loading Indicator */}
            {vtsStore.loading && (
              <div style={{ textAlign: 'center', margin: '12px 0' }}>
                <Spin size="small" />
                <Text type="secondary" style={{ marginLeft: '8px', fontSize: '12px' }}>
                  Loading from License API...
                </Text>
              </div>
            )}

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
                    {vtsStore.users.length === 0 
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
                  {totalItems > 0 ? pageNumbers.map((pageNum: number) => (
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
