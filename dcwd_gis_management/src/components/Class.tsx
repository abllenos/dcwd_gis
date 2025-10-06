import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, Input, Table, Typography, Space, Empty, Alert } from 'antd';
import { classStore } from '../stores/classStore';
import Footer from './layout/Footer';

const { Title, Text } = Typography;

const ClassPage: React.FC = observer(() => {
  const store = classStore;
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
    { title: 'Date_inserted', dataIndex: 'dateInserted', key: 'dateInserted', sorter: (a: any, b: any) => new Date(a.dateInserted).getTime() - new Date(b.dateInserted).getTime(), render: (v: string) => new Date(v).toISOString() }
  ];

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Card style={{ boxShadow: '0 4px 18px rgba(0,0,0,0.06)', borderRadius: 12 }} styles={{ body: { padding: 20 } }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Title level={5} style={{ margin: 0 }}>Class - Maintenance</Title>
        </div>

        <div style={{ background: 'var(--bg-tertiary, #f5f7fb)', padding: '8px 12px', borderRadius: 8, marginBottom: 18 }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Instructions:</Text>
          <Text style={{ fontSize: 12 }}>View-only mode. Use the search and pagination controls to navigate.</Text>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
          <div className="license-display-controls">
            <span className="license-control-text">Display</span>
            <select
              value={pageSize}
              onChange={(e) => store.setPageSize(parseInt(e.target.value, 10))}
              style={{ padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', width: 80, fontSize: 14 }}
            >
              {[10,20,30,40,50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="license-control-text">records per page</span>
          </div>
          <div className="license-search-controls">
            <span className="license-control-text">Search:</span>
            <Input.Search
              size="small"
              allowClear
              placeholder=""
              value={store.search}
              onChange={e => store.setSearch(e.target.value)}
              enterButton
              style={{ width: 200 }}
            />
          </div>
        </div>

        {store.diagnostics.lastError && !loading && (
          <Alert type="error" showIcon style={{ marginBottom: 12 }} message="Failed to load classes" description={store.diagnostics.lastError} />
        )}
        {!loading && !store.diagnostics.lastError && paged.length === 0 && (
          <Empty description="No classes" style={{ margin: '40px 0' }} />
        )}
        <Table
          size="small"
          rowKey="id"
          dataSource={paged}
          columns={columns as unknown as any}
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
            {Math.ceil(totalCount / pageSize) > 5 && (
              <Button size="small" type={currentPage === Math.ceil(totalCount / pageSize) ? 'primary' : 'default'} onClick={() => store.setCurrentPage(Math.ceil(totalCount / pageSize))}>{Math.ceil(totalCount / pageSize)}</Button>
            )}
            <Button size="small" disabled={currentPage >= Math.ceil(totalCount / pageSize)} onClick={() => store.setCurrentPage(currentPage + 1)}>Next</Button>
          </Space>
        </div>
      </Card>

      <Footer />
    </div>
  );
});

export default ClassPage;
