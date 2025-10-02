import React from 'react';
import { observer } from 'mobx-react-lite';
import { dmaBoundariesStore } from '../stores/dmaBoundariesStore';
import { Table, Input, Select, Card, Typography, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Footer from './layout/Footer';
import '../styles/DistrictMeteringArea.css';


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
      <div className="dma-boundaries-empty-text">
        <div>No District Metering Area Inlet Record Available</div>
      </div>
    ),
  };

  return (
    <>
      <div className="dma-boundaries-container">
        <Card>
          <div style={{ marginBottom: '24px' }}>
            <Title level={3} className="dma-boundaries-title">
              District Metering Area - Boundaries
            </Title>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <Title level={5} className="dma-boundaries-instructions-title">
              Instructions:
            </Title>
            <Text className="dma-boundaries-instructions-text">
              Instruction: Double Click row to edit Details.
            </Text>
          </div>

          <div className="dma-boundaries-controls">
            <div className="dma-boundaries-display-controls">
              <Text className="dma-boundaries-control-text">Display</Text>
              <Select
                value={pageSize.toString()}
                onChange={handlePageSizeChange}
                size="small"
                style={{ width: 80 }}
              >
                <Option value="10">10</Option>
                <Option value="25">25</Option>
                <Option value="50">50</Option>
                <Option value="100">100</Option>
              </Select>
              <Text className="dma-boundaries-control-text">records per page</Text>
            </div>

            <div className="dma-boundaries-search-controls">
              <Text className="dma-boundaries-control-text">Search:</Text>
              <Search
                placeholder=""
                size="small"
                style={{ width: 200 }}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onSearch={handleSearch}
                enterButton
              />
            </div>
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
            className="dma-boundaries-table"
          />

          <div className="dma-boundaries-footer-controls">
            <Text className="dma-boundaries-footer-text">No Record Available</Text>
            <Space>
              <Text className="dma-boundaries-footer-text">Previous</Text>
              <Text className="dma-boundaries-footer-text">Next</Text>
            </Space>
          </div>
        </Card>
      </div>
      <Footer />
    </>
  );
});

export default DistrictMeteringAreaBoundaries;