import React from 'react';
import { Table, Tag, Button, Space, Select, Typography, Breadcrumb } from 'antd';
import { EditOutlined, CarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { Title } = Typography;

interface LeakData {
  key: string;
  id: string;
  leakType: string;
  location: string;
  landmark: string;
  referenceMeter: string;
  contactNo: string;
  dateTimeReported: string;
  referenceNo: string;
}

const data: LeakData[] = [
  {
    key: '1',
    id: '53056',
    leakType: 'SERVICELINE',
    location: 'TEST',
    landmark: 'TEST',
    referenceMeter: '519449946J',
    contactNo: '09063425139',
    dateTimeReported: 'Jun 25, 2025 10:09 AM',
    referenceNo: '202506241972',
  },
  {
    key: '2',
    id: '53054',
    leakType: 'SERVICELINE',
    location: 'BERSABA DUMANLAS BUHANGIN',
    landmark: 'LIKOD SA DUMANLAS ELEM. SCHOOL / NG LEAK GI REPAIR',
    referenceMeter: '520626353J',
    contactNo: '09986222382',
    dateTimeReported: 'Jun 21, 2025 08:11 AM',
    referenceNo: '2025062125604',
  },
];

const columns: ColumnsType<LeakData> = [
  {
    title: 'ID',
    dataIndex: 'id',
    sorter: true,
  },
  {
    title: 'LEAK TYPE',
    dataIndex: 'leakType',
  },
  {
    title: 'LOCATION',
    dataIndex: 'location',
  },
  {
    title: 'LANDMARK',
    dataIndex: 'landmark',
  },
  {
    title: 'REFERENCE METER',
    dataIndex: 'referenceMeter',
  },
  {
    title: 'CONTACT NO.',
    dataIndex: 'contactNo',
  },
  {
    title: 'DATE & TIME REPORTED',
    dataIndex: 'dateTimeReported',
    sorter: true,
  },
  {
    title: 'REFERENCE NO.',
    dataIndex: 'referenceNo',
  },
  {
    title: 'ACTION',
    key: 'action',
    render: () => (
      <Space>
        <Button icon={<CarOutlined />} type="primary" />
        <Button icon={<EditOutlined />} />
      </Space>
    ),
  },
];

const LeakReports: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      {/* Heading and Breadcrumb outside the box */}
      <Title level={3} style={{ marginBottom: 0 }}>
        Leak Reports
      </Title>
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>Operation</Breadcrumb.Item>
        <Breadcrumb.Item>Leak Reports</Breadcrumb.Item>
      </Breadcrumb>

      {/* Container box */}
      <div
        style={{
          backgroundColor: '#fff',
          padding: 24,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        {/* Filter Tags */}
        <Space wrap style={{ marginBottom: 16 }}>
          <Tag color="success">Customer 6</Tag>
          <Tag>Leak Detection 296</Tag>
          <Tag>Dispatched 415</Tag>
          <Tag>Repaired Leaks</Tag>
          <Tag>Repair Turn-over 179</Tag>
          <Tag>Repair Scheduled 572</Tag>
          <Tag>Leak After the Meter</Tag>
          <Tag>Leak Not Found</Tag>
        </Space>

        {/* Display dropdown */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8 }}>Display</span>
          <Select defaultValue="10" style={{ width: 80 }}>
            <Option value="10">10</Option>
            <Option value="20">20</Option>
            <Option value="50">50</Option>
          </Select>
          <span style={{ marginLeft: 8 }}>records per page</span>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          bordered
        />
      </div>
    </div>
  );
};

export default LeakReports;
