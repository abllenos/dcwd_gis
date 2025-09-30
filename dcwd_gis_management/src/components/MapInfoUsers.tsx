import { observer } from 'mobx-react-lite';
import { Card, Typography, Row, Col, Select, Input, DatePicker, Button, Table, Modal, Switch } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { mapInfoUsersStore } from '../stores/mapInfoUsersStore';
import { mapApiUserToTableRow } from '../utils/mapApiUserToTableRow';
import { useState, useEffect } from 'react';
import Footer from './layout/Footer';

const { Title } = Typography;




// Modal for Installation Details
const InstallationDetailsModal = ({ visible, onCancel, user }: any) => {
  // Example logs data (replace with real data as needed)
  const logs = [
    { key: 1, installDate: '2021-09-20', expDate: '2021-10-20', days: 'Expired', admin: 'Basio, Alexis L.' },
    { key: 2, installDate: '2025-09-19', expDate: '2025-10-19', days: '24', admin: 'Llenos, Alvin B.' },
  ];
  const [logSearch, setLogSearch] = useState('');
  const filteredLogs = logs.filter(l =>
    l.installDate.includes(logSearch) ||
    l.expDate.includes(logSearch) ||
    l.days.toString().toLowerCase().includes(logSearch.toLowerCase()) ||
    l.admin.toLowerCase().includes(logSearch.toLowerCase())
  );
  return (
    <Modal open={visible} onCancel={onCancel} footer={null} width={800} title={null}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ background: '#e6edfc', borderRadius: 8, padding: '12px 24px', marginBottom: 18 }}>
          <Typography.Title level={4} style={{ color: '#222', margin: 0 }}>Installation Details</Typography.Title>
        </div>
        <div style={{ background: '#f6f8fc', borderRadius: 6, padding: 18, marginBottom: 18 }}>
          <Row gutter={24}>
            <Col span={12}>
              <div><b>Registered To:</b> <span style={{ color: '#2563eb' }}>mpbaron</span></div>
              <div><b>Software Version:</b> <span style={{ color: '#2563eb' }}>MapInfo Professional 19</span></div>
              <div style={{ marginTop: 8 }}><Switch checkedChildren="Status" unCheckedChildren="Status" defaultChecked style={{ background: '#16c784' }} /></div>
            </Col>
            <Col span={12}>
              <div><b>Department:</b> <span style={{ color: '#2563eb' }}>{user?.department}</span></div>
              <div><b>License Type:</b> <span style={{ color: '#2563eb' }}>{user?.licenseType}</span></div>
              <div><b>PC Name:</b> <span style={{ color: '#2563eb' }}>{user?.computerName}</span></div>
            </Col>
          </Row>
        </div>
        <div style={{ background: '#e6edfc', borderRadius: 8, padding: '12px 24px', marginBottom: 12 }}>
          <Typography.Title level={5} style={{ color: '#222', margin: 0, fontWeight: 500 }}>Installation logs</Typography.Title>
        </div>
        <div style={{ background: '#f6f8fc', borderRadius: 6, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 16 }}>
            <span>Display</span>
            <Select value={10} style={{ width: 80 }} options={[10, 20, 50, 100].map(v => ({ value: v, label: v }))} disabled />
            <span>records per page</span>
            <div style={{ flex: 1 }} />
            <span>Search:</span>
            <Input value={logSearch} onChange={e => setLogSearch(e.target.value)} style={{ width: 200 }} allowClear />
          </div>
          <Table
            bordered
            rowKey="key"
            columns={[
              { title: 'Installation Date', dataIndex: 'installDate', sorter: (a, b) => a.installDate.localeCompare(b.installDate) },
              { title: 'Expiration Date', dataIndex: 'expDate', sorter: (a, b) => a.expDate.localeCompare(b.expDate) },
              { title: 'Remaining Days', dataIndex: 'days', sorter: (a, b) => a.days.toString().localeCompare(b.days.toString()) },
              { title: 'Administered By', dataIndex: 'admin' },
            ]}
            dataSource={filteredLogs}
            pagination={{ pageSize: 10, showSizeChanger: false }}
            style={{ background: '#fff', borderRadius: 8 }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 18 }}>
          <Button type="primary" style={{ background: '#2563eb', fontWeight: 600 }}>Renew</Button>
        </div>
      </div>
    </Modal>
  );
};

const columns = [
  { title: 'ID', dataIndex: 'id', width: 60, sorter: (a: any, b: any) => a.id - b.id },
  { title: 'License Type', dataIndex: 'software' },
  { title: 'Department', dataIndex: 'department' },
  { title: 'Computer Name', dataIndex: 'deviceName' },
  {
    title: '',
    key: 'action',
    width: 80,
    align: 'center' as const,
    render: (_: any, record: any) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button
          className="license-table-action-button"
          onClick={() => record.onShowModal(record)}
          title="View Details"
        >
        </button>
      </div>
    ),
  },
];



