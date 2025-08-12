import React, { useState } from 'react';
import {
  Table,
  Button,
  Select,
  Breadcrumb,
  Tabs,
  Card,
  Input,
  Badge,
} from 'antd';
import {
  EditOutlined,
  CarOutlined,
  FileSearchOutlined,
  FileImageOutlined, 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { LeakData } from '../../types/Leakdata';
import DispatchModal from '../Modals/DispatchModal';
import UpdateReport from '../Modals/UpdateReport';
import ReportDetails from '../Modals/ReportDetails';
import ImageModal from '../Modals/ImageModal';


const { Option } = Select;
const { TabPane } = Tabs;

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
    referenceNo: 202506241972,
    repairedLeaks: 'Yes',
    jmsControlNo: 'JMS-001',
    dateRepaired: 'Jun 26, 2025',
    teamLeader: 'John Doe',
    leakPressure: 'Low',
    dateTurnedOver: 'Jun 22, 2025',
    turnoverReason: 'Heavy traffic; need backhoe',
    dmaId: 'DMA001',
    covering: 'SOIL',
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

const tabActionsMap: Record<
  string,
  ('dispatch' | 'edit' | 'details' | 'photos')[]
> = {
  repaired: ['details'],
  dispatched: ['details'],
  turnover: ['dispatch', 'details'],
  after: ['details'],
  notfound: ['details'],
  scheduled: ['details', 'photos', 'dispatch'], 
  default: ['dispatch', 'edit', 'details'],
  
};

const LeakReports: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [activeTab, setActiveTab] = useState('customer');
  const [searchText, setSearchText] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<LeakData | null>(null);
  const [formValues, setFormValues] = useState<Partial<LeakData>>({});
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);


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
    if (!selectedRecord) return;

    const index = selectedRecord ? data.findIndex(item => item.key === selectedRecord.key) : -1;
    if (index !== -1) {
      const updateddata: LeakData = {
        ...data[index],
        ...formValues,
        referenceNo: Number(formValues.referenceNo),
      };

      data[index] = updateddata;
    }

    setModalVisible(false);
    setFormValues({});
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

  const showImages = (record: LeakData) => {
    const images = [
      'https://via.placeholder.com/300x200?text=Repair+1',
      'https://via.placeholder.com/300x200?text=Repair+2',
    ];
    setImageUrls(images);
    setImageModalVisible(true);
  };  

   const renderActionButtons = (
    actions: ('dispatch' | 'edit' | 'photos' | 'details')[],
    record: LeakData
  ) => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
      {actions.includes('dispatch') && (
        <Button
          icon={<CarOutlined />}
          style={{ backgroundColor: '#00008B', border: 'none', color: '#FFFFFF' }}
          onClick={() => showModal('Dispatch', record)}
        />
      )}
      {actions.includes('edit') && (
        <Button
          icon={<EditOutlined />}
          style={{ backgroundColor: '#00008B', border: 'none', color: '#FFFFFF' }}
          onClick={() => showModal('Update Report', record)}
        />
      )}
      {actions.includes('photos') && (
      <Button
        icon={<FileImageOutlined />}
        style={{ backgroundColor: '#3a3ae6ff', border: 'none', color: '#FFFFFF' }}
        onClick={() => showImages(record)}
      />
      )}
      {actions.includes('details') && (
        <Button
          icon={<FileSearchOutlined />}
          style={{ backgroundColor: '#00008B', border: 'none', color: '#FFFFFF' }}
          onClick={() => showModal('Report Details', record)}
        />
      )}
    </div>
  );
  const getColumns = (tabKey: string): ColumnsType<LeakData> => {
    const keys = columnPresets[tabKey] || columnPresets['customer'];
    const cols = keys.map(k => columnMap[k]);

    const actions = tabActionsMap[tabKey] || tabActionsMap['default'];

    const actionColumn: ColumnsType<LeakData>[number] = {
      title: 'Actions',
      key: 'action',
      fixed: 'right',
      width: '120',
      render: (_, record) => renderActionButtons(actions, record),
    };

    return [...cols, actionColumn];
  };


  const dispatchField = [
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
        <Input.Search placeholder="Search" allowClear style={{ width: 300 }} onChange={e => setSearchText(e.target.value.toLowerCase())} />
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
                    <Badge count={filteredData(key).length} color="blue" overflowCount={99} size="small" style={{ paddingInline: 6, borderRadius: 4 }} />
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

      <DispatchModal
        visible={modalVisible && modalTitle === 'Dispatch'}
        onCancel={handleCancel}
        record={selectedRecord}
        fields={dispatchField}
      />

      <UpdateReport
        visible={modalVisible && modalTitle === 'Update Report'}
        record={selectedRecord}
        formValues={formValues}
        onChange={handleInputChange}
        onCancel={handleCancel}
        onSubmit={handleUpdateSubmit}
      />

      <ReportDetails
        visible={modalVisible && modalTitle === 'Report Details'}
        record={selectedRecord}
        onCancel={handleCancel}
        activeTab={activeTab}
        columnMap={columnMap}
        columnPresets={columnPresets}
      />

      <ImageModal
        visible={imageModalVisible}
        onCancel={() => setImageModalVisible(false)}
        images={imageUrls}
      />
    </div>
  );
};

export default LeakReports;