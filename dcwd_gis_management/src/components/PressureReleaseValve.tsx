
import React, { useEffect } from 'react';
import { Card, Typography, Space, Table, Spin, Alert } from 'antd';
import PressureReleaseValveModal from './modal/PressureReleaseValveModal';
import type { ColumnsType } from 'antd/es/table';
import { UnorderedListOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { prvStore } from '../stores/prvStore';
import { apiGis } from './endpoints/Interceptor';

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

  const columns: ColumnsType<PressureReleaseValveRecord> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'PRV Number', dataIndex: 'prvNumber', key: 'prvNumber' },
    { title: 'Location', dataIndex: 'location', key: 'location', ellipsis: true },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 160 },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: any, _record: PressureReleaseValveRecord) => (
        <button aria-label="actions" style={{ background: '#00b894', borderColor: '#00b894', color: '#fff', borderRadius: '50%', width: 36, height: 36, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { prvStore.setSelectedRecord(_record); prvStore.setModalVisible(true); }}>
          <UnorderedListOutlined />
        </button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: 'var(--bg-secondary, #f7f9fc)', minHeight: '100vh' }}>
      <div style={{ background: '#e9edfa', borderRadius: '12px 12px 0 0', padding: '18px 32px 12px 32px', marginBottom: 0 }}>
        <span style={{ color: '#3a5fc8', fontWeight: 600, fontSize: 22, letterSpacing: 0.2 }}>Pressure Release Valve - Maintenance</span>
      </div>
      <Card style={{ borderRadius: '0 0 12px 12px', marginTop: 0 }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={5} style={{ color: '#666', marginBottom: 8 }}>Instructions:</Title>
          <Text style={{ color: '#999' }}>Instruction: Double Click row to edit Details.</Text>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space>
            <Text>Display</Text>
            <select value={String(prvStore.pageSize)} onChange={(e) => prvStore.setPageSize(Number(e.target.value))} style={{ width: 80, padding: 6, borderRadius: 4 }}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <Text>records per page</Text>
          </Space>

          <Space>
            <Text>Search:</Text>
            <input
              aria-label="Search"
              placeholder="Search..."
              value={prvStore.search}
              onChange={(e) => prvStore.setSearch(e.target.value)}
              style={{ width: 260, padding: '6px 10px', borderRadius: 4, border: '1px solid #d9d9d9' }}
            />
          </Space>
        </div>

        {prvStore.isLoading ? <Spin /> : prvStore.error ? <Alert type="error" message="Failed to load data" /> : (
          <Table
            columns={columns as any}
            dataSource={prvStore.filteredData}
            pagination={{ pageSize: prvStore.pageSize }}
            rowKey={(r: PressureReleaseValveRecord) => r.key}
            onRow={(record: PressureReleaseValveRecord) => ({
              onDoubleClick: () => {
                prvStore.setSelectedRecord(record);
                prvStore.setModalVisible(true);
              },
            })}
            bordered
          />
        )}

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
  );
});

export default PressureReleaseValve;
