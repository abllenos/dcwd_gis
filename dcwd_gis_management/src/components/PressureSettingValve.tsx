import React, { useEffect } from 'react';
import { Card, Typography, Select, Input, Table, Button } from 'antd';
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

  const { currentPage, pageSize, setCurrentPage, filteredData } = psvStore;
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
              <span>Display</span>
              <Select value={String(psvStore.pageSize)} onChange={(v: string) => psvStore.setPageSize(Number(v))} size="small" style={{ width: 90 }} options={[{label:'10',value:'10'},{label:'25',value:'25'},{label:'50',value:'50'}]} />
              <span>records per page</span>
            </div>
            <div className="license-search-controls">
              <span>Search:</span>
              <Search placeholder="Search..." allowClear enterButton onSearch={(v: string) => psvStore.setSearch(v)} size="small" style={{ width: 200 }} />
            </div>
          </div>

          {!psvStore.isLoading && !psvStore.error && (() => {
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
                columns={columns}
                dataSource={paginatedData}
                pagination={false}
                rowKey={(r) => r.psv_number}
                onRow={(record) => ({ onDoubleClick: () => { psvStore.setSelected(record); psvStore.setModalVisible(true); } })}
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

          <PressureSettingValveModal
            visible={psvStore.modalVisible}
            record={psvStore.selected}
            onCancel={() => psvStore.setModalVisible(false)}
            onUpdate={() => { console.log('update', psvStore.selected); psvStore.setModalVisible(false); }}
          />
          <PressureSettingValveDetailsModal
            visible={detailsModalVisible}
            record={detailsRecord}
            onCancel={() => setDetailsModalVisible(false)}
          />
        </Card>
      </div>
      <Footer />
    </>
  );
});

export default PressureSettingValve;
