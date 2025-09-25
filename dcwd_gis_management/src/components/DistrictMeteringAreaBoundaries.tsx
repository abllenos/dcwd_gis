import React from 'react';
import { observer } from 'mobx-react-lite';
import { dmaBoundariesStore } from '../stores/dmaBoundariesStore';
import { Table, Input, Select, Card, Typography, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Footer from './layout/Footer';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface DMABoundaryRecord {
  key: string;
  dmaCode: string;
  workOrderNo: string;
  address: string;
  status: string;
}

const DistrictMeteringAreaBoundaries: React.FC = observer(() => {
  const { pageSize, setPageSize, search, setSearch } = dmaBoundariesStore;

  // Sample data - replace with actual data from your API
  const data: DMABoundaryRecord[] = [
    // Currently empty as shown in the image
  ];

  const columns: ColumnsType<DMABoundaryRecord> = [
    {
      title: 'DMA Code',
      dataIndex: 'dmaCode',
      key: 'dmaCode',
      sorter: true,
      showSorterTooltip: false,
    },
    {
      title: 'Work Order No.',
      dataIndex: 'workOrderNo',
      key: 'workOrderNo',
      sorter: true,
      showSorterTooltip: false,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      sorter: true,
      showSorterTooltip: false,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      showSorterTooltip: false,
    },
  ];

  const handlePageSizeChange = (value: string) => {
    setPageSize(parseInt(value));
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const locale = {
    emptyText: (
      <div style={{ padding: '40px 0', color: '#999' }}>
        <div>No District Metering Area Inlet Record Available</div>
      </div>
    ),
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={3} style={{ color: '#1890ff', margin: 0 }}>
            District Metering Area - Boundaries
          </Title>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <Title level={5} style={{ color: '#666', marginBottom: '8px' }}>
            Instructions:
          </Title>
          <Text style={{ color: '#999' }}>
            Instruction: Double Click row to edit Details.
          </Text>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px' 
        }}>
          <Space>
            <Text>Display</Text>
            <Select
              value={pageSize.toString()}
              onChange={handlePageSizeChange}
              style={{ width: 80 }}
            >
              <Option value="10">10</Option>
              <Option value="25">25</Option>
              <Option value="50">50</Option>
              <Option value="100">100</Option>
            </Select>
            <Text>records per page</Text>
          </Space>

          <Space>
            <Text>Search:</Text>
            <Search
              placeholder="Search..."
              allowClear
              style={{ width: 200 }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onSearch={handleSearch}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total, range) => 
              `Showing ${range[0]} to ${range[1]} of ${total} entries`,
          }}
          locale={locale}
          style={{ marginBottom: '16px' }}
        />

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          color: '#999'
        }}>
          <Text style={{ color: '#999' }}>No Record Available</Text>
          <Space>
            <Text style={{ color: '#999' }}>Previous</Text>
            <Text style={{ color: '#999' }}>Next</Text>
          </Space>
        </div>
      </Card>
    </div>
  );
});

export default DistrictMeteringAreaBoundaries;