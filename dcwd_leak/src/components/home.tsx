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
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card
                bordered={false}
                style={{
                  background: 'linear-gradient(200deg, #726e6eff, #4c85d4ff, #726e6eff, #1b1a1aff)',
                  backgroundSize: '750% 750%',
                  color: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.11)',
                  animation: 'gradientLoop 6s ease infinite',
                  padding: '26px 22px 18px 22px',
                  marginBottom: 8,
                   transform: 'none',   
                  transition: 'none',      
                 cursor: 'default'   
                }}
              >
                <h1 style={{ fontSize: '2.1rem', fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 }}>Welcome, Bam!</h1>
                <p style={{ opacity: 0.92 }}>You're now viewing the latest leak report dashboard.</p>
              </Card>
            </Col>

            <Col xs={24}>
              <div style={{ display: 'flex', gap: 16 }}>
                <Card
                  bordered={false}
                  style={{
                    backgroundColor: '#2d7be9ff',
                    color: 'white',
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    boxShadow: '0 2px 12px rgba(24, 144, 255, 0.15)',
                    cursor: 'pointer',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: 115,
                    maxHeight: 150,
                    height: 140,
                  }}
                  bodyStyle={{ width: '100%' }}
                  className="stat-card stat-card-total"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div style={{ fontSize: '1.1rem' }}>Total Reports</div>
                      <div style={{ fontSize: '1.1rem' }}>{total}</div>
                    </div>
                    <FileTextOutlined style={{ fontSize: 22, opacity: 0.3 }} />
                  </div>
                </Card>
                <Card bordered={false} style={statCardStyle('#49862aff', 'rgba(73, 134, 42, 0.15)')}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div style={{ fontSize: '1.1rem' }}>Dispatched</div>
                      <div style={{ fontSize: '1.1rem' }}>{dispatched}</div>
                    </div>
                    <CheckCircleOutlined style={{ fontSize: 22, opacity: 0.3 }} />
                  </div>
                </Card>
                <Card bordered={false} style={statCardStyle('#df811dff', 'rgba(223, 129, 29, 0.15)')}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div style={{ fontSize: '1.1rem' }}>Pending</div>
                      <div style={{ fontSize: '1.1rem' }}>{pending}</div>
                    </div>
                    <ClockCircleOutlined style={{ fontSize: 22, opacity: 0.3 }} />
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </Col>

        <Col xs={24} lg={8} style={{ display: 'flex', flexDirection: 'column', height: 380 }}>
          <Card
            title="Monthly Leak Reports"
            bordered={false}
            style={{
              height: '100%',
              minHeight: 360,
              width: '100%',
              minWidth: 350,
              backgroundColor: '#F8FBFF',
              border: '1px solid #D0E4F7',
              borderRadius: 8,
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }}
            bodyStyle={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 10px 0 10px',
              height: '100%',
              minHeight: 360,
            }}
          >
<ResponsiveContainer width="100%" height={300}>
  <LineChart 
    data={chartData} 
    margin={{ top: 10, right: 30, bottom: 30, left: 40 }}
  >
    <XAxis 
      dataKey="name" 
      axisLine={false} 
      tickLine={false} 
      interval={0} 
      tick={{ dy: 8, fontSize: 13 }} 
    />
    <YAxis axisLine={false} tickLine={false} width={30} />
    <Tooltip contentStyle={{ fontSize: 12 }} />
    <Line 
      type="monotone" 
      dataKey="reports" 
      stroke="#1890ff" 
      strokeWidth={1.5} 
      dot={false} 
    />
  </LineChart>
</ResponsiveContainer>

          </Card>
        </Col>

        <Col xs={24}>
          <div style={{
            backgroundColor: '#F8FBFF',
            border: '1px solid #D0E4F7',
            borderRadius: 8,
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            padding: '12px',
          }}>
            <Table<DataType> columns={columns} dataSource={data} pagination={false} bordered style={{ width: '100%' }} />
          </div>
        </Col>
      </Row>

      <style>
        {`
          .ant-card:hover {
            box-shadow: 0 6px 24px rgba(24, 144, 255, 0.25), 0 1.5px 6px rgba(0,0,0,0.08);
            transform: translateY(-4px) scale(1.03);
          }
        `}
      </style>
    </div>
  );
};

const statCardStyle = (bgColor: string, shadowColor: string) => ({
  backgroundColor: bgColor,
  color: 'white',
  transition: 'box-shadow 0.3s, transform 0.3s',
  boxShadow: `0 2px 12px ${shadowColor}`,
  cursor: 'pointer',
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  minHeight: 115,
  maxHeight: 150,
  height: 140,
  borderRadius: 8,
});

export default Home;
