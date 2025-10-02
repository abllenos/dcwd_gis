import { Button, Space } from 'antd';
import React from 'react';
import { observer } from 'mobx-react-lite';
import BlowOffValveModal from './modal/BlowOffValveModal';
import Footer from './layout/Footer';

import { Table, Input, Select, Typography, Card } from 'antd';


import { blowOffValveStore } from '../stores/blowOffValveStore';
const { Title, Text } = Typography;

const columns = [
  {
    title: 'BOV Number',
    dataIndex: 'bovnumber',
  },
  {
    title: 'WO Number',
    dataIndex: 'wonumber',
  },
  {
    title: 'Date Geocoded',
    dataIndex: 'dategeocoded',
  },
  {
    title: 'Size',
    dataIndex: 'size',
  },
  {
    title: 'Status',
    dataIndex: 'status_remarks',
  },
  {
    title: 'Date Commissioned',
    dataIndex: 'date_commissioned',
  },
  {
    title: 'Location',
    dataIndex: 'location',
  },
  {
    title: 'Barangay',
    dataIndex: 'brgycode',
  },
  {
    title: 'Action',
    key: 'action',
    width: 150,
    render: (_: any, record: any) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button className="btn-action-circle" icon={<AppstoreOutlined />} />
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
      </div>
    ),
  },
];

const BlowOffValve = observer(() => {
  // Fetch API data on mount
  React.useEffect(() => {
    blowOffValveStore.fetchBlowOffValves();
  }, []);

  const { currentPage, pageSize, search } = blowOffValveStore;
  const filteredData = blowOffValveStore.data.filter(
    row =>
      (row.workOrder?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (row.location?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (row.status?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (row.project?.toLowerCase() ?? '').includes(search.toLowerCase())
  ).map((row, idx) => ({
    ...row,
    key: `${row.bovnumber || ''}_${row.wonumber || ''}_${idx}`
  }));

  //Pagination Logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedUsers = filteredData.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
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
      <div style={{ padding: 24, background: 'var(--bg-secondary, #f7f9fc)', minHeight: '100vh' }}>
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
                value={pageSize}
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
                value={search}
                onChange={e => { blowOffValveStore.setSearch(e.target.value); blowOffValveStore.setCurrentPage(1); }}
                style={{ width: 200 }}
              />
            </div>
          </div>
          <Table
            key={`blowoff-table-page-${currentPage}-size-${pageSize}`}
            bordered
            rowKey={record => `blowoff-${record.bovnumber}-${record.wonumber}-${record.location}`}
            columns={columns}
            dataSource={paginatedUsers}
            pagination={false}
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
          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8, marginTop: 16 }}>
            <span style={{ fontSize: 12 }}>
              Showing {totalItems > 0 ? startIndex + 1 : 0} to {totalItems > 0 ? endIndex : 0} of {totalItems} entries
            </span>
            <Space>
              <Button size="small" disabled={currentPage === 1 || totalItems === 0} onClick={() => blowOffValveStore.setCurrentPage(currentPage - 1)}>Previous</Button>
              {totalItems > 0 ? getPageNumbers().map(pageNum => (
                <Button
                  key={pageNum}
                  size="small"
                  type={pageNum === currentPage ? 'primary' : 'default'}
                  onClick={() => blowOffValveStore.setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              )) : (
                <Button size="small" disabled>1</Button>
              )}
              <Button size="small" disabled={currentPage === totalPages || totalPages === 0 || totalItems === 0} onClick={() => blowOffValveStore.setCurrentPage(currentPage + 1)}>Next</Button>
            </Space>
          </div>
        </Card>
        <BlowOffValveModal
          open={blowOffValveStore.modalOpen}
          onClose={() => blowOffValveStore.setModalOpen(false)}
          initialValues={blowOffValveStore.selectedRow || {}}
        />
      </div>
      <Footer />
    </>
  );
});

export default BlowOffValve;



