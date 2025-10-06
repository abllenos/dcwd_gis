import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, Input, InputNumber, Select, Table, Typography, Space, Alert, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { classificationStore, type ClassificationRecord } from '../stores/classificationStore';
import Footer from './layout/Footer';

const { Title, Text } = Typography;

const Classification: React.FC = observer(() => {
  const store = classificationStore;
  const { pagedRecords, pageSize, currentPage, loading } = store;

  const columns: ColumnsType<ClassificationRecord> = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70, sorter: (a, b) => a.id - b.id },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Layer Name', dataIndex: 'layerName', key: 'layerName', sorter: (a, b) => (a.layerName || '').localeCompare(b.layerName || '') },
    { title: 'Class Name', dataIndex: 'className', key: 'className', sorter: (a, b) => (a.className || '').localeCompare(b.className || '') }
  ];

  const totalPages = store.totalPages;
  const total = store.totalCount;
  const maxVisiblePages = 5;
  const windowSize = 2;
  const pages: Array<number | '…'> = [];
  if (totalPages <= maxVisiblePages) {
    for (let p = 1; p <= totalPages; p++) pages.push(p);
  } else {
    const start = Math.max(1, currentPage - windowSize);
    const end = Math.min(totalPages, currentPage + windowSize);
    if (start > 1) pages.push(1);
    if (start > 2) pages.push('…');
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < totalPages - 1) pages.push('…');
    if (end < totalPages) pages.push(totalPages);
  }
  const showingStart = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const showingEnd = total > 0 ? Math.min(currentPage * pageSize, total) : 0;
  const disableJump = totalPages <= 1 || total === 0;

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Card
        style={{ boxShadow: '0 4px 18px rgba(0,0,0,0.06)', borderRadius: 12 }}
        styles={{ body: { padding: 20 } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Title level={5} style={{ margin: 0, color: 'var(--text-primary)' }}>Classification - Maintenance</Title>
        </div>

        <div style={{ background: 'var(--bg-tertiary, #f5f7fb)', padding: '8px 12px', borderRadius: 8, marginBottom: 18 }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Instructions:</Text>
          <Text style={{ fontSize: 12 }}>View-only mode. Use the search and pagination controls to navigate.</Text>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
          <div className="license-display-controls">
            <span className="license-control-text">Display</span>
            <Select
              size="small"
              value={pageSize}
              style={{ width: 80 }}
              onChange={(v) => store.setPageSize(v)}
              options={[10,20,30,40,50].map(n => ({ label: n, value: n }))}
            />
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
          <Alert type="error" showIcon style={{ marginBottom: 12 }} message="Failed to load classifications" description={store.diagnostics.lastError} />
        )}
        {!loading && !store.diagnostics.lastError && pagedRecords.length === 0 && (
          <Empty description="No classifications" style={{ margin: '40px 0' }} />
        )}
        <Table
          size="small"
          rowKey="id"
          dataSource={pagedRecords}
          columns={columns}
          pagination={false}
          loading={loading}
          style={{ marginBottom: 16 }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8 }}>
          <Text style={{ fontSize: 12 }}>
            Showing {showingStart} to {showingEnd} of {total} entries
            {store.search && total > 0 ? ' (filtered)' : ''}
          </Text>
          <Space>
            <Button size="small" disabled={currentPage === 1 || total === 0} onClick={() => store.setCurrentPage(currentPage - 1)}>Previous</Button>
            {pages.map((pageNum, idx) => (
              pageNum === '…'
                ? <Button key={`ellipsis-${idx}`} size="small" disabled>...</Button>
                : (
                  <Button
                    key={pageNum}
                    size="small"
                    type={pageNum === currentPage ? 'primary' : 'default'}
                    onClick={() => store.setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
            ))}
            <Button size="small" disabled={currentPage >= totalPages || total === 0} onClick={() => store.setCurrentPage(currentPage + 1)}>Next</Button>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 12 }}>Jump to</Text>
              <InputNumber
                size="small"
                min={1}
                max={totalPages}
                value={store.pageJumpInput}
                onChange={(value) => store.setPageJumpInput(value)}
                onPressEnter={() => store.jumpToPage()}
                disabled={disableJump}
              />
              <Button size="small" onClick={() => store.jumpToPage()} disabled={disableJump}>Go</Button>
            </span>
          </Space>
        </div>
      </Card>

      <Footer />
    </div>
  );
});

export default Classification;
