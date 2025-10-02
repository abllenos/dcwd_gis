import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, Input, Modal, Select, Table, Typography, Space, Form, Alert, Empty } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { classificationStore } from '../stores/classificationStore';
import type { ClassificationRecord } from '../stores/classificationStore';
import Footer from './layout/Footer';

const { Title, Text } = Typography;

const layerOptions = [
  'DCWD_PMS', 'UNIVERSAL', 'DCWD_VALVE_AV'
];
const classOptions = [
  'PMS BRAND', 'PIPE TYPE', 'VALVE TYPE', 'VALVE BRAND'
];

const Classification: React.FC = observer(() => {
  const store = classificationStore;
  const { pagedRecords, pageSize, currentPage, totalCount, loading } = store;

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70, sorter: (a: any, b: any) => (Number(a.id) || 0) - (Number(b.id) || 0) },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Layer Name', dataIndex: 'layerName', key: 'layerName', sorter: (a: any, b: any) => String(a.layerName || '').localeCompare(String(b.layerName || '')) },
    { title: 'Class Name', dataIndex: 'className', key: 'className', sorter: (a: any, b: any) => String(a.className || '').localeCompare(String(b.className || '')) },
    { title: ' ', key: 'actions', width: 140, render: (_: unknown, record: ClassificationRecord) => (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button
          className="license-table-action-button"
          icon={<EditOutlined />}
          size="small"
          onClick={() => store.openEdit(record)}
        />
        <button
          style={{ background: '#22c55e', border: 'none', borderRadius: 4, color: '#fff', padding: '4px 12px', cursor: 'pointer', fontWeight: 500 }}
          onClick={() => store.openEdit(record)}
        >
          View
        </button>
      </div>
    )}

  ];

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Card
        style={{ boxShadow: '0 4px 18px rgba(0,0,0,0.06)', borderRadius: 12 }}
        styles={{ body: { padding: 20 } }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Title level={5} style={{ margin: 0, color: 'var(--text-primary)' }}>Classification - Maintenance</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => store.openAddModal()}>
            Add Classification
          </Button>
        </div>

        <div style={{ background: 'var(--bg-tertiary, #f5f7fb)', padding: '8px 12px', borderRadius: 8, marginBottom: 18 }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Instructions:</Text>
          <Text style={{ fontSize: 12 }}>Instruction: Double Click row to edit Class Details.</Text>
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
          columns={columns as any}
          pagination={false}
          loading={loading}
          onRow={(record) => ({ onDoubleClick: () => store.openEdit(record) })}
          style={{ marginBottom: 16 }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8 }}>
          <Text style={{ fontSize: 12 }}>
            Showing {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
            {store.search && ` (filtered)`}
          </Text>
          <Space>
            <Button size="small" disabled={currentPage === 1 || totalCount === 0} onClick={() => store.setCurrentPage(currentPage - 1)}>Previous</Button>
            {(() => {
              const totalPages = Math.ceil(totalCount / pageSize);
              const maxVisiblePages = 5;
              const pages = [];
              
              if (totalPages <= maxVisiblePages) {
                // Show all pages if total is small
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // Calculate window around current page
                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                
                // Adjust if we're near the end
                if (endPage - startPage < maxVisiblePages - 1) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }
                
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }
              }
              
              return pages.map(pageNum => (
                <Button 
                  key={pageNum} 
                  size="small" 
                  type={pageNum === currentPage ? 'primary' : 'default'} 
                  onClick={() => store.setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              ));
            })()}
            <Button size="small" disabled={currentPage >= Math.ceil(totalCount / pageSize) || totalCount === 0} onClick={() => store.setCurrentPage(currentPage + 1)}>Next</Button>
          </Space>
        </div>
      </Card>

      <Modal
        title={store.editingRecord ? 'Edit Classification' : 'Add Classification'}
        open={store.addModalVisible}
        onCancel={() => store.closeModal()}
        onOk={() => store.saveDraft()}
        okText="Save"
        destroyOnHidden
      >
        <Form
          layout="vertical"
          initialValues={store.formDraft}
          onValuesChange={(_, all) => {
            (Object.keys(all) as (keyof typeof all)[]).forEach(k => store.updateDraft(k as any, (all as any)[k]));
          }}
        >
          <Form.Item label="Description" name="description" required rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item label="Layer Name" name="layerName" required rules={[{ required: true }]}> <Select options={layerOptions.map(o => ({ label: o, value: o }))} showSearch /> </Form.Item>
          <Form.Item label="Class Name" name="className" required rules={[{ required: true }]}> <Select options={classOptions.map(o => ({ label: o, value: o }))} showSearch /> </Form.Item>
          {/* Status field removed per design; store still keeps statusFlag if needed */}
        </Form>
      </Modal>

      <Footer />
    </div>
  );
});

export default Classification;
