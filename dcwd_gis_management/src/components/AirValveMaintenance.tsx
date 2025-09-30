import { Button } from 'antd';
import React, { useMemo, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { airValveStore } from '../stores/airValveStore';
import { Card, Typography, Table, Spin, Alert, Input } from 'antd';
import AirValveModal from './modal/AirValveModal';
import AirValveDetailsModal from './modal/AirValveDetailsModal';
import type { ColumnsType } from 'antd/es/table';
import { useQuery } from '@tanstack/react-query';
import { devApi } from './endpoints/Interceptor';

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

  const { pageSize, setPageSize, search, setSearch, modalVisible, setModalVisible, selectedRecord, setSelectedRecord } = airValveStore;

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
      title: '',
      key: 'actions',
      width: 80,
      render: (_: any, _record: AirValveRecord) => (
        <Button
          style={{
            background: '#18c964',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 24px',
            fontWeight: 500,
            boxShadow: '0 2px 8px rgba(24,201,100,0.08)',
            display: 'block',
            margin: '0 auto',
          }}
          onClick={() => {
            airValveStore.setDetailsRecord(_record);
            airValveStore.setDetailsModalVisible(true);
          }}
        >
          View
        </Button>
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

        <div className="license-controls-container">
          <div className="license-display-controls">
            <span>Display</span>
            <select value={String(pageSize)} onChange={(e) => setPageSize(Number(e.target.value))} style={{ width: 80, padding: 6, borderRadius: 4 }}>
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 200 }}
            />
          </div>
        </div>

        {isLoading ? <Spin /> : error ? <Alert type="error" message="Failed to load data" /> : (
          <Table
            columns={columns as any}
            dataSource={filteredData}
            pagination={{ pageSize }}
            rowKey={(r: AirValveRecord) => r.id}
            onRow={(record: AirValveRecord) => ({
              onDoubleClick: () => {
                setSelectedRecord(record);
                setModalVisible(true);
              },
            })}
            bordered
          />
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
    </div>
  );
});

export default AirValveMaintenance;
