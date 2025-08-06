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
    id: '20124',
    location: 'Zone 1 - Barangay A',
    remarks: 'Low pressure in area',
    referenceMeter: 'RM-123456',
    contactNo: '09171234567',
    dateTimeReported: 'Jul 28, 2025 09:00 AM',
  },
];

const onProcessData: ComplaintData[] = [
  {
    key: '2',
    id: '20142',
    location: 'Zone 3 - Barangay B',
    remarks: 'No water since last night',
    referenceMeter: 'RM-654321',
    contactNo: '09981234567',
    dateTimeReported: 'Jul 28, 2025 10:30 AM',
  },
];

const completedData: ComplaintData[] = [
  {
    key: '3',
    id: '20167',
    location: 'Zone 4 - Barangay C',
    remarks: 'Resolved pressure issue',
    referenceMeter: 'RM-789123',
    contactNo: '09081234567',
    dateTimeReported: 'Jul 28, 2025 08:15 AM',
  },
];

const SupplyComplaints: React.FC = () => {
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
        <Breadcrumb style={{ marginBottom: 30, fontSize: 16, fontWeight: 500 }}>
          <Breadcrumb.Item>Operation</Breadcrumb.Item>
          <Breadcrumb.Item>Water Supply Complaints</Breadcrumb.Item>
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
                <div><strong>COMPLAINT ID</strong>      :</div>       <div>{selectedRecord.id}</div>
                <div><strong>LOCATION</strong>          :</div>           <div>{selectedRecord.location}</div>
                <div><strong>REMARKS</strong>           :</div>            <div>{selectedRecord.remarks}</div>
                <div><strong>REFERENCE METER</strong>   :</div>    <div>{selectedRecord.referenceMeter}</div>
                <div><strong>CONTACT</strong>           :</div>            <div>{selectedRecord.contactNo}</div>
                <div><strong>DATE/TIME REPORTED</strong>:</div> <div>{selectedRecord.dateTimeReported}</div>
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

            <Button type="primary" style={{ backgroundColor: '#00B4D8', borderColor: '#00B4D8', fontWeight: 500, }}>
              Submit Remarks
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupplyComplaints;
