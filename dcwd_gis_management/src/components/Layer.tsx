import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, Input, Select, Table, Tag, Typography, Space, Alert, Empty } from 'antd';
import { layerStore } from '../stores/layerStore';
import Footer from './layout/Footer';

const { Title, Text } = Typography;

const Layer: React.FC = observer(() => {
  const store = layerStore;
  const { paged, pageSize, currentPage, totalCount, loading } = {
    paged: store.paged,
    pageSize: store.pageSize,
    currentPage: store.currentPage,
    totalCount: store.totalCount,
    loading: store.loading
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70, sorter: (a: any, b: any) => (Number(a.id) || 0) - (Number(b.id) || 0) },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Status Flag', dataIndex: 'statusFlag', key: 'statusFlag', width: 110, render: (v: number) => v === 1 ? <Tag color="green">1</Tag> : <Tag color="red">0</Tag> },
    { title: 'Date_inserted', dataIndex: 'dateInserted', key: 'dateInserted', sorter: (a: any, b: any) => new Date(a.dateInserted).getTime() - new Date(b.dateInserted).getTime(), render: (v: string) => new Date(v).toISOString() }
  ];

  return (
    <>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        <Card style={{ boxShadow: '0 4px 18px rgba(0,0,0,0.06)', borderRadius: 12 }} styles={{ body: { padding: 20 } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Title level={5} style={{ margin: 0 }}>Layer - Maintenance</Title>
        </div>

        <div style={{ background: 'var(--bg-tertiary, #f5f7fb)', padding: '8px 12px', borderRadius: 8, marginBottom: 18 }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Instructions:</Text>
          <Text style={{ fontSize: 12 }}>View-only mode. Use the search and pagination controls to navigate.</Text>
        </div>

        <div className="license-controls-container">
          <div className="license-display-controls">
            <span>Display</span>
            <Select
              size="small"
              value={pageSize}
              style={{ width: 90 }}
              onChange={(v) => store.setPageSize(v)}
              options={[10,20,30,40,50].map(n => ({ label: n, value: n }))}
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
              value={store.search}
              onChange={e => store.setSearch(e.target.value)}
              style={{ width: 200 }}
            />
          </div>
        </div>

        {store.diagnostics.lastError && !loading && (
          <Alert type="error" showIcon style={{ marginBottom: 12 }} message="Failed to load layers" description={store.diagnostics.lastError} />
        )}
        {!loading && !store.diagnostics.lastError && paged.length === 0 && (
          <Empty description="No layers" style={{ margin: '40px 0' }} />
        )}
        <Table
          size="small"
          rowKey="id"
          dataSource={paged}
          columns={columns as any}
          pagination={false}
          loading={loading}
          style={{ marginBottom: 16 }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8 }}>
          <Text style={{ fontSize: 12 }}>Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries</Text>
          <Space>
            <Button size="small" disabled={currentPage === 1} onClick={() => store.setCurrentPage(currentPage - 1)}>Previous</Button>
            {Array.from({ length: Math.ceil(totalCount / pageSize) }).slice(0,5).map((_, i) => {
              const page = i + 1;
              return <Button key={page} size="small" type={page === currentPage ? 'primary' : 'default'} onClick={() => store.setCurrentPage(page)}>{page}</Button>;
            })}
            {Math.ceil(totalCount / pageSize) > 5 && <Button size="small" disabled>...</Button>}
            {Math.ceil(totalCount / pageSize) > 5 && <Button size="small" type={currentPage === Math.ceil(totalCount / pageSize) ? 'primary' : 'default'} onClick={() => store.setCurrentPage(Math.ceil(totalCount / pageSize))}>{Math.ceil(totalCount / pageSize)}</Button>}
            <Button size="small" disabled={currentPage >= Math.ceil(totalCount / pageSize)} onClick={() => store.setCurrentPage(currentPage + 1)}>Next</Button>
          </Space>
        </div>
      </Card>
      </div>
      <Footer />
    </>
  );
});

export default Layer;
