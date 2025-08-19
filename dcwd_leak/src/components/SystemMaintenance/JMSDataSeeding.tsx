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

interface JMSData {
  key: string;
  id: string;
  leakType: string;
  reportedBy: string;
  remarks: string;
  name: string;
  address: string;
  dateReported: string;
  number: string;
  wsCode: string;
  deptCode: string;
  dispatchStatus: string;
  referenceAccountNo: string;
  jmsControlNo: string;
}

const jmsData: JMSData[] = [
  {
    key: '1',
    id: '80124',
    leakType: 'Mainline',
    reportedBy: 'Juan Dela Cruz',
    remarks: 'Urgent repair needed',
    name: 'Juan Dela Cruz',
    address: 'Zone 9 - Barangay H',
    dateReported: 'Jul 30, 2025 10:00 AM',
    number: '09191234567',
    wsCode: 'WS-001',
    deptCode: 'DPT-01',
    dispatchStatus: 'Pending',
    referenceAccountNo: 'REF-123456',
    jmsControlNo: 'JMS-001',
  },

];

const JMSDataSeeding: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<JMSData | null>(null);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/home');
  }

  const showDetails = (record: JMSData) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleCancel = () => setModalVisible(false);

  const filteredData = (): JMSData[] => {
    let data = jmsData;
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

  const columns: ColumnsType<JMSData> = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Leak Type', dataIndex: 'leakType' },
    { title: 'Reported By', dataIndex: 'reportedBy' },
    { title: 'Remarks', dataIndex: 'remarks' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Address', dataIndex: 'address' },
    { title: 'Date Reported', dataIndex: 'dateReported' },
    { title: 'Number', dataIndex: 'number' },
    { title: 'WS Code', dataIndex: 'wsCode' },
    { title: 'Dept Code', dataIndex: 'deptCode' },
    { title: 'Dispatch Status', dataIndex: 'dispatchStatus' },
    { title: 'Reference Account No', dataIndex: 'referenceAccountNo' },
    { title: 'JMS Control No', dataIndex: 'jmsControlNo' },
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
              shape='circle'
            />
          <Breadcrumb style={{fontSize: 16, fontWeight: 500, }}>
            <Breadcrumb.Item>Maintenance</Breadcrumb.Item>
            <Breadcrumb.Item>User Accounts</Breadcrumb.Item>
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
        title="JMS Data Details"
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedRecord && (
          <div>
            <p><strong>ID:</strong> {selectedRecord.id}</p>
            <p><strong>Leak Type:</strong> {selectedRecord.leakType}</p>
            <p><strong>Reported By:</strong> {selectedRecord.reportedBy}</p>
            <p><strong>Remarks:</strong> {selectedRecord.remarks}</p>
            <p><strong>Name:</strong> {selectedRecord.name}</p>
            <p><strong>Address:</strong> {selectedRecord.address}</p>
            <p><strong>Date Reported:</strong> {selectedRecord.dateReported}</p>
            <p><strong>Number:</strong> {selectedRecord.number}</p>
            <p><strong>WS Code:</strong> {selectedRecord.wsCode}</p>
            <p><strong>Dept Code:</strong> {selectedRecord.deptCode}</p>
            <p><strong>Dispatch Status:</strong> {selectedRecord.dispatchStatus}</p>
            <p><strong>Reference Account No:</strong> {selectedRecord.referenceAccountNo}</p>
            <p><strong>JMS Control No:</strong> {selectedRecord.jmsControlNo}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default JMSDataSeeding;
