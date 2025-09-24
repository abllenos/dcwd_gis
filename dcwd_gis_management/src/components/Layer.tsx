import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, Input, Modal, Select, Table, Tag, Typography, Space, Form } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { layerStore } from '../stores/layerStore';
import type { LayerRecord } from '../stores/layerStore';

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
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Status Flag', dataIndex: 'statusFlag', key: 'statusFlag', width: 110, render: (v: number) => v === 1 ? <Tag color="green">1</Tag> : <Tag color="red">0</Tag> },
    { title: 'Date_inserted', dataIndex: 'dateInserted', key: 'dateInserted', render: (v: string) => new Date(v).toISOString() },
    { title: ' ', key: 'actions', width: 70, render: (_: unknown, record: LayerRecord) => (
      <Button
        type="primary"
        icon={<EditOutlined />}
        size="small"
        onClick={() => store.openEdit(record)}
      />)
    }
  ];

  return (
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      <Card style={{ boxShadow: '0 4px 18px rgba(0,0,0,0.06)', borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Title level={5} style={{ margin: 0 }}>Layer - Maintenance</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => store.openAdd()}>
            Add Layer
          </Button>
        </div>

        <div style={{ background: 'var(--bg-tertiary, #f5f7fb)', padding: '8px 12px', borderRadius: 8, marginBottom: 18 }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Instructions:</Text>
          <Text style={{ fontSize: 12 }}>Instruction: Double Click row to edit Class Details.</Text>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
          <Space size={8}>
            <Text>Display</Text>
            <Select
              size="small"
              value={pageSize}
              style={{ width: 90 }}
              onChange={(v) => store.setPageSize(v)}
              options={[10,20,30,40,50].map(n => ({ label: n, value: n }))}
            />
            <Text>records per page</Text>
          </Space>
          <Space>
            <Text>Search:</Text>
            <Input size="small" allowClear value={store.search} onChange={e => store.setSearch(e.target.value)} />
          </Space>
        </div>

        <Table
          size="small"
          rowKey="id"
          dataSource={paged}
          columns={columns as any}
          pagination={false}
          loading={loading}
          onRow={(record) => ({ onDoubleClick: () => store.openEdit(record) })}
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

        {import.meta.env.DEV && (
          <div style={{ marginTop: 18, fontSize: 11, opacity: 0.7 }}>
            <Text type="secondary">Diagnostics: url={store.diagnostics.lastUrl} status={store.diagnostics.lastStatus} fetched={store.diagnostics.lastFetchedAt}</Text>
          </div>
        )}
      </Card>

      <Modal
        title={store.editing ? 'Edit Layer' : 'Add Layer'}
        open={store.addModalVisible}
        onCancel={() => store.closeModal()}
        onOk={() => store.saveDraft()}
        okText="Save"
        destroyOnClose
      >
        <Form
          layout="vertical"
          initialValues={store.draft}
          onValuesChange={(_, all) => {
            if ('description' in all) store.updateDraft('description', all.description);
            if ('statusFlag' in all) store.updateDraft('statusFlag', all.statusFlag);
          }}
        >
          <Form.Item label="Description" name="description" required rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item label="Status" name="statusFlag"> <Select options={[{ label: 'Active (1)', value: 1 }, { label: 'Inactive (0)', value: 0 }]} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});

export default Layer;
