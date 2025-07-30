import React from 'react';
import { Table, Tag, Card, Row, Col } from 'antd';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

const columns = [
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

const chartData = [
  { name: 'Jan', reports: 4 },
  { name: 'Feb', reports: 7 },
  { name: 'Mar', reports: 6 },
  { name: 'Apr', reports: 9 },
  { name: 'May', reports: 5 },
  { name: 'Jun', reports: 8 },
  { name: 'Jul', reports: 3 },
  { name: 'Aug', reports: 6 },
  { name: 'Sep', reports: 4 },
  { name: 'Oct', reports: 10 },
  { name: 'Nov', reports: 2 },
  { name: 'Dec', reports: 7 },
];

const Home: React.FC = () => {
  const total = data.length;
  const dispatched = data.filter(d => d.tags.includes('dispatched')).length;
  const pending = data.filter(d => d.tags.includes('pending')).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Row gutter={[24, 24]}>
        {/* Left Column */}
        {/* Cards and Chart in the same row */}
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            {/* Welcome Card Full Width */}
            <Col xs={24}>
              <Card
                bordered={false}
                style={{
                  background: 'linear-gradient(200deg, #726e6eff, #4c85d4ff, #726e6eff, #1b1a1aff)',
                  backgroundSize: '750% 750%',
                  color: 'white',
                  borderRadius: '10px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  animation: 'gradientLoop 12s ease infinite',
                }}
              >
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Welcome, Bam!</h1>
                <p style={{ opacity: 0.9 }}>You're now viewing the latest leak report dashboard.</p>
              </Card>
            </Col>
            {/* Stat Cards in a Row */}
            <Col xs={24} md={8}>
              <Card
                bordered={false}
                style={{
                  backgroundColor: '#6ba5f7ff',
                  color: 'white',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  boxShadow: '0 2px 12px rgba(24, 144, 255, 0.15)',
                  cursor: 'pointer',
                }}
                bodyStyle={{ padding: 20 }}
                className="stat-card stat-card-total"
              >
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
              <Card
                bordered={false}
                style={{
                  backgroundColor: '#49862aff',
                  color: 'white',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  boxShadow: '0 2px 12px rgba(73, 134, 42, 0.15)',
                  cursor: 'pointer',
                }}
                bodyStyle={{ padding: 20 }}
                className="stat-card stat-card-dispatched"
              >
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
              <Card
                bordered={false}
                style={{
                  backgroundColor: '#df811dff',
                  color: 'white',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  boxShadow: '0 2px 12px rgba(223, 129, 29, 0.15)',
                  cursor: 'pointer',
                }}
                bodyStyle={{ padding: 20 }}
                className="stat-card stat-card-pending"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm">Pending</div>
                    <div className="text-3xl font-bold">{pending}</div>
                  </div>
                  <ClockCircleOutlined style={{ fontSize: 40, opacity: 0.3 }} />
                </div>
              </Card>
            </Col>
      <style>
        {`
          .stat-card:hover {
            box-shadow: 0 6px 24px rgba(24, 144, 255, 0.25), 0 1.5px 6px rgba(0,0,0,0.08);
            transform: translateY(-4px) scale(1.03);
          }
        `}
      </style>
          </Row>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="Monthly Leak Reports"
            bordered={false}
            style={{ minHeight: 250, width: '100%', minWidth: 350 }}
            bodyStyle={{ padding: '10px 10px 0 10px' }}
          >
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="reports" stroke="#1890ff" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
          </Card>
        </Col>

        {/* Table below cards and chart */}
        <Col xs={24}>
          <h2 className="text-xl font-semibold mb-4 mt-4">Leak Reports</h2>
          <Table<DataType> columns={columns} dataSource={data} pagination={false} bordered style={{ width: '100%' }} />
        </Col>

      </Row>
    </div>
  );
};

export default Home;
