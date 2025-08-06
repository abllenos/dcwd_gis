import React, { useState } from 'react';
import {
  Table,
  Button,
  Select,
  Breadcrumb,
  Modal,
  Tabs,
  Card,
  Input,
  Badge,
} from 'antd';
import {
  EditOutlined,
  CarOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
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
  leakPressure?: string;
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
    leakPressure: 'Low',
    dateTurnedOver: 'Jun 22, 2025',
    turnoverReason: 'Heavy traffic; need backhoe',
  },
];

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

const tabLabels: Record<string, string> = {
  customer: 'Customer',
  dispatched: 'Dispatched',
  serviceline: 'Leak Detection',
  turnover: 'Repair Turn-over',
  scheduled: 'Repair Scheduled',
  repaired: 'Repaired Leaks',
  after: 'Leak After the Meter',
  notfound: 'Leak Not Found',
};

const LeakReports: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [activeTab, setActiveTab] = useState('customer');
  const [searchText, setSearchText] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<LeakData | null>(null);
  const [formValues, setFormValues] = useState<Partial<LeakData>>({});

  const showModal = (title: string, record?: LeakData) => {
    setModalTitle(title);
    setSelectedRecord(record || null);
    if (title === 'Update Report' && record) {
      setFormValues({ ...record });
    }
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setFormValues({});
  };

  const handleInputChange = (field: keyof LeakData, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateSubmit = () => {
    if (selectedRecord) {
      const index = data.findIndex(item => item.key === selectedRecord.key);
      if (index !== -1) {
        data[index] = { ...data[index], ...formValues } as LeakData;
      }
      setModalVisible(false);
      setFormValues({});
    }
  };

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
        <Button icon={<CarOutlined />} style={{ backgroundColor: '#00008B', border: 'none', color: '#FFFFFF' }} onClick={() => showModal('Dispatch', record)} />
        <Button icon={<EditOutlined />} style={{ backgroundColor: '#00008B', border: 'none', color: '#FFFFFF' }} onClick={() => showModal('Update Report', record)} />
        <Button icon={<FileSearchOutlined />} style={{ backgroundColor: '#00008B', border: 'none', color: '#FFFFFF' }} onClick={() => showModal('Report Details', record)} />
      </div>
    ),
  };

  const getColumns = (tabKey: string): ColumnsType<LeakData> => {
    const keys = columnPresets[tabKey] || columnPresets['customer'];
    const cols = keys.map(k => columnMap[k]);
    
    if (tabKey === 'repaired') {
      const repairedActionColumn: ColumnsType<LeakData>[number] = {
        title: 'Actions',
        key: 'action',
        render: (_, record) => (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <Button icon={<FileSearchOutlined />} style={{ backgroundColor: '#00008B', border: 'none', color: '#FFFFFF' }} onClick={() => showModal('Reports Details', record)} />
          </div>
        ),  
    };
    return [...cols, repairedActionColumn];
  }
  return [...cols, commonActionColumn];
};  


  const dispatchFields = [
    { label: 'REPORT ID', value: selectedRecord?.id },
    { label: 'REFERENCE METER', value: selectedRecord?.referenceMeter },
    { label: 'LOCATION', value: selectedRecord?.location },
    { label: 'LANDMARK', value: selectedRecord?.landmark },
    { label: 'CONTACT NO.', value: selectedRecord?.contactNo },
    { label: 'LEAK TYPE', value: selectedRecord?.leakType },
    { label: 'LEAK PRESSURE', value: selectedRecord?.leakPressure || 'N/A' },
    
  ]; 

  return (
    <div style={{ padding: '4px 24px 24px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Breadcrumb style={{ marginBottom: 30, fontSize: 16, fontWeight: 500 }}>
          <Breadcrumb.Item>Operation</Breadcrumb.Item>
        <Breadcrumb.Item>Leak Reports</Breadcrumb.Item>
        </Breadcrumb>
        <Input.Search placeholder="Search" allowClear style={{ width: 300 }} onChange={e => setSearchText(e.target.value.toLowerCase())}/>
      </div>


      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: 8 }}>Display</span>
        <Select defaultValue="10" style={{ width: 80 }}>
          <Option value="10">10</Option>
          <Option value="20">20</Option>
          <Option value="50">50</Option>
        </Select>
        <span style={{ marginLeft: 8 }}>records per page</span>
      </div>

      <Card bodyStyle={{ padding: 25 }} style={{ marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: 8 }}>
        <Tabs activeKey={activeTab} onChange={key => setActiveTab(key)} type="card" className='custom-tabs'>
          {Object.entries(tabLabels).map(([key, label]) => (
            <TabPane
              key={key}
              tab={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, width: '100%' }}>
                  {label}
                  {!['repaired', 'after', 'notfound'].includes(key) && (
                    <Badge count={filteredData(key).length} color="blue" overflowCount={99} size="small" style={{ paddingInline: 6, borderRadius: 4 }}/>
                  )}
                </span>
              }
            />
          ))}
        </Tabs>
        <Table
          columns={getColumns(activeTab)}
          dataSource={filteredData(activeTab)}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          bordered
        />
      </Card>

      <Modal
        title={modalTitle}
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width= '60%'
        style={{maxWidth: '200vw', padding: 0 }}
        bodyStyle={{ padding: 24 }}
        centered
      >
        {modalTitle === 'Dispatch' && selectedRecord ? (
          <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            {dispatchFields.map(({ label, value }) => (
              <p key={label}>
                <strong>{label}:</strong> {value}
              </p>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
              <Select
                showSearch
                placeholder="Select dispatcher"
                optionFilterProp="children"
                style={{ minWidth: 200 }}
                filterOption={(input, option) =>
                  typeof option?.children === 'string' &&
                  (option.children as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                <Option value="dispatcher1">Dispatcher 1</Option>
                <Option value="dispatcher2">Dispatcher 2</Option>
                <Option value="dispatcher3">Dispatcher 3</Option>
              </Select>
              <Button type="primary">Dispatch Leak</Button>
            </div>
          </div>
        ) : modalTitle === 'Update Report' && selectedRecord ? (
          <div className="update-form">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label>Location:</label>
                <Input value={formValues.location} disabled />
              </div>
              <div>
                <label>Landmark:</label>
                <Input value={formValues.landmark} onChange={e => handleInputChange('landmark', e.target.value)} />
              </div>
              <div>
                <label>Contact No:</label>
                <Input value={formValues.contactNo} onChange={e => handleInputChange('contactNo', e.target.value)} />
              </div>
              <div>
                <label>Nearest Meter:</label>
                <Input value={formValues.referenceMeter} onChange={e => handleInputChange('referenceMeter', e.target.value)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label>DMA ID:</label>
                <Select placeholder="- SELECT -" onChange={(value) => handleInputChange('dmaId' as keyof LeakData, value)}>
                  <Option value="DMA001">DMA001</Option>
                  <Option value="DMA002">DMA002</Option>
                </Select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label>Covering:</label>
                <Select placeholder="- SELECT -" onChange={(value) => handleInputChange('covering' as keyof LeakData, value)}>
                  <Option value="SOIL">SOIL</Option>
                  <Option value="CONCRETE">CONCRETE</Option>
                </Select>
              </div>
              <div>
                <label>NRW Level:</label>
                <Input value={(formValues as any).nrwLevel || ''} onChange={e => handleInputChange('nrwLevel' as keyof LeakData, e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={handleCancel} style={{ background: '#00607A', color: '#fff' }}>
                Close
              </Button>
              <Button type="primary" onClick={handleUpdateSubmit}>
                Save
              </Button>
            </div>
          </div>
        ) : modalTitle === 'Report Details' && selectedRecord ? (
          <div style={{marginTop: 12 }}>
            <div style={{ 
              backgroundColor: '#3B82F6', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '10px 10px 0 0', 
              display: 'inline-block', 
              fontWeight: 600, 
              fontSize: 16 
            }}>
              <FileSearchOutlined style={{ marginRight: 8 }} />
              Report Details
            </div>

            <div   style={{
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
                {columnPresets[activeTab].map((key) => (
                  <React.Fragment key={key}>
                    <div><strong>{columnMap[key].title}:</strong></div>
                    <div>{(selectedRecord as any)[key] || 'N/A'}</div>
                  </React.Fragment>
                ))}
                <div><strong>Leak Pressure:</strong></div>
                <div>{selectedRecord.leakPressure || 'N/A'}</div>
              </div>

            {activeTab === 'repaired' && (
              <div style={{ marginBottom: 12, padding: '12px', background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: 6 }}>
                <strong>Repaired Summary:</strong>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  <li>Repaired Leak: {selectedRecord.repairedLeaks || 'N/A'}</li>
                  <li>Date Repaired: {selectedRecord.dateRepaired || 'N/A'}</li>
                  <li>Team Leader: {selectedRecord.teamLeader || 'N/A'} </li>
                </ul>
              </div>
              
            )}
          </div>  
            <div style={{ marginBottom: 12, display: 'flex', justifyContent:'flex-end' }}>
              <Button type="primary" style={{ backgroundColor: '#00B4D8', borderColor: '#00B4D8', fontWeight: 500, }} onClick={handleCancel}>
                Close  
              </Button>
            </div>  
          </div>
        ) : (
          <p>This is the {modalTitle.toLowerCase()} modal content.</p>
        )}
      </Modal>
    </div>
  );
};

export default LeakReports;