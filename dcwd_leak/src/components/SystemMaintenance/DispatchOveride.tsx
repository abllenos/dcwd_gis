import React, { useState } from 'react';
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


interface DispatchData {
  key: string;
  id: string;
  contactPerson: string;
  location: string;
  landmark: string;
  contactNo: string;
  status: string;
  referenceNo: string;
}

const dispatchData: DispatchData[] = [
  {
    key: '1',
    id: '40124',
    contactPerson: 'Juan Dela Cruz',
    location: 'Zone 7 - Barangay G',
    landmark: 'Near Church',
    contactNo: '09190001111',
    status: 'Pending',
    referenceNo: 'REF-001',
  },

];

const DispatchOveride: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DispatchData | null>(null);

  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/home');
  };
  
  const showDetails = (record: DispatchData) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleCancel = () => setModalVisible(false);

  const filteredData = (): DispatchData[] => {
    let data = dispatchData;
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

  const columns: ColumnsType<DispatchData> = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Contact Person', dataIndex: 'contactPerson' },
    { title: 'Location', dataIndex: 'location' },
    { title: 'Landmark', dataIndex: 'landmark' },
    { title: 'Contact No.', dataIndex: 'contactNo' },
    { title: 'Status', dataIndex: 'status' },
    { title: 'Reference No.', dataIndex: 'referenceNo' },
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
            icon={<HomeOutlined />}
            onClick={handleHomeClick}
            type="text"
            style={{ fontSize: 16, color: '#00008B', margin: 0 }}
            shape="circle"
          />
          <Breadcrumb style={{ fontSize: 16, fontWeight: 500 }}>
            <Breadcrumb.Item>Maintenance</Breadcrumb.Item>
            <Breadcrumb.Item>Caretaker Assignment</Breadcrumb.Item>
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
        title="Dispatch Details"
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedRecord && (
          <div>
            <p><strong>ID:</strong> {selectedRecord.id}</p>
            <p><strong>Contact Person:</strong> {selectedRecord.contactPerson}</p>
            <p><strong>Location:</strong> {selectedRecord.location}</p>
            <p><strong>Landmark:</strong> {selectedRecord.landmark}</p>
            <p><strong>Contact No.:</strong> {selectedRecord.contactNo}</p>
            <p><strong>Status:</strong> {selectedRecord.status}</p>
            <p><strong>Reference No.:</strong> {selectedRecord.referenceNo}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DispatchOveride;