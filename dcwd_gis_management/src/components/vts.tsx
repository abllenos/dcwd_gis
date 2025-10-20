import React from 'react';
import { Card, Table, Typography, Row, Col, Input, Space, Button, Dropdown, Select } from 'antd';
import { UserOutlined, EnvironmentOutlined, GlobalOutlined, DownOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { vtsStore } from '../stores/vtsStore';
import Footer from './layout/Footer';
import '../styles/vts.css';
// Import MapAPI to ensure it's loaded
import '../services/MapAPI';

const { Title, Text } = Typography;

// Constants
const MAP_ID = 'vts-map';
const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' }
];

const MAP_LAYER_ITEMS = [
  { key: 'googleMaps', label: 'Google Maps' },
  { key: 'googleSatellite', label: 'Satellite' },
  { key: 'googleHybrid', label: 'Hybrid' },
  { key: 'googleTerrain', label: 'Terrain' }
];

const TABLE_COLUMNS = [
  { 
    title: '', 
    dataIndex: 'status', 
    key: 'status', 
    width: 40,
    render: (status: string) => {
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'online': return '#00ff00'; // Green
          case 'offline': return '#ff0000'; // Red
          case 'unknown': return '#ffff00'; // Yellow
          default: return '#0000ff'; // Blue
        }
      };
      
      return (
        <div 
          style={{
            width: '16px',
            height: '16px',
            backgroundColor: getStatusColor(status),
            border: '2px solid white',
            borderRadius: '50%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            margin: '0 auto'
          }}
        />
      );
    }
  },
  { title: 'Employee ID', dataIndex: 'userId', key: 'userId', width: 160, sorter: (a: any, b: any) => a.userId.localeCompare(b.userId) }
];


