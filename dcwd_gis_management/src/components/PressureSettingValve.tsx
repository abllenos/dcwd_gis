import React, { useEffect } from 'react';


import { Card, Typography, Select, Input, Table, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import PressureSettingValveModal from './modal/PressureSettingValveModal';
import PressureSettingValveDetailsModal from './modal/PressureSettingValveDetailsModal';
import Footer from './layout/Footer';

import { observer } from 'mobx-react-lite';
import { psvStore } from '../stores/psvStore';
import { apiGis } from './endpoints/Interceptor';

const { Title, Text } = Typography;
const { Search } = Input;

interface PSVRecord {
  psv_number: string;
  accountnumber: string;
  location: string;
  meter_number: string;
  size: number;
  brand_name: string;
  pressure_setting: string;
  remarks: string;
}

const PressureSettingValve: React.FC = observer(() => {
  useEffect(() => {
    const fetchData = async () => {
      psvStore.setLoading(true);
      psvStore.setError(null);
      try {
        const res = await apiGis.get('helpers/gis/mgtsys/getLayers/getPsv.php');
        const data = Array.isArray(res.data.data) ? res.data.data : [];
        psvStore.setData(data);
      } catch (err) {
        psvStore.setError(err);
      } finally {
        psvStore.setLoading(false);
      }
    };
    fetchData();
  }, []);

  // State for details modal
  const [detailsModalVisible, setDetailsModalVisible] = React.useState(false);

  const [detailsRecord] = React.useState<PSVRecord | null>(null);

  const { currentPage, pageSize, filteredData } = psvStore;
  
  // Pagination helpers (License.tsx style)
  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);
    const newTotalPages = Math.ceil(filteredData.length / newPageSize);
    psvStore.setPageSize(newPageSize);
    // Adjust current page if it would be out of bounds with the new page size
    if (currentPage > newTotalPages && newTotalPages > 0) {
      psvStore.setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      psvStore.setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / psvStore.pageSize);
    // Ensure page is within valid bounds
    if (page >= 1 && page <= totalPages) {
      psvStore.setCurrentPage(page);
    }
  };

  const handleSearch = (value: string) => {
    psvStore.setSearch(value);
    psvStore.setCurrentPage(1); // Reset to first page when searching
  };
  const columns: ColumnsType<PSVRecord> = [
    {
      title: '#',
      key: 'index',
      render: (_text, _record, index) => (currentPage - 1) * pageSize + index + 1,
      width: 60,
    },
    { title: 'PSV Number', dataIndex: 'psv_number', key: 'psv_number' },
    { title: 'Account Number', dataIndex: 'accountnumber', key: 'accountnumber' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
    { title: 'Meter Number', dataIndex: 'meter_number', key: 'meter_number' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Brand Description', dataIndex: 'brand_name', key: 'brand_name' },
    { title: 'Pressure Setting', dataIndex: 'pressure_setting', key: 'pressure_setting' },
    { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' },
    {
      title: '',
      key: 'actions',
      width: 80,
      align: 'center' as const,
      render: (_: any, _record: PSVRecord) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button
            className="license-table-action-button"
            onClick={() => { psvStore.setSelected(_record); psvStore.setModalVisible(true); }}
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
        {/* Always show loading/error/debug info at the top */}
        <div style={{ marginBottom: 16 }}>
          {psvStore.isLoading && <div style={{ color: '#2563eb', fontWeight: 600 }}>Loading...</div>}
          {psvStore.error && <div style={{ color: 'red', fontWeight: 600 }}>Error: {psvStore.error.message}</div>}
        </div>
        <div style={{ background: '#e9edfa', borderRadius: '12px 12px 0 0', padding: '18px 32px 12px 32px', marginBottom: 0 }}>
          <span style={{ color: '#3a5fc8', fontWeight: 600, fontSize: 22, letterSpacing: 0.2 }}>Pressure Setting Valves</span>
        </div>
        <Card style={{ borderRadius: '0 0 12px 12px', marginTop: 0 }}>
          <div style={{ marginBottom: 24 }}>
            <Title level={5} style={{ color: '#666', marginBottom: 8 }}>Instructions:</Title>
            <Text style={{ color: '#999' }}>Double click a row to edit details or use the action button.</Text>
          </div>

          <div className="license-controls-container">
            <div className="license-display-controls">
              <Text className="license-control-text">Display</Text>
              <Select
                value={psvStore.pageSize.toString()}
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

          {(() => {
            // Simple pagination logic (License.tsx style)
            const totalItems = filteredData.length;
            const totalPages = Math.ceil(totalItems / psvStore.pageSize);
            const startIndex = (psvStore.currentPage - 1) * psvStore.pageSize;
            const endIndex = Math.min(startIndex + psvStore.pageSize, totalItems);
            const paginatedData = filteredData.slice(startIndex, endIndex);

            // Generate page numbers for pagination (License.tsx style)
            const getPageNumbers = () => {
              const pages = [];
              const maxVisiblePages = 5;
              const currentPage = psvStore.currentPage;
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
                key={`psv-table-page-${psvStore.currentPage}-size-${psvStore.pageSize}`}
                columns={columns}
                dataSource={paginatedData}
                pagination={false}
                rowKey={(r) => `psv-${r.psv_number}-${r.accountnumber}`}
                onRow={(record) => ({ onDoubleClick: () => { psvStore.setSelected(record); psvStore.setModalVisible(true); } })}
                bordered
                style={{ background: '#fff', borderRadius: 8 }}
              />
              {/* Pagination (License.tsx style) */}
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8, marginTop: 16 }}>
                <Text style={{ fontSize: 12 }}>
                  Showing {totalItems > 0 ? startIndex + 1 : 0} to {totalItems > 0 ? endIndex : 0} of {totalItems} entries
                  {psvStore.search && ` (filtered from ${psvStore.data?.length || 0} total entries)`}
                </Text>
                <Space>
                  <Button size="small" disabled={psvStore.currentPage === 1 || totalItems === 0} onClick={() => handlePageChange(psvStore.currentPage - 1)}>Previous</Button>
                  {totalItems > 0 ? getPageNumbers().map(pageNum => (
                    <Button 
                      key={pageNum} 
                      size="small" 
                      type={pageNum === psvStore.currentPage ? 'primary' : 'default'} 
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )) : (
                    <Button size="small" disabled>1</Button>
                  )}
                  <Button size="small" disabled={psvStore.currentPage === totalPages || totalPages === 0 || totalItems === 0} onClick={() => handlePageChange(psvStore.currentPage + 1)}>Next</Button>
                </Space>
              </div>
            </>;
          })()}

          <PressureSettingValveModal
            visible={psvStore.modalVisible}
            record={psvStore.selected}
            onCancel={() => psvStore.setModalVisible(false)}
            onUpdate={() => { console.log('update', psvStore.selected); psvStore.setModalVisible(false); }}
          />
        )}

        <PressureSettingValveModal
          visible={psvStore.modalVisible}
          record={psvStore.selected}
          onCancel={() => psvStore.setModalVisible(false)}
          onUpdate={() => { console.log('update', psvStore.selected); psvStore.setModalVisible(false); }}
        />
        <PressureSettingValveDetailsModal
          visible={detailsModalVisible}
          record={psvStore.selected}
          onCancel={() => setDetailsModalVisible(false)}
        />
      </Card>
    </div>

  );
});

export default PressureSettingValve;
