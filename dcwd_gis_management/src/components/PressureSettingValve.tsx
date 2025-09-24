import React, { useState, useMemo } from 'react';
import { Card, Typography, Space, Select, Input, Table, Button, Spin, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UnorderedListOutlined } from '@ant-design/icons';
import PressureSettingValveModal from './modal/PressureSettingValveModal';
import Footer from './layout/Footer';
import { useQuery } from '@tanstack/react-query';
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

// Fetch function for PSV data (no remapping, use raw API fields)
const fetchPSVData = async (): Promise<PSVRecord[]> => {
  const res = await apiGis.get('helpers/gis/mgtsys/getLayers/getPsv.php');
  return Array.isArray(res.data.data) ? res.data.data : [];
};


const PressureSettingValve: React.FC = () => {
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<PSVRecord | null>(null);

  // Fetch PSV data
  const { data, isLoading, error } = useQuery<PSVRecord[]>({
    queryKey: ['psvData'],
    queryFn: fetchPSVData,
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.filter((r) =>
      (r.psv_number?.toLowerCase() ?? '').includes(q) ||
      (r.accountnumber?.toLowerCase() ?? '').includes(q) ||
      (r.location?.toLowerCase() ?? '').includes(q) ||
      (r.meter_number?.toLowerCase() ?? '').includes(q) ||
      (r.size?.toString() ?? '').includes(q) ||
      (r.brand_name?.toLowerCase() ?? '').includes(q) ||
      (r.pressure_setting?.toLowerCase() ?? '').includes(q) ||
      (r.remarks?.toLowerCase() ?? '').includes(q)
    );
  }, [data, search]);

  // Debug: log API response and error
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('PSV API data:', data);
    // eslint-disable-next-line no-console
    if (error) console.error('PSV API error:', error);
  }

  const columns: ColumnsType<PSVRecord> = [
    {
      title: '#',
      key: 'index',
      render: (_text, _record, index) => index + 1,
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
      render: (_: any, _record: PSVRecord) => (
        <Button type="primary" shape="circle" onClick={() => { setSelected(_record); setModalVisible(true); }} style={{ background: '#00b894', borderColor: '#00b894' }}>
          <UnorderedListOutlined />
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: 'var(--bg-secondary, #f7f9fc)', minHeight: '100vh' }}>
      {/* Always show loading/error/debug info at the top */}
      <div style={{ marginBottom: 16 }}>
        {isLoading && <div style={{ color: '#2563eb', fontWeight: 600 }}>Loading...</div>}
        {error && <div style={{ color: 'red', fontWeight: 600 }}>Error: {error.message}</div>}
        <pre style={{ background: '#f8f8f8', color: '#c00', fontSize: 12, maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
      </div>
      <div style={{ background: '#e9edfa', borderRadius: '12px 12px 0 0', padding: '18px 32px 12px 32px', marginBottom: 0 }}>
        <span style={{ color: '#3a5fc8', fontWeight: 600, fontSize: 22, letterSpacing: 0.2 }}>Pressure Setting Valves</span>
      </div>
      <Card style={{ borderRadius: '0 0 12px 12px', marginTop: 0 }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={5} style={{ color: '#666', marginBottom: 8 }}>Instructions:</Title>
          <Text style={{ color: '#999' }}>Double click a row to edit details or use the action button.</Text>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space>
            <Text>Display</Text>
            <Select value={String(pageSize)} onChange={(v: string) => setPageSize(Number(v))} style={{ width: 100 }} options={[{label:'10',value:'10'},{label:'25',value:'25'},{label:'50',value:'50'}]} />
            <Text>records per page</Text>
          </Space>

          <Space>
            <Text>Search:</Text>
            <Search placeholder="Search" allowClear onSearch={(v: string) => setSearch(v)} style={{ width: 320 }} />
          </Space>
        </div>

        {!isLoading && !error && (
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize }}
            rowKey={(r) => r.psv_number}
            onRow={(record) => ({ onDoubleClick: () => { setSelected(record); setModalVisible(true); } })}
            bordered
          />
        )}

        <PressureSettingValveModal
          visible={modalVisible}
          record={selected}
          onCancel={() => setModalVisible(false)}
          onUpdate={() => { console.log('update', selected); setModalVisible(false); }}
        />
      </Card>
    </div>
  );
};

export default PressureSettingValve;
