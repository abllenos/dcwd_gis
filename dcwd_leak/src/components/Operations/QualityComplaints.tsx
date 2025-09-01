import React, { useState } from 'react';
import {
  Table,
  Button,
  Breadcrumb,
  Card,
  Input,
  Select,
  Badge,
} from 'antd';
import { FileSearchOutlined, HomeFilled, DownOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import QualityComplaintDetailsModal from '../Modals/QualityComplaintDetailsModal';

const { Option } = Select;

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

  const navigate = useNavigate();

  // Tab counts for badges
  const tabCounts = {
    reports: reportData.length,
    onprocess: onProcessData.length,
    completed: completedData.length,
  };

  const tabLabels = {
    reports: 'Reports',
    onprocess: 'On-Process',
    completed: 'Completed',
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

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
      fixed: 'right',
      width: '120',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            icon={<FileSearchOutlined />}
            onClick={() => showDetails(record)}
            style={{ 
              borderColor: "#27cc3f", 
              color: "#27cc3f",
              backgroundColor: "transparent",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#27cc3f";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#27cc3f";
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '4px 24px 24px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30}}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            icon={<HomeFilled />}
            onClick={handleHomeClick}
            type="text"
            style={{ fontSize: 16, color: '#00008B', margin: 0 }}
            shape="circle"
          />
        <Breadcrumb style={{fontSize: 16, fontWeight: 500 }}>
          <Breadcrumb.Item>Operation</Breadcrumb.Item>
          <Breadcrumb.Item>Water Quality Complaints</Breadcrumb.Item>
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
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#595959" }}>Filter by Status:</span>
          <Select
            value={activeTab}
            onChange={(value) => setActiveTab(value)}
            style={{ width: 300 }}
            suffixIcon={<DownOutlined />}
            placeholder="Select status"
          >
            {Object.entries(tabLabels).map(([key, label]) => (
              <Option key={key} value={key}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span>{label}</span>
                  <Badge 
                    count={tabCounts[key as keyof typeof tabCounts] ?? 0} 
                    size="small" 
                    color="blue" 
                    style={{ marginLeft: 8 }}
                  />
                </div>
              </Option>
            ))}
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData()}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 'max-content' }}
          bordered
        />
      </Card>

      <QualityComplaintDetailsModal
        visible={modalVisible}
        onCancel={handleCancel}
        selectedRecord={selectedRecord}
      />
    </div>
  );
};

export default QualityComplaints;