const VTS: React.FC = observer(() => {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInitialized = React.useRef(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = React.useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = React.useState<any | null>(null);

  // Initialize data on component mount
  React.useEffect(() => {
    // Data is already loaded in constructor, no need to reload
    console.log(`VTS initialized with ${vtsStore.users.length} employees`);
    
    // Set up global function for map marker clicks
    (window as any).selectEmployeeFromMap = (employeeId: number) => {
      const employee = vtsStore.users.find(u => u.id === employeeId);
      if (employee) {
        setSelectedEmployeeId(employeeId);
        setSelectedEmployee(employee);
        
        // If the employee is not on the current page, navigate to the correct page
        const employeeIndex = vtsStore.filteredUsers.findIndex(u => u.id === employeeId);
        const pageNumber = Math.floor(employeeIndex / vtsStore.pageSize) + 1;
        if (pageNumber !== vtsStore.currentPage) {
          vtsStore.setCurrentPage(pageNumber);
        }
      }
    };
    
    // Cleanup global function on unmount
    return () => {
      delete (window as any).selectEmployeeFromMap;
    };
  }, []);

  // Event handlers
  const handleSearch = (value: string) => vtsStore.setSearchText(value);
  const handlePageSizeChange = (value: string) => vtsStore.setPageSize(parseInt(value));
  const handlePageChange = (page: number) => vtsStore.setCurrentPage(page);
  
  const handleMapLayerChange = (layerType: 'googleMaps' | 'googleSatellite' | 'googleHybrid' | 'googleTerrain') => {
    vtsStore.setMapLayer(layerType);
    if (window.MapAPI) {
      window.MapAPI.switchTileLayer(MAP_ID, layerType);
    }
  };
  const handleUserClick = (userId: number) => {
    vtsStore.focusOnUser(userId);
    if (window.MapAPI) {
      const map = window.MapAPI.getMap(MAP_ID);
      if (map) {
        const user = vtsStore.users.find(u => u.id === userId);
        if (user?.coordinates) {
          window.MapAPI.setView(MAP_ID, user.coordinates, 16, true); // Smooth animation to location
        } else {
          window.MapAPI.focusOnDavaoCity(MAP_ID);
        }
      }
    }
  };



  // Map initialization
  React.useEffect(() => {
    const initializeMap = () => {
      if (mapRef.current && !mapInitialized.current && window.MapAPI) {
        mapRef.current.id = MAP_ID;
        
        try {
          window.MapAPI.createMap(MAP_ID, {
            center: vtsStore.mapState.center,
            zoom: vtsStore.mapState.zoom,
            scrollWheelZoom: true,
            zoomControl: true,
          });

          // Apply Davao City bounds restriction
          if (window.MapAPI.applyDavaoCityBounds) {
            window.MapAPI.applyDavaoCityBounds(MAP_ID);
          }
          
          // Add zoom event handler to scale markers
          const map = window.MapAPI.getMap(MAP_ID);
          if (map) {
            map.on('zoomend', () => {
              const currentZoom = map.getZoom();
              // Update marker sizes based on zoom level using CSS transform
              const markers = document.querySelectorAll('.live-location-marker');
              const scale = Math.max(1, Math.min(3, currentZoom / 8)); // Scale between 1x-3x
              markers.forEach((marker: any) => {
                marker.style.transform = `scale(${scale})`;
                marker.style.transformOrigin = 'center center';
              });
            });
          }
          
          mapInitialized.current = true;
          vtsStore.setMapInitialized(true);
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      }
    };

    // Try to initialize immediately
    initializeMap();

    // If MapAPI is not ready, retry after a short delay
    if (!window.MapAPI && mapRef.current) {
      const timeout = setTimeout(initializeMap, 500);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (mapInitialized.current && window.MapAPI) {
        window.MapAPI.destroyMap(MAP_ID);
        mapInitialized.current = false;
        vtsStore.setMapInitialized(false);
      }
    };
  }, []);

  // Update markers when users change
  React.useEffect(() => {
    if (mapInitialized.current && window.MapAPI && vtsStore.users.length === 10) {
      // Clear existing markers first
      window.MapAPI.clearMarkers(MAP_ID);
      
      // Add exactly 10 employee markers with detailed information
      vtsStore.users.forEach(user => {
        if (user.coordinates) {
          const marker = window.MapAPI.createStatusMarker(user.status || 'unknown');
          
          const leafletMarker = window.MapAPI.addMarker(MAP_ID, {
            id: `employee-${user.id}`,
            position: user.coordinates,
            // No title or description to prevent popup creation
            icon: marker as any
          });

          // Add click event to marker to automatically select and expand in table + zoom to location
          if (leafletMarker) {
            leafletMarker.on('click', () => {
              // Select employee in table
              (window as any).selectEmployeeFromMap(user.id);
              
              // Zoom to the clicked location
              if (window.MapAPI && user.coordinates) {
                window.MapAPI.setView(MAP_ID, user.coordinates, 18); // Zoom level 18 for close-up view
                
                // Update marker sizes after zoom animation completes
                setTimeout(() => {
                  const markers = document.querySelectorAll('.live-location-marker');
                  const scale = Math.max(1, Math.min(3, 18 / 8)); // Scale for zoom level 18
                  markers.forEach((marker: any) => {
                    marker.style.transform = `scale(${scale})`;
                    marker.style.transformOrigin = 'center center';
                  });
                }, 1500); // Wait for zoom animation to complete
              }
            });
          }
        }
      });
      
      console.log(`Added ${vtsStore.users.length} employee markers to map`);
    }
  }, [vtsStore.users.length, mapInitialized.current]);

  // Helper function to get employee names
  const getEmployeeName = (userId: string) => {
    const names: Record<string, string> = {
      'EMP001': 'Juan Carlos Santos',
      'EMP002': 'Maria Elena Rodriguez',
      'EMP003': 'Roberto Miguel Torres',
      'EMP004': 'Ana Sofia Dela Cruz',
      'EMP005': 'Jose Antonio Reyes',
      'EMP006': 'Carmen Isabella Lopez',
      'EMP007': 'Francisco David Garcia',
      'EMP008': 'Luz Maria Hernandez',
      'EMP009': 'Carlos Eduardo Ramos',
      'EMP010': 'Rosa Linda Mendoza'
    };
    return names[userId] || 'Unknown Employee';
  };

  // Helper function to get employee positions
  const getEmployeePosition = (userId: string) => {
    const positions: Record<string, string> = {
      'EMP001': 'Field Supervisor',
      'EMP002': 'Water Quality Inspector',
      'EMP003': 'Pipe Maintenance Technician',
      'EMP004': 'Meter Reader Supervisor',
      'EMP005': 'Emergency Response Coordinator',
      'EMP006': 'Customer Service Representative',
      'EMP007': 'Network Engineer',
      'EMP008': 'Billing Collector',
      'EMP009': 'Pump Station Operator',
      'EMP010': 'Distribution Manager'
    };
    return positions[userId] || 'Staff Member';
  };

  // Helper function to get location names
  const getLocationName = (userId: string) => {
    const locations: Record<string, string> = {
      'EMP001': 'Poblacion District (Downtown)',
      'EMP002': 'Buhangin Area',
      'EMP003': 'Calinan District',
      'EMP004': 'Mintal Area',
      'EMP005': 'Tugbok District',
      'EMP006': 'Talomo Area',
      'EMP007': 'Marilog District',
      'EMP008': 'Agdao Area',
      'EMP009': 'Ma-a District',
      'EMP010': 'Panacan Area'
    };
    return locations[userId] || 'Unknown Location';
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#00ff00'; // Green
      case 'offline': return '#ff0000'; // Red
      case 'unknown': return '#ffff00'; // Yellow
      default: return '#0000ff'; // Blue
    }
  };



  // Computed values from store
  const { totalItems, totalPages, startIndex, endIndex, paginatedUsers, currentPage, pageSize, pageNumbers } = {
    totalItems: vtsStore.totalItems,
    totalPages: vtsStore.totalPages,
    startIndex: vtsStore.startIndex,
    endIndex: vtsStore.endIndex,
    paginatedUsers: vtsStore.paginatedUsers,
    currentPage: vtsStore.currentPage,
    pageSize: vtsStore.pageSize,
    pageNumbers: vtsStore.pageNumbers
  };

  // Dynamic map layer items with handlers
  const mapLayerItems = MAP_LAYER_ITEMS.map(item => ({
    ...item,
    onClick: () => handleMapLayerChange(item.key as any)
  }));

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
                  options={PAGE_SIZE_OPTIONS}
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
                <>
                  <Table
                    columns={TABLE_COLUMNS}
                    dataSource={paginatedUsers}
                    pagination={false}
                    size="small"
                    scroll={{ y: 'calc(100vh - 450px)' }}
                    className="vts-user-table"
                    rowKey="id"
                    expandable={{
                      expandedRowKeys: selectedEmployeeId ? [selectedEmployeeId] : [],
                      onExpand: (expanded, record) => {
                        if (expanded) {
                          // Close any previously open row and open this one
                          setSelectedEmployeeId(record.id);
                          setSelectedEmployee(record);
                          handleUserClick(record.id);
                        } else {
                          // Close the expanded row
                          setSelectedEmployeeId(null);
                          setSelectedEmployee(null);
                        }
                      },
                      expandedRowRender: (record) => (
                        <div style={{
                          padding: '12px 16px',
                          backgroundColor: '#f8f9fa',
                          margin: '0 -16px',
                          borderTop: '1px solid #e9ecef'
                        }}>
                          <div style={{ marginBottom: '8px' }}>
                            <Text strong style={{ fontSize: '13px', color: '#1890ff' }}>
                              Employee Details - {record.userId}
                            </Text>
                          </div>
                          
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: '1fr 1fr', 
                            gap: '8px 16px', 
                            fontSize: '12px',
                            lineHeight: '1.4'
                          }}>
                            <div><Text strong>Name:</Text> {getEmployeeName(record.userId)}</div>
                            <div><Text strong>Position:</Text> {getEmployeePosition(record.userId)}</div>
                            <div><Text strong>Department:</Text> {record.department}</div>
                            <div><Text strong>Location:</Text> {getLocationName(record.userId)}</div>
                            <div>
                              <Text strong>Status:</Text> 
                              <span style={{ color: getStatusColor(record.status || 'unknown'), marginLeft: '4px' }}>
                                {(record.status || 'unknown').toUpperCase()}
                              </span>
                            </div>
                            <div><Text strong>Last Update:</Text> {record.lastSeen}</div>
                            <div><Text strong>Device:</Text> {record.deviceName}</div>
                            {record.coordinates && (
                              <div><Text strong>Coordinates:</Text> {record.coordinates[0].toFixed(4)}, {record.coordinates[1].toFixed(4)}</div>
                            )}
                          </div>
                        </div>
                      ),
                      rowExpandable: () => true,
                    }}
                    onRow={(record) => ({
                      onClick: () => {
                        // Always close any previously opened row and open the clicked one
                        // If clicking the same row that's already open, close it
                        if (selectedEmployeeId === record.id) {
                          setSelectedEmployeeId(null);
                          setSelectedEmployee(null);
                        } else {
                          // Close any other open row and open this one
                          setSelectedEmployeeId(record.id);
                          setSelectedEmployee(record);
                          handleUserClick(record.id);
                        }
                      },
                      className: selectedEmployeeId === record.id ? 'selected-row' : '',
                    })}
                  />
                </>
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
