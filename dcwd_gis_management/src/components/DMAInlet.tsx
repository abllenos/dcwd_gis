
// React import not needed with the new JSX transform
import { observer } from 'mobx-react-lite';
import { Card, Typography, Table, Select, Input, Space, Button } from 'antd';
import { SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';

import PipeConditionAssessmentModal from './modal/PipeConditionAssessmentModal';
import { dmaInletStore } from '../stores/dmaInletStore';

const { Text } = Typography;






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

  const { currentPage, pageSize, search } = dmaInletStore;
  
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
    dmaInletStore.setPageSize(newPageSize);
    // Adjust current page if it would be out of bounds with the new page size
    if (currentPage > newTotalPages && newTotalPages > 0) {
      dmaInletStore.setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      dmaInletStore.setCurrentPage(1);
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
    const totalPages = Math.ceil(filteredData.length / dmaInletStore.pageSize);
    // Ensure page is within valid bounds
    if (page >= 1 && page <= totalPages) {
      dmaInletStore.setCurrentPage(page);
    }
  };

  const handleSearch = (value: string) => {
    dmaInletStore.setSearch(value);
    dmaInletStore.setCurrentPage(1); // Reset to first page when searching
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
              dmaInletStore.setSelectedAssetId(record.id);
              dmaInletStore.setModalOpen(true);
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

  const { Title } = Typography;

    // Simple pagination logic (License.tsx style)
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / dmaInletStore.pageSize);
    const startIndex = (dmaInletStore.currentPage - 1) * dmaInletStore.pageSize;
    const endIndex = Math.min(startIndex + dmaInletStore.pageSize, totalItems);
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Generate page numbers for pagination (License.tsx style)
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      const currentPage = dmaInletStore.currentPage;
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
      <Card style={{ background: '#f6f8fc', border: 'none', boxShadow: 'none' }}>
        <div style={{ background: '#e6edfc', borderRadius: 8, padding: '12px 24px', marginBottom: 18 }}>
          <Typography.Title level={5} style={{ color: '#2563eb', margin: 0 }}>Distribution & Transmission</Typography.Title>
        </div>
        <div className="license-controls-container">
          <div className="license-display-controls">
            <Text className="license-control-text">Display</Text>
            <Select
              value={dmaInletStore.pageSize.toString()}
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
