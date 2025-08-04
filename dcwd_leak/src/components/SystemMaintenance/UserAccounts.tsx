import React, { useState } from 'react';
import {
  Table,
  Button,
  Typography,
  Breadcrumb,
  Card,
  Input,
  Modal,
} from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface UserAccountData {
  key: string;
  id: string;
  employeeId: string;
  firstName: string;
  middleInitial: string;
  lastName: string;
  reporterType: string;
  department: string;
}

const userAccountData: UserAccountData[] = [
  {
    key: '1',
    id: '70124',
    employeeId: 'EMP-001',
    firstName: 'Maria',
    middleInitial: 'L',
    lastName: 'Santos',
    reporterType: 'Staff',
    department: 'Operations',
  },
];

const UserAccounts: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<UserAccountData | null>(null);

  const showDetails = (record: UserAccountData) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleCancel = () => setModalVisible(false);

  const filteredData = (): UserAccountData[] => {
    let data = userAccountData;
    if (searchText.trim()) {
      const keyword = searchText.toLowerCase();
      data = data.filter(record =>
        Object.values(record)
          .filter(val => typeof val === 'string')
          .some(val => (val as string).toLowerCase().includes(keyword))
      );
    }
    return data;
  };

  const columns: ColumnsType<UserAccountData> = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Employee ID', dataIndex: 'employeeId' },
    { title: 'Firstname', dataIndex: 'firstName' },
    { title: 'Middle Initial', dataIndex: 'middleInitial' },
    { title: 'Lastname', dataIndex: 'lastName' },
    { title: 'Reporter Type', dataIndex: 'reporterType' },
    { title: 'Department', dataIndex: 'department' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            icon={<FileSearchOutlined />}
            style={{
              backgroundColor: '#00008B',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              padding: 0,
            }}
            onClick={() => showDetails(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '4px 24px 24px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Title level={3} style={{ marginBottom: 0 }}>Maintenance - User Accounts</Title>
        <Input.Search
          placeholder="Search"
          allowClear
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value.toLowerCase())}
        />
      </div>

      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Maintenance</Breadcrumb.Item>
        <Breadcrumb.Item>User Accounts</Breadcrumb.Item>
      </Breadcrumb>

      <Card style={{ marginBottom: 0, width: '100%', maxWidth: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={filteredData()}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 'max-content' }}
          bordered
        />
      </Card>

      <Modal
        title="User Account Details"
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedRecord && (
          <div>
            <p><strong>ID:</strong> {selectedRecord.id}</p>
            <p><strong>Employee ID:</strong> {selectedRecord.employeeId}</p>
            <p><strong>Firstname:</strong> {selectedRecord.firstName}</p>
            <p><strong>Middle Initial:</strong> {selectedRecord.middleInitial}</p>
            <p><strong>Lastname:</strong> {selectedRecord.lastName}</p>
            <p><strong>Reporter Type:</strong> {selectedRecord.reporterType}</p>
            <p><strong>Department:</strong> {selectedRecord.department}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserAccounts;