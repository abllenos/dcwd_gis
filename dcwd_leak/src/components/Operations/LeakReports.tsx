import React, { useState } from 'react';
import {
  Table,
  Button,
  Select,
  Typography,
  Breadcrumb,
  Modal,
  Tabs,
  Card,
  Input,
} from 'antd';
import {
  EditOutlined,
  CarOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;

interface LeakData {
  key: string;
  id: string;
  leakType: string;
  location: string;
  landmark: string;
  referenceMeter: string;
  contactNo: string;
  dateTimeReported: string;
  referenceNo: string;
  repairedLeaks?: string;
  jmsControlNo?: string;
  dateRepaired?: string;
  teamLeader?: string;
  dateTurnedOver?: string;
  turnoverReason?: string;
}

const data: LeakData[] = [
  {
    key: '1',
    id: '53056',
    leakType: 'SERVICELINE',
    location: 'TEST',
    landmark: 'TEST',
    referenceMeter: '519449946J',
    contactNo: '09063425139',
    dateTimeReported: 'Jun 25, 2025 10:09 AM',
    referenceNo: '202506241972',
    repairedLeaks: 'Yes',
    jmsControlNo: 'JMS-001',
    dateRepaired: 'Jun 26, 2025',
    teamLeader: 'John Doe',
  },
  {
    key: '2',
    id: '53054',
    leakType: 'SERVICELINE',
    location: 'BERSABA DUMANLAS BUHANGIN',
    landmark: 'LIKOD SA DUMANLAS ELEM. SCHOOL / NG LEAK GI REPAIR',
    referenceMeter: '520626353J',
    contactNo: '09986222382',
    dateTimeReported: 'Jun 21, 2025 08:11 AM',
    referenceNo: '2025062125604',
  },
  {
    key: '3',
    id: '53060',
    leakType: 'MAINLINE',
    location: 'MINTAL',
    landmark: 'Near Market',
    referenceMeter: '523456789J',
    contactNo: '09123456789',
    dateTimeReported: 'Jun 20, 2025 03:15 PM',
    referenceNo: '202506202020',
    jmsControlNo: 'JMS-045',
    teamLeader: 'Jane Smith',
    dateTurnedOver: 'Jun 22, 2025',
    turnoverReason: 'Heavy traffic; need backhoe',
  },
];

// Common column definitions
const columnMap = {
  id: { title: 'ID', dataIndex: 'id', sorter: true },
  leakType: { title: 'Type of Leak', dataIndex: 'leakType' },
  location: { title: 'Reported Location', dataIndex: 'location' },
  landmark: { title: 'Landmark', dataIndex: 'landmark' },
  referenceMeter: { title: 'Ref. Meter No.', dataIndex: 'referenceMeter' },
  contactNo: { title: 'Contact Number', dataIndex: 'contactNo' },
  dateTimeReported: { title: 'Date/Time Reported', dataIndex: 'dateTimeReported', sorter: true },
  referenceNo: { title: 'Ref. Number', dataIndex: 'referenceNo' },
  repairedLeaks: { title: 'Repaired Leaks', dataIndex: 'repairedLeaks' },
  jmsControlNo: { title: 'JMS Control No.', dataIndex: 'jmsControlNo' },
  dateRepaired: { title: 'Date Repaired', dataIndex: 'dateRepaired' },
  teamLeader: { title: 'Team Leader', dataIndex: 'teamLeader' },
  dateTurnedOver: { title: 'Date Turned-Over', dataIndex: 'dateTurnedOver' },
  turnoverReason: { title: 'Reason', dataIndex: 'turnoverReason' },
};

// Column configurations for each tab
const columnPresets: Record<string, (keyof typeof columnMap)[]> = {
  customer: ['id', 'leakType', 'location', 'landmark', 'referenceMeter', 'contactNo', 'dateTimeReported', 'referenceNo'],
  serviceline: ['id', 'leakType', 'location', 'landmark', 'referenceMeter', 'referenceNo'],
  dispatched: ['id', 'leakType', 'location', 'landmark', 'referenceMeter', 'contactNo', 'dateTimeReported', 'referenceNo'],
  repaired: ['id', 'repairedLeaks', 'leakType', 'jmsControlNo', 'referenceMeter', 'location', 'landmark', 'dateTimeReported', 'dateRepaired', 'teamLeader'],
  turnover: ['id', 'leakType', 'jmsControlNo', 'referenceMeter', 'location', 'landmark', 'dateTimeReported', 'teamLeader', 'dateTurnedOver', 'turnoverReason'],
  scheduled: ['id', 'leakType', 'referenceNo', 'referenceMeter', 'location', 'landmark', 'dateTimeReported', 'teamLeader', 'dateTurnedOver', 'turnoverReason'],
  after: ['id', 'location', 'landmark', 'jmsControlNo', 'referenceMeter', 'dateTimeReported', 'teamLeader', 'referenceNo'],
  notfound: ['id', 'jmsControlNo', 'referenceMeter', 'location', 'landmark', 'dateTimeReported', 'teamLeader'],
};

const LeakReports: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [activeTab, setActiveTab] = useState('reports');
  const [searchText, setSearchText] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<LeakData | null>(null);

  const showModal = (title: string, record?: LeakData) => {
    setModalTitle(title);
    setSelectedRecord(record || null);
    setModalVisible(true);
  };


  const handleCancel = () => setModalVisible(false);

  const filteredData = (tabKey: string) => {
    let tabFiltered = data;

    if (tabKey === 'serviceline') {
      tabFiltered = tabFiltered.filter(d => d.leakType === 'SERVICELINE');
    }

    if (searchText.trim()) {
      const keyword = searchText.toLowerCase();
      tabFiltered = tabFiltered.filter(record =>
        Object.values(record)
          .filter(val => typeof val === 'string')
          .some(val => (val as string).toLowerCase().includes(keyword))
      );
    }

    return tabFiltered;
  };

  const commonActionColumn: ColumnsType<LeakData>[number] = {
    title: 'Actions',
    key: 'action',
    render: (_, record) => (
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
        <Button icon={<CarOutlined />} style={{ backgroundColor: '#00008B', border: 'none', color: '#FFFFFF' }} onClick={() => showModal('Dispatch')} />
        <Button icon={<EditOutlined />} style={{ backgroundColor: '#00008B', border: 'none', color: '#FFFFFF' }} onClick={() => showModal('Update Report')} />
        <Button icon={<FileSearchOutlined />} style={{ backgroundColor: '#00008B', border: 'none', color: '#FFFFFF' }} onClick={() => showModal('Report Details', record)} />
      </div>
    ),
  };

  const getColumns = (tabKey: string): ColumnsType<LeakData> => {
    const keys = columnPresets[tabKey] || columnPresets['customer'];
    const cols = keys.map(k => columnMap[k]);
    return [...cols, commonActionColumn];
  };

  return (
    <div style={{ padding: '4px 24px 24px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Title level={3} style={{ marginBottom: 0 }}>Leak Reports</Title>
        <Input.Search
          placeholder="Search ID, Location, Contact No..."
          allowClear
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value.toLowerCase())}
        />
      </div>

      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Operation</Breadcrumb.Item>
        <Breadcrumb.Item>Leak Reports</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 8 }}>Display</span>
        <Select defaultValue="10" style={{ width: 80 }}>
          <Option value="10">10</Option>
          <Option value="20">20</Option>
          <Option value="50">50</Option>
        </Select>
        <span style={{ marginLeft: 8 }}>records per page</span>
      </div>

      <Card style={{ marginBottom: 0}} bodyStyle={{ padding: 0 }}>
        <Tabs
          activeKey={activeTab}
          onChange={key => setActiveTab(key)}
          type="card"
          tabBarGutter={0}
        >
          <TabPane tab="Customer" key="customer" />
          <TabPane tab="Leak Detection" key="serviceline" />
          <TabPane tab="Dispatched" key="dispatched" />
          <TabPane tab="Repaired Leaks" key="repaired" />
          <TabPane tab="Repair Turn-over" key="turnover" />
          <TabPane tab="Repair Scheduled" key="scheduled" />
          <TabPane tab="Leak After the Meter" key="after" />
          <TabPane tab="Leak Not Found" key="notfound" />
        </Tabs>
      </Card>


      <Table
        columns={getColumns(activeTab)}
        dataSource={filteredData(activeTab)}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
        bordered
      />

      <Modal
        title={modalTitle}
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {modalTitle === 'Report Details' && selectedRecord ? (
          <div>
            {columnPresets[activeTab].map((key) => (
              <p key={key}>
                <strong>{columnMap[key].title}:</strong>{' '}
                {(selectedRecord as any)[key] || 'N/A'}
              </p>
            ))}
          </div>
        ) : (
          <p>This is the {modalTitle.toLowerCase()} modal content.</p>
        )}
      </Modal>
    </div>
  );
};

export default LeakReports;
