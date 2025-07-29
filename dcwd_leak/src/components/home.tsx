import React from 'react';
import { Table, Tag, Card, Row, Col } from 'antd';
import type { TableProps } from 'antd';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

interface DataType {
  key: string;
  id: string;
  date_time_reported: string;
  leak_type: string;
  location: string;
  ref_meter: string;
  ref_no: string;
  status: string;
  tags: string[];
}

const columns: TableProps<DataType>['columns'] = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Date & Time', dataIndex: 'date_time_reported', key: 'date_time_reported' },
  { title: 'Leak Type', dataIndex: 'leak_type', key: 'leak_type' },
  { title: 'Ref. Meter', dataIndex: 'ref_meter', key: 'ref_meter' },
  { title: 'Location', dataIndex: 'location', key: 'location' },
  { title: 'Ref No.', dataIndex: 'ref_no', key: 'ref_no' },
  {
    title: 'Status',
    dataIndex: 'tags',
    key: 'status',
    render: (tags: string[]) => (
      <>
        {tags.map(tag => (
          <Tag color={tag === 'dispatched' ? 'green' : 'orange'} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        ))}
      </>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    id: '12',
    date_time_reported: 'May 13, 2025, 8:00 PM',
    leak_type: 'SL',
    ref_meter: '519486764J',
    location: 'Maa',
    ref_no: '2025010351321',
    status: 'pending',
    tags: ['dispatched'],
  },
  {
    key: '2',
    id: '13',
    date_time_reported: 'May 14, 2025, 10:30 AM',
    leak_type: 'ML',
    ref_meter: '519486764K',
    location: 'Buhangin',
    ref_no: '2025010351322',
    status: 'pending',
    tags: ['pending'],
  },
];

const Home: React.FC = () => {
  const total = data.length;
  const dispatched = data.filter(d => d.tags.includes('dispatched')).length;
  const pending = data.filter(d => d.tags.includes('pending')).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Card with animated gradient */}
      <Card
        bordered={false}
        style={{
          background: 'linear-gradient(270deg, #726e6eff, #4c85d4ff, #726e6eff, #1b1a1aff)',
          backgroundSize: '800% 800%',
          color: 'white',
          marginBottom: '1.5rem',
          animation: 'gradientLoop 12s ease infinite',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white' }}>
          Welcome, Bam!
        </h1>
        <p style={{ opacity: 0.9, color: 'white' }}>
          You're now viewing the latest leak report dashboard.
        </p>
      </Card>

      {/* Summary Cards */}
      <Row gutter={16} className="mb-6">
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ backgroundColor: '#6ba5f7ff', color: 'white' }}>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm">Total Reports</div>
                <div className="text-3xl font-bold">{total}</div>
              </div>
              <FileTextOutlined style={{ fontSize: 40, opacity: 0.3 }} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ backgroundColor: '#49862aff', color: 'white' }}>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm">Dispatched</div>
                <div className="text-3xl font-bold">{dispatched}</div>
              </div>
              <CheckCircleOutlined style={{ fontSize: 40, opacity: 0.3 }} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ backgroundColor: '#df811dff', color: 'white' }}>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm">Pending</div>
                <div className="text-3xl font-bold">{pending}</div>
              </div>
              <ClockCircleOutlined style={{ fontSize: 40, opacity: 0.3 }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <h2 className="text-xl font-semibold mb-4">Leak Reports</h2>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default Home;
