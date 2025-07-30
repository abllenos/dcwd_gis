import React, { useState } from 'react';
import {
  Table,
  Button,
  Typography,
  Breadcrumb,
  Tabs,
  Card,
  Input,
  Modal,
} from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { TabPane } = Tabs;

interface ComplaintData {
  key: string;
  id: string;
  location: string;
  remarks: string;
  referenceMeter: string;
  contactNo: string;
  dateTimeReported: string;
}

const reportData: ComplaintData[] = [
  {
    key: '1',
    id: '30124',
    location: 'Zone 2 - Barangay D',
    remarks: 'Water has unusual odor',
    referenceMeter: 'RM-543210',
    contactNo: '09180001111',
    dateTimeReported: 'Jul 29, 2025 08:45 AM',
  },
];

const onProcessData: ComplaintData[] = [
  {
    key: '2',
    id: '30125',
    location: 'Zone 5 - Barangay E',
    remarks: 'Discoloration in tap water',
    referenceMeter: 'RM-678901',
    contactNo: '09990002222',
    dateTimeReported: 'Jul 29, 2025 09:30 AM',
  },
];

const completedData: ComplaintData[] = [
  {
    key: '3',
    id: '30126',
    location: 'Zone 6 - Barangay F',
    remarks: 'Resolved taste issue',
    referenceMeter: 'RM-112233',
    contactNo: '09220003333',
    dateTimeReported: 'Jul 29, 2025 07:30 AM',
  },
];

const QualityComplaints: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ComplaintData | null>(null);

  const showDetails = (record: ComplaintData) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleCancel = () => setModalVisible(false);

  const filteredData = (): ComplaintData[] => {
    let tabData: ComplaintData[] = [];

    switch (activeTab) {
      case 'reports':
        tabData = reportData;
        break;
      case 'onprocess':
        tabData = onProcessData;
        break;
      case 'completed':
        tabData = completedData;
        break;
    }

    if (searchText.trim()) {
      const keyword = searchText.toLowerCase();
      tabData = tabData.filter(record =>
        Object.values(record)
          .filter(val => typeof val === 'string')
          .some(val => (val as string).toLowerCase().includes(keyword))
      );
    }

    return tabData;
  };

  const columns: ColumnsType<ComplaintData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: (a, b) => Number(a.id) - Number(b.id),
      sortDirections: ['ascend', 'descend'],
    },
    { title: 'Location', dataIndex: 'location' },
    { title: 'Remarks', dataIndex: 'remarks' },
    { title: 'Reference Meter', dataIndex: 'referenceMeter' },
    { title: 'Contact No.', dataIndex: 'contactNo' },
    { title: 'Date/Time Reported', dataIndex: 'dateTimeReported' },
    {
      title: 'Actions',
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
        <Title level={3} style={{ marginBottom: 0 }}>Quality Complaints</Title>
        <Input.Search
          placeholder="Search"
          allowClear
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value.toLowerCase())}
        />
      </div>

      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Operation</Breadcrumb.Item>
        <Breadcrumb.Item>Quality Complaints</Breadcrumb.Item>
      </Breadcrumb>

      <Card style={{ marginBottom: 0 }} bodyStyle={{ padding: 0 }}>
        <Tabs
          activeKey={activeTab}
          onChange={key => setActiveTab(key)}
          type="card"
        >
          <TabPane tab="Reports" key="reports" />
          <TabPane tab="On-Process" key="onprocess" />
          <TabPane tab="Completed" key="completed" />
        </Tabs>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredData()}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 'max-content' }}
        bordered
      />

      <Modal
        title="Complaint Details"
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedRecord && (
          <div>
            <p><strong>ID:</strong> {selectedRecord.id}</p>
            <p><strong>Location:</strong> {selectedRecord.location}</p>
            <p><strong>Remarks:</strong> {selectedRecord.remarks}</p>
            <p><strong>Reference Meter:</strong> {selectedRecord.referenceMeter}</p>
            <p><strong>Contact No.:</strong> {selectedRecord.contactNo}</p>
            <p><strong>Date/Time Reported:</strong> {selectedRecord.dateTimeReported}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QualityComplaints;
