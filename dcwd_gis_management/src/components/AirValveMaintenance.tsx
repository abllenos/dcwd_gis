import React, { useMemo, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { airValveStore } from '../stores/airValveStore';
import { Card, Typography, Table, Spin, Alert, Input } from 'antd';

import AirValveModal from './modal/AirValveModal';
import AirValveDetailsModal from './modal/AirValveDetailsModal';
import type { ColumnsType } from 'antd/es/table';
import { useQuery } from '@tanstack/react-query';
import { devApi } from './endpoints/Interceptor';
import Footer from './layout/Footer';

const { Title, Text } = Typography;

interface AirValveRecord {
  id: number;
  arv_number: string;
  location: string;
  status: string;
  wonumber: string;
  barangay: string;
  geom: string;
  lon: number;
  lat: number;
  date_installed?: string;
  water_source?: string;
  arv_serial_no?: string;
  type?: string;
  size?: string;
  brand?: string;
  gate_serial_no?: string;
  gate_valve_size?: string;
  gate_valve_brand?: string;
  no_of_turns?: string;
  depth?: string;
  remarks?: string;
  project_title?: string;
  hotlink?: string;
}

const fetchAirValves = async (): Promise<AirValveRecord[]> => {
  const res = await devApi.get('admin/airvalve/get');
  const arr = res.data?.data?.data || [];
  return arr.map((item: any, idx: number) => ({
    id: item.gid ?? idx + 1,
    arv_number: item.arv_Number || '',
    location: item.location || '',
    status: item.type || '',
    wonumber: item.wonumber || '',
    barangay: item.barangay || '',
    geom: item.geom || '',
    lon: item.lon || 0,
    lat: item.lat || 0,
    ...item,
  }));
};


const AirValveMaintenance: React.FC = observer(() => {
  const { setSearch, search, modalVisible, setModalVisible, selectedRecord, setSelectedRecord } = airValveStore;

  const { data, isLoading, error } = useQuery<AirValveRecord[]>({
    queryKey: ['airValveData'],
    queryFn: fetchAirValves,
  });
  // Sync MobX store with fetched data on load
  useEffect(() => {
    if (data) airValveStore.setData(data);
  }, [data]);

  const columns: ColumnsType<AirValveRecord> = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: 'AV Number', dataIndex: 'arv_number', key: 'arv_number' },
  { title: 'WO Number', dataIndex: 'wonumber', key: 'wonumber' },
  { title: 'Barangay', dataIndex: 'barangay', key: 'barangay' },
  { title: 'Location', dataIndex: 'location', key: 'location', ellipsis: true },
  { title: 'Type', dataIndex: 'status', key: 'status', width: 140 },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      align: 'center' as const,
      render: (_: any, _record: AirValveRecord) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button
            className="license-table-action-button"
            onClick={() => {
              airValveStore.setDetailsRecord(_record);
              airValveStore.setDetailsModalVisible(true);
            }}
            title="View Details"
          >
          </button>
        </div>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    const arr: AirValveRecord[] = airValveStore.data;
    if (!q) return arr;
    return arr.filter((r: AirValveRecord) =>
      String(r.id).includes(q) ||
      (r.arv_number?.toLowerCase() ?? '').includes(q) ||
      (r.location?.toLowerCase() ?? '').includes(q) ||
      (r.status?.toLowerCase() ?? '').includes(q)
    );
  }, [search, airValveStore.data]);

  const pageSize = 10; // Default to 10 records per page

  return (
    <div style={{ padding: 24, background: 'var(--bg-secondary, #f7f9fc)', minHeight: '100vh' }}>
      <div style={{ background: '#e9edfa', borderRadius: '12px 12px 0 0', padding: '18px 32px 12px 32px', marginBottom: 0 }}>
        <span style={{ color: '#3a5fc8', fontWeight: 600, fontSize: 22, letterSpacing: 0.2 }}>Air Valve - Maintenance</span>
      </div>
      <Card style={{ borderRadius: '0 0 12px 12px', marginTop: 0 }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={5} style={{ color: '#666', marginBottom: 8 }}>
            Instructions:
          </Title>
          <Text style={{ color: '#999' }}>Instruction: Double Click row to edit Details.</Text>
        </div>

        <div className="license-controls-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ flexGrow: 1 }}></div> {/* Empty space to push the search bar to the right */}
          <div className="license-search-controls" style={{ display: 'flex', alignItems: 'center', marginTop: -8 }}>
            <span>Search:</span>
            <Input.Search
              placeholder="Search..."
              size="small"
              allowClear
              enterButton
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 200, marginLeft: 8 }}
            />
          </div>
        </div>

        {isLoading ? <Spin /> : error ? <Alert type="error" message="Failed to load data" /> : (
          (() => {
            // Manual pagination logic
            const totalItems = filteredData.length;
            const pageCount = Math.ceil(totalItems / pageSize);
            const currentPage = airValveStore.currentPage || 1;
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
                rowKey={(r: AirValveRecord) => r.id}
                onRow={(record: AirValveRecord) => ({
                  onDoubleClick: () => {
                    setSelectedRecord(record);
                    setModalVisible(true);
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
                    onClick={() => airValveStore.setCurrentPage(currentPage - 1)}
                  >Previous</button>
                  {getPageNumbers().map(pageNum => (
                    <button
                      key={pageNum}
                      style={{ padding: '2px 8px', borderRadius: 4, border: '1px solid #d9d9d9', background: pageNum === currentPage ? '#2563eb' : '#fff', color: pageNum === currentPage ? '#fff' : '#222', fontWeight: pageNum === currentPage ? 600 : 400, cursor: 'pointer' }}
                      onClick={() => airValveStore.setCurrentPage(pageNum)}
                    >{pageNum}</button>
                  ))}
                  <button
                    disabled={currentPage === pageCount || pageCount === 0}
                    style={{ padding: '2px 8px', borderRadius: 4, border: '1px solid #d9d9d9', background: currentPage === pageCount || pageCount === 0 ? '#f5f5f5' : '#fff', cursor: currentPage === pageCount || pageCount === 0 ? 'not-allowed' : 'pointer' }}
                    onClick={() => airValveStore.setCurrentPage(currentPage + 1)}
                  >Next</button>
                </div>
              </div>
            </>;
          })()
        )}
        <AirValveModal
          visible={modalVisible}
          record={selectedRecord}
          onCancel={() => setModalVisible(false)}
          onUpdate={(updated) => {
            airValveStore.updateRecord(updated);
            setModalVisible(false);
          }}
        />
        <AirValveDetailsModal
          visible={airValveStore.detailsModalVisible}
          record={airValveStore.detailsRecord}
          onCancel={() => airValveStore.setDetailsModalVisible(false)}
        />
      </Card>
      
      <Footer />
    </div>
  );
});

export default AirValveMaintenance;
