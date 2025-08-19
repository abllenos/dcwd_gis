import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Breadcrumb,
  Card,
  Input,
  Modal,
} from 'antd';
import { FileSearchOutlined, HomeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { devApi } from '../Endpoints/Interceptor';

interface UserAccountData {
  key: string;
  id: number;
  empID: string;
  firstName: string;
  middleName: string;
  lastName: string;
  reporterType: string;
  department: string;
}

const UserAccounts: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<UserAccountData | null>(null);
  const [data, setData] = useState<UserAccountData[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/home');
  };

  const showDetails = (record: UserAccountData) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleCancel = () => setModalVisible(false);

  const filteredData = (): UserAccountData[] => {
    if (!searchText.trim()) return data;
    const keyword = searchText.toLowerCase();
    return data.filter(record =>
      Object.values(record)
        .filter(val => typeof val === 'string')
        .some(val => (val as string).toLowerCase().includes(keyword))
    );
  };

  const columns: ColumnsType<UserAccountData> = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Employee ID', dataIndex: 'empID' },
    { title: 'Firstname', dataIndex: 'firstName' },
    { title: 'Middle Name', dataIndex: 'middleName' },
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

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await devApi.get(
        'dcwd-gis/api/v1/admin/useraccounts/list'
      );

      if (res.data?.data) {
        const mappedData: UserAccountData[] = res.data.data.map((item: any) => ({
          key: item.id.toString(),
          id: item.id,
          empID: item.empID,
          firstName: item.firstName,
          middleName: item.middleName,
          lastName: item.lastName,
          reporterType: item.reporterType,
          department: item.department,
        }));
        setData(mappedData);
      }
    } catch (err) {
      console.error('Failed to fetch user accounts', err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  

  return (
    <div style={{ padding: '4px 24px 24px 24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            icon={<HomeOutlined />}
            onClick={handleHomeClick}
            type="text"
            style={{ fontSize: 16, color: '#00008B', margin: 0 }}
            shape="circle"
          />
          <Breadcrumb style={{ fontSize: 16, fontWeight: 500 }}>
            <Breadcrumb.Item>Maintenance</Breadcrumb.Item>
            <Breadcrumb.Item>User Accounts</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Input.Search
          placeholder="Search"
          allowClear
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Card className='custom-card'>
        <Table
          columns={columns}
          dataSource={filteredData()}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 'max-content' }}
          bordered
          loading={loading}
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
            <p><strong>Employee ID:</strong> {selectedRecord.empID}</p>
            <p><strong>Firstname:</strong> {selectedRecord.firstName}</p>
            <p><strong>Middle Name:</strong> {selectedRecord.middleName}</p>
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
