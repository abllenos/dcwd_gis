import React, { useState } from 'react';
import {
  Table,
  Button,
  Breadcrumb,
  Card,
  Input,
  Modal,
} from 'antd';
import { FileSearchOutlined, HomeFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

interface AccessLevelData {
  key: string;
  id: string;
  accessCode: string;
  description: string;
}

const accessLevelData: AccessLevelData[] = [
  {
    key: '1',
    id: '60124',
    accessCode: 'A001',
    description: 'Admin Access',
  },
  
];

const AccessLevel: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AccessLevelData | null>(null);

  const navigate = useNavigate();

   const handleHomeClick = () => {
    navigate('/home');
  };

  const showDetails = (record: AccessLevelData) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleCancel = () => setModalVisible(false);

  const filteredData = (): AccessLevelData[] => {
    let data = accessLevelData;
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

  const columns: ColumnsType<AccessLevelData> = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Access Code', dataIndex: 'accessCode' },
    { title: 'Description', dataIndex: 'description' },
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
         <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            icon={<HomeFilled />}
            onClick={handleHomeClick}
            type="text"
            style={{ fontSize: 16, color: '#00008B', margin: 0 }}
            shape="circle"
          />
        <Breadcrumb style={{ fontSize: 16, fontWeight: 500 }}>
        <Breadcrumb.Item>Maintenance</Breadcrumb.Item>
        <Breadcrumb.Item>Access Level</Breadcrumb.Item>
        </Breadcrumb>
        </div>
        <Input.Search
          placeholder="Search"
          allowClear
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value.toLowerCase())}
        />
      </div>

      <Card className='custom-card'>
        <Table
          columns={columns}
          dataSource={filteredData()}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 'max-content' }}
          bordered
        />
      </Card>

      <Modal
        title="Access Level Details"
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedRecord && (
          <div>
            <p><strong>ID:</strong> {selectedRecord.id}</p>
            <p><strong>Access Code:</strong> {selectedRecord.accessCode}</p>
            <p><strong>Description:</strong> {selectedRecord.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AccessLevel; 