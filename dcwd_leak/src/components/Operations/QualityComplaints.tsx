import React, { useState } from 'react';
import {
  Table,
  Button,
  Breadcrumb,
  Tabs,
  Card,
  Input,
  Modal,
} from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { TabPane } = Tabs;

interface ComplaintData {
  key: string;
  id: string;
  accountNumber: string;
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
    accountNumber: '1231-0011-112351',
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
    accountNumber: '3221-51321-71523',
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
    accountNumber: '3221-5123-71523',    
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
    { title: 'Account Number', dataIndex: 'accountNumber' },
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
        <Breadcrumb style={{ marginBottom: 30, fontSize: 16, fontWeight: 500 }}>
          <Breadcrumb.Item>Operation</Breadcrumb.Item>
          <Breadcrumb.Item>Water Quality Complaints</Breadcrumb.Item>
        </Breadcrumb>

        <Input.Search
          placeholder="Search"
          allowClear
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value.toLowerCase())}
        />
      </div>

      <Card style={{ marginBottom: 0, width: '100%', maxWidth: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 25 }}>
        <Tabs
          activeKey={activeTab}
          onChange={key => setActiveTab(key)}
          type="card"
          className='custom-tabs'          
        >
          <TabPane tab="Reports" key="reports" />
          <TabPane tab="On-Process" key="onprocess" />
          <TabPane tab="Completed" key="completed" />
        </Tabs>

        <Table
          columns={columns}
          dataSource={filteredData()}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 'max-content' }}
          bordered
        />
      </Card>

      <Modal
        title="Complaint Details"
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={720}
        bodyStyle={{ padding: '24px' }}
      >
        {selectedRecord && (
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                backgroundColor: '#3B82F6',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '10px 10px 0 0',
                display: 'inline-block',
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              <FileSearchOutlined style={{ marginRight: 8 }} />
              Report Details
            </div>

            <div
              style={{
                backgroundColor: '#f8fbfe',
                border: '1px solid #bcdfff',
                borderRadius: '0 0 10px 10px',
                padding: '20px 24px',
                marginBottom: 24,
                fontSize: 15,
                lineHeight: '1.8',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 7 }}>
              <div><strong>ID:</strong> </div> <div> {selectedRecord.id}</div>
              <div><strong>Account Number:</strong> </div> <div>{selectedRecord.accountNumber}</div>
              <div><strong>Location:</strong></div> <div> {selectedRecord.location}</div>
              <div><strong>Remarks:</strong> </div> <div>{selectedRecord.remarks}</div>
              <div><strong>Reference Meter:</strong> </div> <div>{selectedRecord.referenceMeter}</div>
              <div><strong>Contact No.:</strong> </div> <div>{selectedRecord.contactNo}</div>
              <div><strong>Date/Time Reported:</strong> </div>  <div>{selectedRecord.dateTimeReported}</div>
          </div>
        </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>
                Remarks:
              </label>
              <Input.TextArea
                placeholder="Enter your remarks here..."
                rows={4}
                style={{ resize: 'none' }}
              />
            </div>

            <Button
              type="primary"
              style={{
                backgroundColor: '#00B4D8',
                borderColor: '#00B4D8',
                fontWeight: 500,
              }}
            >
              Submit Remarks
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QualityComplaints;
