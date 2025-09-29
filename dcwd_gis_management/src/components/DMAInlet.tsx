

import { observer } from 'mobx-react-lite';
import { Card, Typography, Table, Select, Input } from 'antd';
import PipeConditionAssessmentModal from './modal/PipeConditionAssessmentModal';
import { dmaInletStore } from '../stores/dmaInletStore';






const DMAInlet = observer(() => {



  const initialData = [
    { id: 1, woNumber: 'Unupdated', projectTitle: 'Unupdated', size: 150, type: 'CCIP', length: 74.008 },
    { id: 2, woNumber: '05-02-02', projectTitle: 'Unupdated', size: 100, type: 'PVC', length: 196.857 },
    { id: 3, woNumber: 'Unupdated', projectTitle: 'Unupdated', size: 300, type: 'MLCSP', length: 70.875 },
    { id: 4, woNumber: 'Unupdated', projectTitle: 'Unupdated', size: 100, type: 'PVC', length: 110.052 },
    { id: 5, woNumber: 'Unupdated', projectTitle: 'Unupdated', size: 100, type: 'PVC', length: 120.396 },
    { id: 6, woNumber: 'Unupdated', projectTitle: 'Unupdated', size: 100, type: 'PVC', length: 148.888 },
    { id: 7, woNumber: 'Unupdated', projectTitle: 'Unupdated', size: 100, type: 'PVC', length: 114.469 },
    { id: 8, woNumber: 'Unupdated', projectTitle: 'Unupdated', size: 100, type: 'PVC', length: 151.625 },
    { id: 9, woNumber: 'Unupdated', projectTitle: 'Unupdated', size: 100, type: 'PVC', length: 121.269 },
    { id: 10, woNumber: 'Unupdated', projectTitle: 'Unupdated', size: 100, type: 'PVC', length: 34.247 },
  ];

  const columns = [
    { title: 'Asset ID', dataIndex: 'id', width: 80, sorter: (a: any, b: any) => a.id - b.id },
    { title: 'WO Number', dataIndex: 'woNumber' },
    { title: 'Project Title', dataIndex: 'projectTitle' },
    { title: 'Size', dataIndex: 'size', width: 80 },
    { title: 'Type', dataIndex: 'type', width: 80 },
    { title: 'Length', dataIndex: 'length', width: 100 },
    {
      title: 'Action',
      key: 'action',
      width: 90,
      render: (_: any, record: any) => (
        <button
          style={{ background: '#22c55e', border: 'none', borderRadius: 4, color: '#fff', padding: '4px 12px', cursor: 'pointer', fontWeight: 500 }}
          onClick={() => {
            dmaInletStore.setSelectedAssetId(record.id);
            dmaInletStore.setModalOpen(true);
          }}
        >
          View
        </button>
      ),
    },
  ];

    const filteredData = initialData.filter(
      row =>
        row.woNumber.toLowerCase().includes(dmaInletStore.search.toLowerCase()) ||
        row.projectTitle.toLowerCase().includes(dmaInletStore.search.toLowerCase()) ||
        String(row.size).includes(dmaInletStore.search) ||
        row.type.toLowerCase().includes(dmaInletStore.search.toLowerCase())
    );

    return (
      <>
        <Card style={{ background: '#f6f8fc', border: 'none', boxShadow: 'none' }}>
          <div style={{ background: '#e6edfc', borderRadius: 8, padding: '12px 24px', marginBottom: 18 }}>
            <Typography.Title level={5} style={{ color: '#2563eb', margin: 0 }}>Distribution & Transmission</Typography.Title>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 16 }}>
            <span>Display</span>
            <Select
              value={dmaInletStore.pageSize}
              onChange={dmaInletStore.setPageSize.bind(dmaInletStore)}
              style={{ width: 80 }}
              options={[10, 20, 50, 100].map(v => ({ value: v, label: v }))}
            />
            <span>records per page</span>
            <div style={{ flex: 1 }} />
            <span>Search:</span>
            <Input
              value={dmaInletStore.search}
              onChange={e => dmaInletStore.setSearch(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />
          </div>
          <Table
            bordered
            rowKey="id"
            columns={columns}
            dataSource={filteredData}
            pagination={{
              current: 1,
              pageSize: dmaInletStore.pageSize,
              total: filteredData.length,
              showSizeChanger: false,
            }}
            style={{ background: '#fff', borderRadius: 8 }}
          />
        </Card>
        <PipeConditionAssessmentModal
          open={dmaInletStore.modalOpen}
          onClose={() => dmaInletStore.setModalOpen(false)}
          assetId={dmaInletStore.selectedAssetId}
        />
      </>
    );
});

export default DMAInlet;
