import React, { useEffect } from 'react';
import { Card, Typography, Table, Spin, Alert, Input, Button } from 'antd';
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

  const { currentPage, pageSize, setCurrentPage, filteredData } = prvStore;
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
        <div style={{ background: '#e9edfa', borderRadius: '12px 12px 0 0', padding: '18px 32px 12px 32px', marginBottom: 0 }}>
          <span style={{ color: '#3a5fc8', fontWeight: 600, fontSize: 22, letterSpacing: 0.2 }}>Pressure Release Valve - Maintenance</span>
        </div>
        <Card style={{ borderRadius: '0 0 12px 12px', marginTop: 0 }}>
          <div style={{ marginBottom: 24 }}>
            <Title level={5} style={{ color: '#666', marginBottom: 8 }}>Instructions:</Title>
            <Text style={{ color: '#999' }}>Instruction: Double Click row to edit Details.</Text>
          </div>

          <div className="license-controls-container">
            <div className="license-display-controls">
              <span>Display</span>
              <select value={String(prvStore.pageSize)} onChange={(e) => prvStore.setPageSize(Number(e.target.value))} style={{ width: 80, padding: 6, borderRadius: 4 }}>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>records per page</span>
            </div>
            <div className="license-search-controls">
              <span>Search:</span>
              <Input.Search
                placeholder="Search..."
                size="small"
                allowClear
                enterButton
                value={prvStore.search}
                onChange={(e) => prvStore.setSearch(e.target.value)}
                style={{ width: 200 }}
              />
            </div>
          </div>

          {prvStore.isLoading ? <Spin /> : prvStore.error ? <Alert type="error" message="Failed to load data" /> : (() => {
            // Manual pagination logic
            const totalItems = filteredData.length;
            const pageCount = Math.ceil(totalItems / pageSize);
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalItems);
            const paginatedData = filteredData.slice(startIndex, endIndex);

            const getPageNumbers = () => {
              const pages = [];
              const maxVisiblePages = 5;
              if (pageCount <= maxVisiblePages) {
                for (let i = 1; i <= pageCount; i++) pages.push(i);
              } else {
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);
                if (endPage - startPage < maxVisiblePages - 1) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }
                for (let i = startPage; i <= endPage; i++) pages.push(i);
              }
              return pages;
            };

            return <>
              <Table
                columns={columns as any}
                dataSource={paginatedData}
                pagination={false}
                rowKey={(r: PressureReleaseValveRecord) => r.key}
                onRow={(record: PressureReleaseValveRecord) => ({
                  onDoubleClick: () => {
                    prvStore.setSelectedRecord(record);
                    prvStore.setModalVisible(true);
                  },
                })}
                bordered
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, flexWrap: 'wrap', rowGap: 8 }}>
                <span style={{ fontSize: 12 }}>
                  Showing {totalItems > 0 ? startIndex + 1 : 0} to {totalItems > 0 ? endIndex : 0} of {totalItems} entries
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    disabled={currentPage === 1}
                    style={{ padding: '2px 8px', borderRadius: 4, border: '1px solid #d9d9d9', background: currentPage === 1 ? '#f5f5f5' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >Previous</button>
                  {getPageNumbers().map(pageNum => (
                    <button
                      key={pageNum}
                      style={{ padding: '2px 8px', borderRadius: 4, border: '1px solid #d9d9d9', background: pageNum === currentPage ? '#2563eb' : '#fff', color: pageNum === currentPage ? '#fff' : '#222', fontWeight: pageNum === currentPage ? 600 : 400, cursor: 'pointer' }}
                      onClick={() => setCurrentPage(pageNum)}
                    >{pageNum}</button>
                  ))}
                  <button
                    disabled={currentPage === pageCount || pageCount === 0}
                    style={{ padding: '2px 8px', borderRadius: 4, border: '1px solid #d9d9d9', background: currentPage === pageCount || pageCount === 0 ? '#f5f5f5' : '#fff', cursor: currentPage === pageCount || pageCount === 0 ? 'not-allowed' : 'pointer' }}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >Next</button>
                </div>
              </div>
            </>;
          })()}

          <PressureReleaseValveModal
            visible={prvStore.modalVisible}
            record={prvStore.selectedRecord}
            onCancel={() => prvStore.setModalVisible(false)}
            onUpdate={() => {
              console.log('Updated', prvStore.selectedRecord);
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
