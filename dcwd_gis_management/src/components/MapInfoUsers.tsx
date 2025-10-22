import { observer } from 'mobx-react-lite';
import { Typography, Row, Col, Select, Input, DatePicker, Button, Table, Modal, Switch, Space, Form } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { mapInfoUsersStore } from '../stores/mapInfoUsersStore';
import { mapApiUserToTableRow } from '../utils/mapApiUserToTableRow';
import { useState, useEffect } from 'react';
import Footer from './layout/Footer';

const { Title, Text } = Typography;




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
    <Modal open={visible} onCancel={onCancel} footer={null} width={800} title={null} bodyStyle={{ padding: '24px', background: 'var(--bg-primary, #fff)' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ background: 'var(--primary-hover-bg, #f2f7fd)', borderRadius: 8, padding: '12px 24px', marginBottom: 18 }}>
          <Typography.Title level={4} style={{ color: 'var(--primary-color, #1890ff)', margin: 0 }}>Installation Details</Typography.Title>
        </div>
        <div style={{ background: 'var(--bg-secondary, #f6f8fc)', borderRadius: 6, padding: 18, marginBottom: 18 }}>
          <Row gutter={24}>
            <Col span={12}>
              <div><b>Registered To:</b> <span style={{ color: 'var(--primary-color, #2563eb)' }}>mpbaron</span></div>
              <div><b>Software Version:</b> <span style={{ color: 'var(--primary-color, #2563eb)' }}>MapInfo Professional 19</span></div>
              <div style={{ marginTop: 8 }}><Switch checkedChildren="Status" unCheckedChildren="Status" defaultChecked /></div>
            </Col>
            <Col span={12}>
              <div><b>Department:</b> <span style={{ color: 'var(--primary-color, #2563eb)' }}>{user?.department}</span></div>
              <div><b>License Type:</b> <span style={{ color: 'var(--primary-color, #2563eb)' }}>{user?.licenseType}</span></div>
              <div><b>PC Name:</b> <span style={{ color: 'var(--primary-color, #2563eb)' }}>{user?.computerName}</span></div>
            </Col>
          </Row>
        </div>
        <div style={{ background: 'var(--primary-hover-bg, #f2f7fd)', borderRadius: 8, padding: '12px 24px', marginBottom: 12 }}>
          <Typography.Title level={5} style={{ color: 'var(--primary-color, #1890ff)', margin: 0, fontWeight: 500 }}>Installation logs</Typography.Title>
        </div>
        <div style={{ background: 'var(--bg-secondary, #f6f8fc)', borderRadius: 6, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 16, color: 'var(--text-primary, #000)' }}>
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
            style={{ background: 'var(--bg-primary, #fff)', borderRadius: 8 }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 18 }}>
          <Button type="primary">Renew</Button>
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

  const { search } = mapInfoUsersStore;
  
  // Pagination helpers (License.tsx style)
  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);
    const filteredUsers = mapInfoUsersStore.users.filter(
      u =>
        (u.software?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
        (u.department?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
        (u.computerName?.toLowerCase() ?? '').includes(search.toLowerCase())
    );
    const newTotalPages = Math.ceil(filteredUsers.length / newPageSize);
    mapInfoUsersStore.setPageSize(newPageSize);
    // Adjust current page if it would be out of bounds with the new page size
    if (mapInfoUsersStore.currentPage > newTotalPages && newTotalPages > 0) {
      mapInfoUsersStore.setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      mapInfoUsersStore.setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    const filteredUsers = mapInfoUsersStore.users.filter(
      u =>
        (u.software?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
        (u.department?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
        (u.computerName?.toLowerCase() ?? '').includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredUsers.length / mapInfoUsersStore.pageSize);
    // Ensure page is within valid bounds
    if (page >= 1 && page <= totalPages) {
      mapInfoUsersStore.setCurrentPage(page);
    }
  };

  const handleSearch = (value: string) => {
    mapInfoUsersStore.setSearch(value);
    mapInfoUsersStore.setCurrentPage(1); // Reset to first page when searching
  };
  const filteredUsers = mapInfoUsersStore.users.filter(
    u =>
      (u.software?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (u.department?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (u.computerName?.toLowerCase() ?? '').includes(search.toLowerCase())
  );
  // Simple pagination logic (License.tsx style)
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / mapInfoUsersStore.pageSize);
  const startIndex = (mapInfoUsersStore.currentPage - 1) * mapInfoUsersStore.pageSize;
  const endIndex = Math.min(startIndex + mapInfoUsersStore.pageSize, totalItems);
  const paginatedData = filteredUsers.slice(startIndex, endIndex);

  // Generate page numbers for pagination (License.tsx style)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const currentPage = mapInfoUsersStore.currentPage;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };
  const tableData = paginatedData.map((u, idx) => ({
  ...mapApiUserToTableRow(u, idx),
  onShowModal: (user: ReturnType<typeof mapApiUserToTableRow>) => { setSelectedUser(user); setModalVisible(true); }
  }));

  return (
    <>
      <div style={{ border: '1px solid var(--border-color, #ddd)', borderRadius: '12px', padding: '0', backgroundColor: 'var(--bg-primary, #fff)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '16px', marginTop: '0' }}>
        <div style={{ background: 'var(--primary-hover-bg, #f2f7fd)', borderRadius: '12px 12px 0 0', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ color: 'var(--primary-color, #1890ff)', margin: 0 }}>Create / Update Registered Users</Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: 'var(--text-primary, #000)', fontSize: '14px' }}>Search:</Text>
            <Input.Search
              size="small"
              placeholder=""
              style={{ width: 200 }}
              enterButton
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div style={{ padding: '16px' }}>
          <Form
  layout="vertical"
  style={{ marginBottom: 24 }}
  onFinish={() => {}}
>
  <Row gutter={[16, 0]} align="bottom">
    <Col xs={24} sm={12} md={6} lg={4}>
      <Form.Item
        label={<span style={{ fontWeight: 500, color: 'var(--text-primary, #222)' }}>* Software</span>}
        name="software"
        rules={[{ required: true, message: 'Please select software!' }]}
      >
        <Select
          placeholder="- SELECT -"
          suffixIcon={<span style={{ opacity: 0.5 }}>⚙️</span>}
          value={mapInfoUsersStore.software}
          onChange={mapInfoUsersStore.setSoftware.bind(mapInfoUsersStore)}
          style={{ height: 40 }}
        />
      </Form.Item>
    </Col>
    <Col xs={24} sm={12} md={6} lg={4}>
      <Form.Item
        label={<span style={{ fontWeight: 500, color: 'var(--text-primary, #222)' }}>* Device Name</span>}
        name="deviceName"
        rules={[{ required: true, message: 'Please enter device name!' }]}
      >
        <Input
          placeholder="Device Name"
          prefix={<span style={{ opacity: 0.7 }}><i className="anticon anticon-laptop" /></span>}
          value={mapInfoUsersStore.deviceName}
          onChange={e => mapInfoUsersStore.setDeviceName(e.target.value)}
          style={{ height: 40 }}
        />
      </Form.Item>
    </Col>
    <Col xs={24} sm={12} md={6} lg={4}>
      <Form.Item
        label={<span style={{ fontWeight: 500, color: 'var(--text-primary, #222)' }}>* Department</span>}
        name="department"
        rules={[{ required: true, message: 'Please select department!' }]}
      >
        <Select
          placeholder="- SELECT -"
          suffixIcon={<span style={{ opacity: 0.5 }}>⚙️</span>}
          value={mapInfoUsersStore.department}
          onChange={mapInfoUsersStore.setDepartment.bind(mapInfoUsersStore)}
          style={{ height: 40 }}
        />
      </Form.Item>
    </Col>
    <Col xs={24} sm={12} md={6} lg={4}>
      <Form.Item
        label={<span style={{ fontWeight: 500, color: 'var(--text-primary, #222)' }}>* User ID</span>}
        name="userId"
        rules={[{ required: true, message: 'Please enter user ID!' }]}
      >
        <Input
          placeholder="User ID"
          prefix={<UserOutlined style={{ opacity: 0.7 }} />}
          value={mapInfoUsersStore.userId}
          onChange={e => mapInfoUsersStore.setUserId(e.target.value)}
          style={{ height: 40 }}
        />
      </Form.Item>
    </Col>
    <Col xs={24} sm={12} md={6} lg={4}>
      <Form.Item
        label={<span style={{ fontWeight: 500, color: 'var(--text-primary, #222)' }}>* Installation Date</span>}
        name="installDate"
        rules={[{ required: true, message: 'Please select installation date!' }]}
      >
        <DatePicker
          placeholder="dd/mm/yyyy"
          value={mapInfoUsersStore.installDate}
          onChange={mapInfoUsersStore.setInstallDate.bind(mapInfoUsersStore)}
          style={{ width: '100%', height: 40 }}
          format="DD/MM/YYYY"
        />
      </Form.Item>
    </Col>
    <Col xs={24} sm={12} md={6} lg={3}>
      <Form.Item>
        <Button type="primary" className="license-register-button" icon={<i className="anticon anticon-save" />} style={{ height: 40, fontWeight: 600, width: '100%' }}>
          Register
        </Button>
      </Form.Item>
    </Col>
  </Row>
</Form>
          <div className="license-controls-container">
            <div className="license-display-controls">
              <Text className="license-control-text">Display</Text>
              <Select
                value={mapInfoUsersStore.pageSize.toString()}
                onChange={handlePageSizeChange}
                size="small"
                style={{ width: 80 }}
                options={[
                  { value: '10', label: '10' },
                  { value: '25', label: '25' },
                  { value: '50', label: '50' },
                  { value: '100', label: '100' }
                ]}
              />
              <Text className="license-control-text">records per page</Text>
            </div>
          </div>
          <Table
            key={`mapinfo-table-page-${mapInfoUsersStore.currentPage}-size-${mapInfoUsersStore.pageSize}`}
            bordered
            rowKey={(record) => `mapinfo-${record.id}-${record.deviceName}`}
            columns={columns}
            dataSource={tableData}
            pagination={false}
            style={{ background: 'var(--bg-primary, #fff)', borderRadius: 8 }}
          />
          {/* Pagination (License.tsx style) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8, marginTop: 16 }}>
            <Text style={{ fontSize: 12 }}>
              Showing {totalItems > 0 ? startIndex + 1 : 0} to {totalItems > 0 ? endIndex : 0} of {totalItems} entries
              {mapInfoUsersStore.search && ` (filtered from ${mapInfoUsersStore.users.length} total entries)`}
            </Text>
            <Space>
              <Button size="small" disabled={mapInfoUsersStore.currentPage === 1 || totalItems === 0} onClick={() => handlePageChange(mapInfoUsersStore.currentPage - 1)}>Previous</Button>
              {totalItems > 0 ? getPageNumbers().map(pageNum => (
                <Button 
                  key={pageNum} 
                  size="small" 
                  type={pageNum === mapInfoUsersStore.currentPage ? 'primary' : 'default'} 
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )) : (
                <Button size="small" disabled>1</Button>
              )}
              <Button size="small" disabled={mapInfoUsersStore.currentPage === totalPages || totalPages === 0 || totalItems === 0} onClick={() => handlePageChange(mapInfoUsersStore.currentPage + 1)}>Next</Button>
            </Space>
          </div>
        </div>
        <InstallationDetailsModal visible={modalVisible} onCancel={() => setModalVisible(false)} user={selectedUser} />
      </div>
      <Footer />
    </>
  );
});

export default MapInfoUsers;
