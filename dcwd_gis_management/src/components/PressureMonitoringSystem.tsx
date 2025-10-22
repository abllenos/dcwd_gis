import { observer } from 'mobx-react-lite';
import { Table, Input, Select, Button, Typography, Card, Space, Spin, Alert } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import PmsMaintenanceModal from './modal/PmsMaintenanceModal';
import { pressureMonitoringSystemStore } from '../stores/pressureMonitoringSystemStore';
import { useQuery } from '@tanstack/react-query';
import { apiGis } from './endpoints/Interceptor';
import Footer from './layout/Footer';

const { Text } = Typography;

interface PMSRecord {
  id: number;
  pmsNumber: string;
  location: string;
  // Add other fields as needed from API
}

// Fetch function for PMS data
const fetchPMSData = async (): Promise<PMSRecord[]> => {
  // Get token from localStorage and send only as query param (no Authorization header)
  const token = localStorage.getItem('token');
  const url = token
    ? `helpers/gis/mgtsys/getLayers/getPMS.php?token=${encodeURIComponent(token)}`
    : 'helpers/gis/mgtsys/getLayers/getPMS.php';
  const res = await apiGis.get(url);
  // Map API data to PMSRecord shape
  return (Array.isArray(res.data.data) ? res.data.data : []).map((item: any, idx: number) => ({
    id: idx + 1,
    pmsNumber: item.pms_number || '',
    location: item.location || '',
    ...item,
  }));
};

const PressureMonitoringSystem = observer(() => {
  // Fetch PMS data
  const { data, isLoading, error } = useQuery<PMSRecord[]>({
    queryKey: ['pmsData'],
    queryFn: fetchPMSData,
  });

  const { currentPage, pageSize, search } = pressureMonitoringSystemStore;
  
  // Pagination helpers (License.tsx style)
  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);
    const filteredData = (data || []).filter(
      row =>
        row.pmsNumber.toLowerCase().includes(search.toLowerCase()) ||
        row.location.toLowerCase().includes(search.toLowerCase())
    );
    const newTotalPages = Math.ceil(filteredData.length / newPageSize);
    pressureMonitoringSystemStore.setPageSize(newPageSize);
    // Adjust current page if it would be out of bounds with the new page size
    if (currentPage > newTotalPages && newTotalPages > 0) {
      pressureMonitoringSystemStore.setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      pressureMonitoringSystemStore.setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    const filteredData = (data || []).filter(
      row =>
        row.pmsNumber.toLowerCase().includes(search.toLowerCase()) ||
        row.location.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredData.length / pressureMonitoringSystemStore.pageSize);
    // Ensure page is within valid bounds
    if (page >= 1 && page <= totalPages) {
      pressureMonitoringSystemStore.setCurrentPage(page);
    }
  };

  const handleSearch = (value: string) => {
    pressureMonitoringSystemStore.setSearch(value);
    pressureMonitoringSystemStore.setCurrentPage(1); // Reset to first page when searching
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a: any, b: any) => a.id - b.id,
      width: 60,
      render: (_: any, _record: PMSRecord, index: number) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'PMS Number',
      dataIndex: 'pmsNumber',
    },
    {
      title: 'Location',
      dataIndex: 'location',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: any, _record: PMSRecord) => (
        <Space>
          <Button
            type="primary"
            shape="circle"
            icon={<ToolOutlined />}
            style={{ background: '#16c784', border: 'none' }}
            onClick={() => pressureMonitoringSystemStore.setModalOpen(true)}
          />
        </Space>
      ),
    },
  ];
  const filteredData = (data || []).filter(
    row =>
      row.pmsNumber.toLowerCase().includes(search.toLowerCase()) ||
      row.location.toLowerCase().includes(search.toLowerCase())
  );

  // Simple pagination logic (License.tsx style)
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pressureMonitoringSystemStore.pageSize);
  const startIndex = (pressureMonitoringSystemStore.currentPage - 1) * pressureMonitoringSystemStore.pageSize;
  const endIndex = Math.min(startIndex + pressureMonitoringSystemStore.pageSize, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Generate page numbers for pagination (License.tsx style)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const currentPage = pressureMonitoringSystemStore.currentPage;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
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

  return (
    <>
      <div style={{ padding: 24, background: 'var(--bg-secondary, #f7f9fc)', minHeight: '100vh' }}>
        <Card style={{ borderRadius: '12px 12px 12px 12px', marginTop: 0 }}>
          <div style={{ background: 'var(--primary-hover-bg, #f2f7fd)', borderRadius: '12px 12px 0 0', padding: '18px 32px 12px 32px', marginLeft: '-24px', marginRight: '-24px', marginTop: '-24px', marginBottom: 24 }}>
            <span style={{ color: 'var(--primary-color, #1890ff)', fontWeight: 600, fontSize: 22, letterSpacing: 0.2 }}>Pressure Monitoring System - Maintenance</span>
          </div>
          <div className="license-controls-container">
            <div className="license-display-controls">
              <Text className="license-control-text">Display</Text>
              <Select
                value={pressureMonitoringSystemStore.pageSize.toString()}
                onChange={handlePageSizeChange}
                size="small"
                style={{ width: 80 }}
                options={[
                  { value: '10', label: '10' },
                  { value: '25', label: '25' },
                  { value: '50', label: '50' },
                  { value: '100', label: '100' }
                ]}
              />
              <Text className="license-control-text">records per page</Text>
            </div>
            <div className="license-search-controls">
              <Text className="license-control-text">Search:</Text>
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
          {isLoading ? <Spin /> : error ? <Alert type="error" message="Failed to load data" /> : (
            <>
              <Table
                key={`pms-table-page-${pressureMonitoringSystemStore.currentPage}-size-${pressureMonitoringSystemStore.pageSize}`}
                bordered
                rowKey={(record) => `pms-${record.pmsNumber}-${record.id}`}
                columns={columns}
                dataSource={paginatedData}
                pagination={false}
                style={{ background: '#fff', borderRadius: 8 }}
              />
              {/* Pagination (License.tsx style) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8, marginTop: 16 }}>
                <Text style={{ fontSize: 12 }}>
                  Showing {totalItems > 0 ? startIndex + 1 : 0} to {totalItems > 0 ? endIndex : 0} of {totalItems} entries
                  {pressureMonitoringSystemStore.search && ` (filtered from ${data?.length || 0} total entries)`}
                </Text>
                <Space>
                  <Button size="small" disabled={pressureMonitoringSystemStore.currentPage === 1 || totalItems === 0} onClick={() => handlePageChange(pressureMonitoringSystemStore.currentPage - 1)}>Previous</Button>
                  {totalItems > 0 ? getPageNumbers().map(pageNum => (
                    <Button 
                      key={pageNum} 
                      size="small" 
                      type={pageNum === pressureMonitoringSystemStore.currentPage ? 'primary' : 'default'} 
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )) : (
                    <Button size="small" disabled>1</Button>
                  )}
                  <Button size="small" disabled={pressureMonitoringSystemStore.currentPage === totalPages || totalPages === 0 || totalItems === 0} onClick={() => handlePageChange(pressureMonitoringSystemStore.currentPage + 1)}>Next</Button>
                </Space>
              </div>
            </>
          )}
          <PmsMaintenanceModal open={pressureMonitoringSystemStore.modalOpen} onClose={() => pressureMonitoringSystemStore.setModalOpen(false)} />
        </Card>
      </div>
      <Footer />
    </>
  );
});

export default PressureMonitoringSystem;
