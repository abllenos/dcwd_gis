
import { observer } from 'mobx-react-lite';
import { Table, Input, Select, Button, Typography, Card, Space, Spin, Alert } from 'antd';
import { ToolOutlined, InfoCircleOutlined } from '@ant-design/icons';
import PmsMaintenanceModal from './modal/PmsMaintenanceModal';
import { pressureMonitoringSystemStore } from '../stores/pressureMonitoringSystemStore';
import Footer from './layout/Footer';
import { useQuery } from '@tanstack/react-query';
import { apiGis } from './endpoints/Interceptor';

const { Title } = Typography;

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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a: any, b: any) => a.id - b.id,
      width: 60,
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
      title: '',
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
          <Button type="primary" shape="circle" icon={<InfoCircleOutlined />} style={{ background: '#3b82f6', border: 'none' }} />
        </Space>
      ),
    },
  ];

  const filteredData = (data || []).filter(
    row =>
      row.pmsNumber.toLowerCase().includes(pressureMonitoringSystemStore.search.toLowerCase()) ||
      row.location.toLowerCase().includes(pressureMonitoringSystemStore.search.toLowerCase())
  );

  return (
    <>
      <Card style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
        <div style={{ background: '#e6edfc', borderRadius: 8, padding: '16px 24px', marginBottom: 24 }}>
          <Title level={4} style={{ color: '#2563eb', margin: 0 }}>Pressure Monitoring System - Maintenance</Title>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, gap: 16 }}>
          <span>Show</span>
          <Select
            value={pressureMonitoringSystemStore.pageSize}
            onChange={pressureMonitoringSystemStore.setPageSize.bind(pressureMonitoringSystemStore)}
            style={{ width: 80 }}
            options={[10, 20, 50, 100].map(v => ({ value: v, label: v }))}
          />
          <span>entries</span>
          <div style={{ flex: 1 }} />
          <span>Search:</span>
          <Input
            value={pressureMonitoringSystemStore.search}
            onChange={e => pressureMonitoringSystemStore.setSearch(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
        </div>
        {isLoading ? <Spin /> : error ? <Alert type="error" message="Failed to load data" /> : (
          <Table
            bordered
            rowKey="id"
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: pressureMonitoringSystemStore.pageSize }}
            style={{ background: '#fff', borderRadius: 8 }}
          />
        )}
      </Card>
      <PmsMaintenanceModal open={pressureMonitoringSystemStore.modalOpen} onClose={() => pressureMonitoringSystemStore.setModalOpen(false)} />
    </>
  );
});

export default PressureMonitoringSystem;
