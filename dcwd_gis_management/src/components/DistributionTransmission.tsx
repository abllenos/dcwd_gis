import { observer } from 'mobx-react-lite';
import { Card, Typography, Table, Select, Input } from 'antd';
import PipeConditionAssessmentModal from './modal/PipeConditionAssessmentModal';
import { distributionTransmissionStore } from '../stores/distributionTransmissionStore';
import Footer from './layout/Footer';


const { Title } = Typography;

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



const DistributionTransmission = observer(() => {
  const { currentPage, pageSize, setCurrentPage, search } = distributionTransmissionStore;
  const columns = [
    { title: 'Asset ID', dataIndex: 'id', width: 80, sorter: (a: any, b: any) => a.id - b.id, render: (_: any, _record: any, index) => (currentPage - 1) * pageSize + index + 1 },
    { title: 'WO Number', dataIndex: 'woNumber' },
    { title: 'Project Title', dataIndex: 'projectTitle' },
    { title: 'Size', dataIndex: 'size', width: 80 },
    { title: 'Type', dataIndex: 'type', width: 80 },
    { title: 'Length', dataIndex: 'length', width: 100 },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <button
            className="license-table-action-button"
            onClick={() => {
              distributionTransmissionStore.setSelectedAssetId(record.id);
              distributionTransmissionStore.setModalOpen(true);
            }}
            title="View Details"
          >
          </button>
        </div>
      ),
    },
  ];

  const filteredData = initialData.filter(
    row =>
      row.woNumber.toLowerCase().includes(search.toLowerCase()) ||
      row.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      String(row.size).includes(search) ||
      row.type.toLowerCase().includes(search.toLowerCase())
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
      <div style={{ padding: 24, background: 'var(--bg-secondary, #f7f9fc)', minHeight: '100vh' }}>
        <Card style={{ background: '#f6f8fc', border: 'none', boxShadow: 'none' }}>
          <div style={{ background: '#e6edfc', borderRadius: 8, padding: '12px 24px', marginBottom: 18 }}>
            <Title level={5} style={{ color: '#2563eb', margin: 0 }}>Distribution & Transmission</Title>
          </div>
          <div className="license-controls-container">
            <div className="license-display-controls">
              <span>Display</span>
              <Select
                value={pageSize}
                onChange={distributionTransmissionStore.setPageSize.bind(distributionTransmissionStore)}
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
                onChange={e => { distributionTransmissionStore.setSearch(e.target.value); setCurrentPage(1); }}
                style={{ width: 200 }}
              />
            </div>
          </div>
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
        </Card>
        <PipeConditionAssessmentModal
          open={distributionTransmissionStore.modalOpen}
          onClose={() => distributionTransmissionStore.setModalOpen(false)}
          assetId={distributionTransmissionStore.selectedAssetId}
        />
      </div>
      <Footer />
    </>
  );
});

export default DistributionTransmission;
