import { Table, Card, Row, Col, List, Typography } from 'antd';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import MonthlyLeakChart from './MonthlyLeakChart';
import axios from 'axios';

const { Title, Text } = Typography;

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

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const logs = [
    { id: 1, user: 'ALVIN LLENOS', action: 'Created a ticket' },
    { id: 2, user: 'ALVIN LLENOS', action: 'Took a break' },
  ];

useEffect(() => {
  const fetchUserProfile = async () => {
    const empId = localStorage.getItem("username");
    const token = localStorage.getItem("token"); 
    if (!empId || !token) return;

    try {
      const res = await axios.get(
        "https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/useraccounts/GetByEmployeeID",
        {
          params: { empId },
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      const user = res?.data?.data;
      if (user) {
        setUserProfile({
          firstName: user.firstname || "",
          middleName: user.middlename || "",
          lastName: user.lastname || "",
          department: user.department || "",
          empId: user.empId || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
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
                  background: 'linear-gradient(200deg, #3e67e2ff,  #8fa5e7ff)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '26px 22px 18px 22px',
                  marginBottom: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <h1 style={{ fontSize: '2.1rem', fontWeight: 'bold', marginBottom: 8 }}>
                  {userProfile.firstName ? `Welcome, ${userProfile.firstName}!` : 'Welcome!'}
                </h1>
                <p style={{ opacity: 0.92 }}>You're now viewing the latest leak report dashboard.</p>
              </Card>
            </Col>

            <Col xs={12}>
              <Card bordered={false} style={{ ...statCardStyle(), position: 'relative' }}>
               <div style={{ textAlign: 'left', width: '100%' }}>
                <div style={labelStyle}>Total Reports</div>
                <div style={{ ...numberStyle, marginTop: 8 }}>{total}</div>
             </div>
             <div style={{ ...iconWrapperStyle, position: 'absolute', right: 12, bottom: 12 }}>
               <FileTextOutlined style={iconStyle} />
             </div>
           </Card>
         </Col>


            <Col xs={12}>
              <Card bordered={false} style={{ ...statCardStyle(), position: 'relative' }}>
                <div style={{ textAlign: 'left', width: '100%' }}>
                  <div style={labelStyle}>Dispatched</div>
                  <div style={{ ...numberStyle, marginTop: 8 }}>{total}</div>
                </div>
                <div style={{ ...iconWrapperStyle, position: 'absolute', right: 12, bottom: 12 }}>
                  <CheckCircleOutlined style={iconStyle} />
                </div>
              </Card>
            </Col>

            <Col xs={24}>
              <Card bordered={false} style={{ ...statCardStyle(), position: 'relative' }}>
               <div style={{ textAlign: 'left', width: '100%' }}>
                  <div style={labelStyle}>Pending</div>
                  <div style={{ ...numberStyle, marginTop: 8 }}>{total}</div>
                </div>
                <div style={{ ...iconWrapperStyle, position: 'absolute', right: 12, bottom: 12 }}>
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
      flex: 1,
      backgroundColor: '#ffffff',
      border: '1px solid #e0ddddff',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
    }}
    bodyStyle={{ flex: 1, padding: 16 }}
  >
    <MonthlyLeakChart data={chartData} />
        </Card>
       </Col>
      </Row>

<Row gutter={[24, 24]} style={{ marginTop: 24 }}>
<Col xs={24} lg={16}>
<Card
  bordered={false}
  style={{
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginTop: -8,
  }}
>
  <Title level={5} style={{ marginBottom: 12 }}>
    Leak Reports
  </Title>

  <Row gutter={[12, 8]} style={{ fontWeight: 600, padding: "8px 10px", borderBottom: "2px solid #f0f0f0" }}>
    <Col xs={12} sm={4}>ID</Col>
    <Col xs={12} sm={6}>Date</Col>
    <Col xs={12} sm={4}>Type</Col>
    <Col xs={12} sm={5}>Meter</Col>
    <Col xs={12} sm={5}>Status</Col>
  </Row>

  <List
    dataSource={data}
    renderItem={(item) => (
      <List.Item
        style={{
          padding: "9px 10px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Row gutter={[12, 8]} style={{ width: "100%" }}>
          <Col xs={12} sm={4}>{item.id}</Col>
          <Col xs={12} sm={6}>{item.date_time_reported}</Col>
          <Col xs={12} sm={4}>{item.leak_type}</Col>
          <Col xs={12} sm={5}>{item.ref_meter}</Col>
          <Col xs={12} sm={5}>
            {item.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  backgroundColor: tag === "dispatched" ? "#22aa52ff" : "#e67930ff",
                  color: tag === "dispatched" ? "#ebf7efff" : "#f3e9e3ff",
                  border: `1px solid ${tag === "dispatched" ? "#14bb51ff" : "#e97e26ff"}`,
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  marginTop: 4,
                  display: "inline-block",
                }}
              >
                {tag}
              </span>
            ))}
          </Col>
        </Row>
      </List.Item>
    )}
  />
</Card>
</Col>

  <Col xs={24} lg={8}>
    <Card
      bordered={false}
      className="mb-4"
      style={{
        background: "linear-gradient(200deg, #3e67e2ff,  #8fa5e7ff)",
        color: "white",
        borderRadius: 12,
        padding: "10px 14px",   
        height: 90,            
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <Title
            level={2}
            style={{
              margin: 0,
              color: "white",
              fontWeight: 600,
              fontSize: "1.5rem", 
              lineHeight: 1.1,
            }}
          >
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.9)" }}>
            {time.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </div>

        <div style={{ textAlign: "right", marginLeft: 100}}>
          <Text style={{ color: "white", fontWeight: 600 }}>Davao, PH</Text>
          <br />
          <Text style={{ color: "white" }}>30°C ☀️</Text>
        </div>
      </div>
    </Card>

    <Card
      title="Activity Logs"
      bordered={false}
      style={{
        maxHeight: 150,
        overflowY: "auto",
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={logs}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<UserOutlined />}
              title={<Text strong>{item.user}</Text>}
              description={item.action}
            />
          </List.Item>
        )}
      />
    </Card>
  </Col>
</Row>
    </div>
  );
};

const statCardStyle = () => ({
  backgroundColor: '#ffffff',
  color: '#444',
  boxShadow: `0 2px 8px rgba(0,0,0,0.08)`,
  cursor: 'default',
  display: 'flex',
  alignItems: 'center',
  minHeight: 115,
  height: 130,
  borderRadius: 8,
});

const labelStyle: React.CSSProperties = {
  fontSize: '1.10rem',
  lineHeight: 1.0,
  color: '#504f4fff',
  fontWeight: 300,
  position: 'relative',
  top: '-15px',  
};

const numberStyle: React.CSSProperties = {
  fontSize: '1.40rem',
  fontWeight: 600,
  lineHeight: 1.2,
  marginTop: 10, 
};

const iconWrapperStyle: React.CSSProperties = {
  borderRadius: '50%',
  padding: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const iconStyle: React.CSSProperties = {
  fontSize: 34,
  color: '#4169E1',
  fontWeight: 700,
};

export default Home;
