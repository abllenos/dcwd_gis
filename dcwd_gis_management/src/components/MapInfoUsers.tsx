
import { observer } from 'mobx-react-lite';
import { Card, Typography, Row, Col, Select, Input, DatePicker, Button, Table } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { mapInfoUsersStore } from '../stores/mapInfoUsersStore';

const { Title } = Typography;

const initialUsers = [
  { id: 1, licenseType: 'Trial Version', department: 'Pipelines and Appurtenances Maintenance Department', computerName: 'DESKTOP-01' },
  { id: 2, licenseType: 'Trial Version', department: 'Pipelines and Appurtenances Maintenance Department', computerName: 'DCWD391' },
  { id: 3, licenseType: 'Trial Version', department: 'Engineering and Construction Department', computerName: 'DCWD400' },
  { id: 4, licenseType: 'Trial Version', department: 'Commercial Services Department', computerName: 'DCWD172' },
  { id: 5, licenseType: 'Trial Version', department: 'Commercial Services Department', computerName: 'EDP84' },
  { id: 6, licenseType: 'Trial Version', department: 'Pipelines and Appurtenances Maintenance Department', computerName: 'LAPTOP-JURD31VD' },
  { id: 7, licenseType: 'Trial Version', department: 'Commercial Services Department', computerName: 'ICT13' },
  { id: 8, licenseType: 'Trial Version', department: 'Commercial Services Department', computerName: 'DCWD166' },
  { id: 9, licenseType: 'Trial Version', department: 'Pipelines and Appurtenances Maintenance Department', computerName: 'DCWD394' },
  { id: 10, licenseType: 'Viewer Version', department: 'Engineering and Construction Department', computerName: 'DCWD003' },
];

const columns = [
  { title: 'ID', dataIndex: 'id', width: 60, sorter: (a: any, b: any) => a.id - b.id },
  { title: 'License Type', dataIndex: 'licenseType' },
  { title: 'Department', dataIndex: 'department' },
  { title: 'Computer Name', dataIndex: 'computerName' },
  {
    title: '',
    key: 'action',
    width: 60,
    render: () => (
      <Button type="primary" shape="circle" icon={<UserOutlined />} style={{ background: '#16c784', border: 'none' }} />
    ),
  },
];


const MapInfoUsers = observer(() => {
  const filteredUsers = initialUsers.filter(
    u =>
      u.licenseType.toLowerCase().includes(mapInfoUsersStore.search.toLowerCase()) ||
      u.department.toLowerCase().includes(mapInfoUsersStore.search.toLowerCase()) ||
      u.computerName.toLowerCase().includes(mapInfoUsersStore.search.toLowerCase())
  );

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
            <Button type="primary" style={{ background: '#16c784', fontWeight: 600, width: '100%' }}>
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
        <Table
          bordered
          rowKey="id"
          columns={columns}
          dataSource={filteredUsers}
          pagination={{ pageSize: mapInfoUsersStore.pageSize, showSizeChanger: false }}
          style={{ background: '#fff', borderRadius: 8 }}
        />
      </Card>
    </div>
  );
});

export default MapInfoUsers;