const MapInfoUsers = observer(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    mapInfoUsersStore.fetchUsers();
  }, []);

  const filteredUsers = mapInfoUsersStore.users.filter(
    u =>
      (u.software?.toLowerCase() ?? '').includes(mapInfoUsersStore.search.toLowerCase()) ||
      (u.department?.toLowerCase() ?? '').includes(mapInfoUsersStore.search.toLowerCase()) ||
      (u.computerName?.toLowerCase() ?? '').includes(mapInfoUsersStore.search.toLowerCase())
  );
  const tableData = filteredUsers.map((u, idx) => ({
  ...mapApiUserToTableRow(u, idx),
  onShowModal: (user: ReturnType<typeof mapApiUserToTableRow>) => { setSelectedUser(user); setModalVisible(true); }
  }));

  return (
    <div>
      <Card style={{ marginBottom: 24, background: '#f6f8fc', border: 'none', boxShadow: 'none' }}>
        <div style={{ background: '#e6edfc', borderRadius: 8, padding: '12px 24px', marginBottom: 18 }}>
          <Title level={5} style={{ color: '#2563eb', margin: 0 }}>Create / Update Registered Users</Title>
        </div>
        <Row gutter={16} align="middle" style={{ marginBottom: 8 }}>
          <Col span={4}>
            <div style={{ fontWeight: 500 }}>Software<span style={{ color: 'red' }}>*</span></div>
            <Select value={mapInfoUsersStore.software} onChange={mapInfoUsersStore.setSoftware.bind(mapInfoUsersStore)} style={{ width: '100%' }} placeholder="- SELECT -" />
          </Col>
          <Col span={4}>
            <div style={{ fontWeight: 500 }}>Device Name<span style={{ color: 'red' }}>*</span></div>
            <Input value={mapInfoUsersStore.deviceName} onChange={e => mapInfoUsersStore.setDeviceName(e.target.value)} placeholder="Device Name" />
          </Col>
          <Col span={4}>
            <div style={{ fontWeight: 500 }}>Department<span style={{ color: 'red' }}>*</span></div>
            <Select value={mapInfoUsersStore.department} onChange={mapInfoUsersStore.setDepartment.bind(mapInfoUsersStore)} style={{ width: '100%' }} placeholder="- SELECT -" />
          </Col>
          <Col span={4}>
            <div style={{ fontWeight: 500 }}>User ID<span style={{ color: 'red' }}>*</span></div>
            <Input value={mapInfoUsersStore.userId} onChange={e => mapInfoUsersStore.setUserId(e.target.value)} placeholder="User ID" prefix={<UserOutlined />} />
          </Col>
          <Col span={4}>
            <div style={{ fontWeight: 500 }}>Installation Date<span style={{ color: 'red' }}>*</span></div>
            <DatePicker value={mapInfoUsersStore.installDate} onChange={mapInfoUsersStore.setInstallDate.bind(mapInfoUsersStore)} style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Col>
          <Col span={4} style={{ display: 'flex', alignItems: 'end', height: '100%' }}>
            <Button type="primary" className="license-register-button">
              Register
            </Button>
          </Col>
        </Row>
      </Card>
      <Card style={{ background: '#f6f8fc', border: 'none', boxShadow: 'none' }}>
        <div style={{ background: '#e6edfc', borderRadius: 8, padding: '12px 24px', marginBottom: 18 }}>
          <Title level={5} style={{ color: '#2563eb', margin: 0 }}>List of Registered Users</Title>
        </div>
        <div style={{ marginBottom: 8 }}>
          <Button style={{ marginRight: 8 }}>All Users</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 16 }}>
          <span>Display</span>
          <Select
            value={mapInfoUsersStore.pageSize}
            onChange={mapInfoUsersStore.setPageSize.bind(mapInfoUsersStore)}
            style={{ width: 80 }}
            options={[10, 20, 50, 100].map(v => ({ value: v, label: v }))}
          />
          <span>records per page</span>
          <div style={{ flex: 1 }} />
          <span>Search:</span>
          <Input
            value={mapInfoUsersStore.search}
            onChange={e => mapInfoUsersStore.setSearch(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
        </div>
        {mapInfoUsersStore.loading ? (
          <div style={{ color: '#2563eb', fontWeight: 600, marginBottom: 16 }}>Loading...</div>
        ) : mapInfoUsersStore.error ? (
          <div style={{ color: 'red', fontWeight: 600, marginBottom: 16 }}>Error: {mapInfoUsersStore.error}</div>
        ) : (
          <Table
            bordered
            rowKey="key"
            columns={columns}
            dataSource={tableData}
            pagination={{ pageSize: mapInfoUsersStore.pageSize, showSizeChanger: false }}
            style={{ background: '#fff', borderRadius: 8 }}
          />
        )}
      </Card>
      <InstallationDetailsModal visible={modalVisible} onCancel={() => setModalVisible(false)} user={selectedUser} />
      <Footer />
    </div>
  );
});

export default MapInfoUsers;
