import { Table, Card, Row, Col } from 'antd';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Using axios for API request

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

// Table columns and mock data
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
        {tags.map(tag => {
          const styles: Record<string, React.CSSProperties> = {
            dispatched: {
              backgroundColor: '#22aa52ff',
              color: '#ebf7efff',
              border: '1px solid #14bb51ff',
            },
            pending: {
              backgroundColor: '#e67930ff',
              color: '#f3e9e3ff',
              border: '1px solid #e97e26ff',
            },
          };
          const style = tag === 'dispatched' ? styles.dispatched : styles.pending;
          return (
            <span
              key={tag}
              style={{
                ...style,
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 500,
                display: 'inline-block',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {tag}
            </span>
          );
        })}
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

  const [userProfile, setUserProfile] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    department: '',
    empId: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const empId = localStorage.getItem('username');
      if (!empId) return;

      try {
        const res = await axios.get(
          'https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/useraccounts/GetByEmployeeID',
          { params: { empId } }
        );

        const user = res?.data?.data;
        if (user) {
          setUserProfile({
            firstName: user.firstname || '',
            middleName: user.middlename || '',
            lastName: user.lastname || '',
            department: user.department || '',
            empId: user.empId || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen pt-20 sm:pt-24 md:pt-28">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card
                bordered={false}
                style={{
                  background: 'linear-gradient(200deg, #3b67dfff, #4c85d4ff, #726e6eff, #1b1a1aff)',
                  backgroundSize: '750% 750%',
                  color: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.11)',
                  animation: 'gradientLoop 6s ease infinite',
                  padding: '26px 22px 18px 22px',
                  marginBottom: 8,
                  transform: 'none',
                  transition: 'none',
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <h1 style={{ fontSize: '2.1rem', fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 }}>
                  {userProfile.firstName ? `Welcome, ${userProfile.firstName}!` : 'Welcome!'}
                </h1>
                <p style={{ opacity: 0.92 }}>
                  You're now viewing the latest leak report dashboard.
                </p>
              </Card>
            </Col>

            <Col xs={12}>
              <Card bordered={false} style={{ ...statCardStyle(), position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={labelStyle}>Total Reports</div>
                  <div style={numberStyle}>{total}</div>
                </div>
                <div style={{ ...iconWrapperStyle, position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                  <FileTextOutlined style={iconStyle} />
                </div>
              </Card>
            </Col>

            <Col xs={12}>
              <Card bordered={false} style={{ ...statCardStyle(), position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={labelStyle}>Dispatched</div>
                  <div style={numberStyle}>{dispatched}</div>
                </div>
                <div style={{ ...iconWrapperStyle, position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                  <CheckCircleOutlined style={iconStyle} />
                </div>
              </Card>
            </Col>

            <Col xs={24}>
              <Card bordered={false} style={{ ...statCardStyle(), position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={labelStyle}>Pending</div>
                  <div style={numberStyle}>{pending}</div>
                </div>
                <div style={{ ...iconWrapperStyle, position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                  <ClockCircleOutlined style={iconStyle} />
                </div>
              </Card>
            </Col>
          </Row>
        </Col>


        <Col xs={24} lg={12} style={{ display: 'flex' }}>
          <Card
            title="Monthly Leak Reports"
            bordered={false}
            style={{
            height: '80%',
            minHeight: 353,
            width: '100%',
            minWidth: 350,
            backgroundColor: '#ffffffff',   
            border: '1px solid #e0ddddff',  
            borderRadius: 8,
            boxShadow: 'none',            
            }}
              bodyStyle={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 10px 0 10px',
                height: '90%',
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
      stroke="#0e41a0ff"
      strokeWidth={1.5} 
      dot={false} 
    />
  </LineChart>
</ResponsiveContainer>

          </Card>
        </Col>

        <Col xs={24}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 8,
            boxShadow: 'none',
            padding: '12px',
          }}>
<Table<DataType>
              columns={columns}
              dataSource={data}
              pagination={false}
              bordered
              style={{ width: '100%' }}
            />
          </div>
        </Col>
      </Row>

<style>
  {`
    .ant-card:hover {
      box-shadow: none;
      transform: translateY(-2px);
    }

    .ant-table-thead > tr > th {
      background-color: #d1cdcdff !important;
      font-weight: 600 !important;
      text-transform: uppercase;
      font-size: 0.85rem;
    }

    .ant-table,
    .ant-table-container,
    .ant-table-tbody > tr > td,
    .ant-table-thead > tr > th {
      border-color: #d2d4d8ff !important;
    }
  `}
     </style>
    </div>
  );
};

const statCardStyle = () => ({
  backgroundColor: '#ffffff',
  color: '#1a1a1a',
  transition: 'box-shadow 0.3s, transform 0.3s',
  boxShadow: `0 2px 8px rgba(0,0,0,0.08)`,
  cursor: 'default',
  display: 'flex',
  alignItems: 'center',
  minHeight: 115,
  height: 130,
  borderRadius: 8,
});

const labelStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  lineHeight: 1.2,
  color: '#444',
  fontWeight: 600,
};

const numberStyle: React.CSSProperties = {
  fontSize: '1.35rem',
  fontWeight: 700,
  lineHeight: 1.3,
  marginTop: 2,
};

const iconWrapperStyle: React.CSSProperties = {
  borderRadius: '50%',
  padding: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const iconStyle: React.CSSProperties = {
  fontSize: 34,
  color: '#135fcaff',
  fontWeight: 700,
};

export default Home;
