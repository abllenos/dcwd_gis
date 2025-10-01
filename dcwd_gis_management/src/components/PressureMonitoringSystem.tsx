import { observer } from 'mobx-react-lite';
import { Table, Input, Select, Button, Typography, Card, Space, Spin, Alert } from 'antd';
import { ToolOutlined, InfoCircleOutlined } from '@ant-design/icons';
import PmsMaintenanceModal from './modal/PmsMaintenanceModal';
import { pressureMonitoringSystemStore } from '../stores/pressureMonitoringSystemStore';
import { useQuery } from '@tanstack/react-query';
import { apiGis } from './endpoints/Interceptor';
import Footer from './layout/Footer';

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

  const { currentPage, pageSize, setCurrentPage, search } = pressureMonitoringSystemStore;
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a: any, b: any) => a.id - b.id,
      width: 60,
      render: (_: any, _record: PMSRecord, index) => (currentPage - 1) * pageSize + index + 1,
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
      row.pmsNumber.toLowerCase().includes(search.toLowerCase()) ||
      row.location.toLowerCase().includes(search.toLowerCase())
  );

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

  return (
    <>
      <Card style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
        <div style={{ background: '#e6edfc', borderRadius: 8, padding: '16px 24px', marginBottom: 24 }}>
          <Title level={4} style={{ color: '#2563eb', margin: 0 }}>Pressure Monitoring System - Maintenance</Title>
        </div>
        <div className="license-controls-container">
          <div className="license-display-controls">
            <span>Display</span>
            <Select
              value={pageSize}
              onChange={pressureMonitoringSystemStore.setPageSize.bind(pressureMonitoringSystemStore)}
              size="small"
              style={{ width: 90 }}
              options={[10, 20, 50, 100].map(v => ({ value: v, label: v }))}
            />
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
              onChange={e => { pressureMonitoringSystemStore.setSearch(e.target.value); setCurrentPage(1); }}
              style={{ width: 200 }}
            />
          </div>
        </div>
        {isLoading ? <Spin /> : error ? <Alert type="error" message="Failed to load data" /> : (
          <>
            <Table
              bordered
              rowKey="id"
              columns={columns}
              dataSource={paginatedData}
              pagination={false}
              style={{ background: '#fff', borderRadius: 8 }}
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
          </>
        )}
      </Card>
      <PmsMaintenanceModal open={pressureMonitoringSystemStore.modalOpen} onClose={() => pressureMonitoringSystemStore.setModalOpen(false)} />
      <div style={{ padding: 24, background: 'var(--bg-secondary, #f7f9fc)', minHeight: '100vh' }}>
        {/* ...existing content... */}
      </div>
      <Footer />
    </>
  );
});

export default PressureMonitoringSystem;
