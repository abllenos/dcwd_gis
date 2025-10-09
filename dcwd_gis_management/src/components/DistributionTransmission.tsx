import { observer } from 'mobx-react-lite';
import { Card, Typography, Table, Select, Input, Space, Button } from 'antd';

import PipeConditionAssessmentModal from './modal/PipeConditionAssessmentModal';
import { distributionTransmissionStore } from '../stores/distributionTransmissionStore';
import Footer from './layout/Footer';


const { Title, Text } = Typography;

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
  const { currentPage, pageSize, search } = distributionTransmissionStore;
  
  // Pagination helpers (License.tsx style)
  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);
    const filteredData = initialData.filter(
      row =>
        row.woNumber.toLowerCase().includes(search.toLowerCase()) ||
        row.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
        String(row.size).includes(search) ||
        row.type.toLowerCase().includes(search.toLowerCase())
    );
    const newTotalPages = Math.ceil(filteredData.length / newPageSize);
    distributionTransmissionStore.setPageSize(newPageSize);
    // Adjust current page if it would be out of bounds with the new page size
    if (currentPage > newTotalPages && newTotalPages > 0) {
      distributionTransmissionStore.setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      distributionTransmissionStore.setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    const filteredData = initialData.filter(
      row =>
        row.woNumber.toLowerCase().includes(search.toLowerCase()) ||
        row.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
        String(row.size).includes(search) ||
        row.type.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredData.length / distributionTransmissionStore.pageSize);
    // Ensure page is within valid bounds
    if (page >= 1 && page <= totalPages) {
      distributionTransmissionStore.setCurrentPage(page);
    }
  };

  const handleSearch = (value: string) => {
    distributionTransmissionStore.setSearch(value);
    distributionTransmissionStore.setCurrentPage(1); // Reset to first page when searching
  };
  const columns = [
  { title: 'Asset ID', dataIndex: 'id', width: 80, sorter: (a: any, b: any) => a.id - b.id, render: (_: any, _record: any, index: number) => (currentPage - 1) * pageSize + index + 1 },
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

  // Simple pagination logic (License.tsx style)
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / distributionTransmissionStore.pageSize);
  const startIndex = (distributionTransmissionStore.currentPage - 1) * distributionTransmissionStore.pageSize;
  const endIndex = Math.min(startIndex + distributionTransmissionStore.pageSize, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Generate page numbers for pagination (License.tsx style)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const currentPage = distributionTransmissionStore.currentPage;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <>
      <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '0', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '16px', marginTop: '0' }}>
        <div style={{ background: '#e6edfc', borderRadius: '12px 12px 0 0', padding: '12px 24px' }}>
          <Title level={5} style={{ color: '#2563eb', margin: 0 }}>Distribution & Transmission</Title>
        </div>
        <div style={{ padding: '16px' }}>
          <div className="license-controls-container">
            <div className="license-display-controls">
              <Text className="license-control-text">Display</Text>
              <Select
                value={distributionTransmissionStore.pageSize.toString()}
                onChange={handlePageSizeChange}
                size="small"
                style={{ width: 80 }}
                options={[
                  { value: '10', label: '10' },
                  { value: '25', label: '25' },
                  { value: '50', label: '50' },
                  { value: '100', label: '100' }
                ]}
              />
              <Text className="license-control-text">records per page</Text>
            </div>
            <div className="license-search-controls">
              <Text className="license-control-text">Search:</Text>
              <Input.Search
                size="small"
                placeholder=""
                style={{ width: 200 }}
                enterButton
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          <Table
            key={`distribution-table-page-${distributionTransmissionStore.currentPage}-size-${distributionTransmissionStore.pageSize}`}
            bordered
            rowKey={(record) => `distribution-${record.id}-${record.woNumber}`}
            columns={columns}
            dataSource={paginatedData}
            pagination={false}
            style={{ background: '#fff', borderRadius: 8 }}
          />
          {/* Pagination (License.tsx style) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8, marginTop: 16 }}>
            <Text style={{ fontSize: 12 }}>
              Showing {totalItems > 0 ? startIndex + 1 : 0} to {totalItems > 0 ? endIndex : 0} of {totalItems} entries
              {distributionTransmissionStore.search && ` (filtered from ${initialData.length} total entries)`}
            </Text>
            <Space>
              <Button size="small" disabled={distributionTransmissionStore.currentPage === 1 || totalItems === 0} onClick={() => handlePageChange(distributionTransmissionStore.currentPage - 1)}>Previous</Button>
              {totalItems > 0 ? getPageNumbers().map(pageNum => (
                <Button 
                  key={pageNum} 
                  size="small" 
                  type={pageNum === distributionTransmissionStore.currentPage ? 'primary' : 'default'} 
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )) : (
                <Button size="small" disabled>1</Button>
              )}
              <Button size="small" disabled={distributionTransmissionStore.currentPage === totalPages || totalPages === 0 || totalItems === 0} onClick={() => handlePageChange(distributionTransmissionStore.currentPage + 1)}>Next</Button>
            </Space>
          </div>
        </div>
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
