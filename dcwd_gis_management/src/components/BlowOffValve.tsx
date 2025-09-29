import React from 'react';
import { observer } from 'mobx-react-lite';
import BlowOffValveModal from './modal/BlowOffValveModal';

import { Table, Input, Select, Button, Typography, Card } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';

import { blowOffValveStore } from '../stores/blowOffValveStore';
const { Title, Text } = Typography;

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 60,
    render: (_: any, __: any, idx: number) => idx + 1,
    sorter: (a: any, b: any) => (a.id ?? 0) - (b.id ?? 0),
  },
  {
    title: 'Work Order No.',
    dataIndex: 'wonumber',
    width: 160,
    sorter: (a: any, b: any) => (a.wonumber ?? '').localeCompare(b.wonumber ?? ''),
  },
  {
    title: 'Location',
    dataIndex: 'location',
    width: 180,
    sorter: (a: any, b: any) => (a.location ?? '').localeCompare(b.location ?? ''),
  },
  {
    title: 'Status',
    dataIndex: 'status_remarks',
    width: 120,
    sorter: (a: any, b: any) => (a.status_remarks ?? '').localeCompare(b.status_remarks ?? ''),
  },
  {
    title: 'Size',
    dataIndex: 'size',
    width: 80,
    sorter: (a: any, b: any) => (a.size ?? '').localeCompare(b.size ?? ''),
  },
  {
    title: 'Project Title',
    dataIndex: 'bovnumber',
    width: 220,
    sorter: (a: any, b: any) => (a.bovnumber ?? '').localeCompare(b.bovnumber ?? ''),
  },
  {
    title: '',
    key: 'action',
    width: 60,
    render: () => (
      <Button className="btn-action-circle" icon={<AppstoreOutlined />} />
    width: 80,
    render: (_: any, record: any) => (
      <button
        style={{ background: '#22c55e', border: 'none', borderRadius: 4, color: '#fff', padding: '4px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
        onClick={e => {
          e.stopPropagation();
          blowOffValveStore.setSelectedRow(record);
          blowOffValveStore.setModalOpen(true);
        }}
        title="View Details"
      >
        <span style={{ fontSize: 16 }}>👁️</span>
        <span style={{ fontWeight: 500 }}>View</span>
      </button>
    ),
  },
];

const BlowOffValve = observer(() => {
  // Fetch API data on mount
  React.useEffect(() => {
    blowOffValveStore.fetchBlowOffValves();
  }, []);

  const filteredData = blowOffValveStore.data.filter(
    row =>
      (row.workOrder?.toLowerCase() ?? '').includes(blowOffValveStore.search.toLowerCase()) ||
      (row.location?.toLowerCase() ?? '').includes(blowOffValveStore.search.toLowerCase()) ||
      (row.status?.toLowerCase() ?? '').includes(blowOffValveStore.search.toLowerCase()) ||
      (row.project?.toLowerCase() ?? '').includes(blowOffValveStore.search.toLowerCase())
  ).map((row, idx) => ({
    ...row,
    key: `${row.bovnumber || ''}_${row.wonumber || ''}_${idx}`
  }));

  return (
    <>
      <Card style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
        <div style={{ background: '#e6edfc', borderRadius: 8, padding: '16px 24px', marginBottom: 24 }}>
          <Title level={4} style={{ color: '#2563eb', margin: 0 }}>Blow Off Valve - Maintenance</Title>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Instructions:</Text>
          <div style={{ marginLeft: 12, marginTop: 2 }}>
            <Text>Instruction: Double Click row to edit Details.</Text>
          </div>
        </div>
        <div className="license-controls-container">
          <div className="license-display-controls">
            <span>Display</span>
            <Select
              value={blowOffValveStore.pageSize}
              onChange={blowOffValveStore.setPageSize.bind(blowOffValveStore)}
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
              value={blowOffValveStore.search}
              onChange={e => blowOffValveStore.setSearch(e.target.value)}
              style={{ width: 200 }}
            />
          </div>
        </div>
        <Table
          bordered
          rowKey="key"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: blowOffValveStore.pageSize }}
          style={{ background: '#fff', borderRadius: 8 }}
          onRow={record => ({
            onDoubleClick: (event: React.MouseEvent) => {
              // Only trigger row double click if not clicking the action button
              if (!(event.target as HTMLElement).closest('button')) {
                blowOffValveStore.setSelectedRow(record);
                blowOffValveStore.setModalOpen(true);
              }
            },
          })}
        />
      </Card>
      <BlowOffValveModal
        open={blowOffValveStore.modalOpen}
        onClose={() => blowOffValveStore.setModalOpen(false)}
        initialValues={blowOffValveStore.selectedRow || {}}
      />
    </>
  );
});

export default BlowOffValve;



