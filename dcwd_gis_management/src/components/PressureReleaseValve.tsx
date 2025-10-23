import React, { useEffect } from 'react';
import { Card, Typography, Table, Spin, Alert, Input, Select, Button, Space } from 'antd';

import PressureReleaseValveModal from './modal/PressureReleaseValveModal';
import type { ColumnsType } from 'antd/es/table';

import { observer } from 'mobx-react-lite';
import { prvStore } from '../stores/prvStore';
import { apiGis } from './endpoints/Interceptor';
import Footer from './layout/Footer';

const { Title, Text } = Typography;

interface PressureReleaseValveRecord {
  key: string;
  id: number;
  prvNumber: string;
  location: string;
  status: string;
  // Add other fields as needed from API
}




const PressureReleaseValve: React.FC = observer(() => {
  useEffect(() => {
    const fetchData = async () => {
      prvStore.setLoading(true);
      prvStore.setError(null);
      try {
        const res = await apiGis.get('helpers/gis/mgtsys/getLayers/getPrv.php');
        const data = (Array.isArray(res.data.data) ? res.data.data : []).map((item: any, idx: number) => ({
          key: item.prv_number || String(idx),
          id: idx + 1,
          prvNumber: item.prv_number || '',
          location: item.location || '',
          status: item.status_remarks || '',
          // Include coordinate fields for the map
          lat: item.lat,
          lon: item.lon,
          longitude: item.longitude,
          latitude: item.latitude,
          geom: item.geom,
          ...item,
        }));
        prvStore.setData(data);
      } catch (err) {
        prvStore.setError(err);
      } finally {
        prvStore.setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { currentPage, pageSize, filteredData } = prvStore;
  
  // Pagination helpers (License.tsx style)
  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);
    const newTotalPages = Math.ceil(filteredData.length / newPageSize);
    prvStore.setPageSize(newPageSize);
    // Adjust current page if it would be out of bounds with the new page size
    if (currentPage > newTotalPages && newTotalPages > 0) {
      prvStore.setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      prvStore.setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / prvStore.pageSize);
    // Ensure page is within valid bounds
    if (page >= 1 && page <= totalPages) {
      prvStore.setCurrentPage(page);
    }
  };

  const handleSearch = (value: string) => {
    prvStore.setSearch(value);
    prvStore.setCurrentPage(1); // Reset to first page when searching
  };
  const columns: ColumnsType<PressureReleaseValveRecord> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80, render: (_: any, _record: PressureReleaseValveRecord, index) => (currentPage - 1) * pageSize + index + 1 },
    { title: 'PRV Number', dataIndex: 'prvNumber', key: 'prvNumber' },
    { title: 'Location', dataIndex: 'location', key: 'location', ellipsis: true },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 160 },
    {
      title: '',
      key: 'actions',
      width: 80,
      align: 'center' as const,
      render: (_: any, _record: PressureReleaseValveRecord) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button
            className="license-table-action-button"
            onClick={() => { prvStore.setSelectedRecord(_record); prvStore.setModalVisible(true); }}
            title="View Details"
          >
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div style={{ padding: 24, background: 'var(--bg-secondary, #f7f9fc)', minHeight: '100vh' }}>
        <Card style={{ borderRadius: '12px 12px 12px 12px', marginTop: 0 }}>
          <div style={{ background: 'var(--primary-hover-bg, #f2f7fd)', borderRadius: '12px 12px 0 0', padding: '18px 32px 12px 32px', marginLeft: '-24px', marginRight: '-24px', marginTop: '-24px', marginBottom: 24 }}>
            <span style={{ color: 'var(--primary-color, #1890ff)', fontWeight: 600, fontSize: 22, letterSpacing: 0.2 }}>Pressure Release Valve - Maintenance</span>
          </div>
          <div style={{ marginBottom: 24 }}>
            <Title level={5} style={{ color: 'var(--text-secondary, #666)', marginBottom: 8 }}>Instructions:</Title>
            <Text style={{ color: 'var(--text-tertiary, #999)' }}>Instruction: Double Click row to edit Details.</Text>
          </div>

          <div className="license-controls-container">
            <div className="license-display-controls">
              <Text className="license-control-text">Display</Text>
              <Select
                value={prvStore.pageSize.toString()}
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

          {prvStore.isLoading ? <Spin /> : prvStore.error ? <Alert type="error" message="Failed to load data" /> : (() => {
            // Simple pagination logic (License.tsx style)
            const totalItems = filteredData.length;
            const totalPages = Math.ceil(totalItems / prvStore.pageSize);
            const startIndex = (prvStore.currentPage - 1) * prvStore.pageSize;
            const endIndex = Math.min(startIndex + prvStore.pageSize, totalItems);
            const paginatedData = filteredData.slice(startIndex, endIndex);

            // Generate page numbers for pagination (License.tsx style)
            const getPageNumbers = () => {
              const pages = [];
              const maxVisiblePages = 5;
              const currentPage = prvStore.currentPage;
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

            return <>
              <Table
                key={`prv-table-page-${prvStore.currentPage}-size-${prvStore.pageSize}`}
                columns={columns as any}
                dataSource={paginatedData}
                pagination={false}
                rowKey={(r: PressureReleaseValveRecord) => `prv-${r.prvNumber}-${r.id}`}
                onRow={(record: PressureReleaseValveRecord) => ({
                  onDoubleClick: () => {
                    prvStore.setSelectedRecord(record);
                    prvStore.setModalVisible(true);
                  },
                })}
                bordered
                style={{ background: 'var(--bg-primary, #fff)', borderRadius: 8 }}
              />
              {/* Pagination (License.tsx style) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8, marginTop: 16 }}>
                <Text style={{ fontSize: 12 }}>
                  Showing {totalItems > 0 ? startIndex + 1 : 0} to {totalItems > 0 ? endIndex : 0} of {totalItems} entries
                  {prvStore.search && ` (filtered from ${prvStore.data?.length || 0} total entries)`}
                </Text>
                <Space>
                  <Button size="small" disabled={prvStore.currentPage === 1 || totalItems === 0} onClick={() => handlePageChange(prvStore.currentPage - 1)}>Previous</Button>
                  {totalItems > 0 ? getPageNumbers().map(pageNum => (
                    <Button 
                      key={pageNum} 
                      size="small" 
                      type={pageNum === prvStore.currentPage ? 'primary' : 'default'} 
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )) : (
                    <Button size="small" disabled>1</Button>
                  )}
                  <Button size="small" disabled={prvStore.currentPage === totalPages || totalPages === 0 || totalItems === 0} onClick={() => handlePageChange(prvStore.currentPage + 1)}>Next</Button>
                </Space>
              </div>
            </>;
          })()}

          <PressureReleaseValveModal
            visible={prvStore.modalVisible}
            record={prvStore.selectedRecord}
            onCancel={() => prvStore.setModalVisible(false)}
            onUpdate={() => {
              prvStore.setModalVisible(false);
            }}
          />
        </Card>
      </div>
      <Footer />
    </>
  );
});

export default PressureReleaseValve;
