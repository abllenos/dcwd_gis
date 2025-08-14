import React, { useEffect, useState } from 'react';
import { Table, Tabs, Button, Input, Badge, Card } from 'antd';
import { EditOutlined, CarOutlined, FileSearchOutlined, FileImageOutlined } from '@ant-design/icons';
import axios from 'axios';
import DispatchModal from '../Modals/DispatchModal';
import UpdateReport from '../Modals/UpdateReport';
import ReportDetails from '../Modals/ReportDetails';
import ImageModal from '../Modals/ImageModal';
import type { ColumnsType } from 'antd/es/table';
import type { LeakData } from '../../types/Leakdata';

const { TabPane } = Tabs;

const tabLabels: Record<string, string> = {
  customer: 'Customer',
  leakdetection: 'Leak Detection',
  dispatched: 'Dispatched',
  repaired: 'Repaired Leaks',
  scheduled: 'Repair Scheduled',
  turnover: 'Repair Turn-over',
  after: 'Leak After the Meter',
  notfound: 'Leak Not Found',
};

const tabFilters: Record<string, { dispatchStat: number; flgLeakDetection?: number }> = {
  customer: { dispatchStat: 1, flgLeakDetection: 0 },
  leakdetection: { dispatchStat: 1, flgLeakDetection: 1 },
  dispatched: { dispatchStat: 2 },
  repaired: { dispatchStat: 3 },
  scheduled: { dispatchStat: 4 },
  turnover: { dispatchStat: 5 },
  after: { dispatchStat: 6 },
  notfound: { dispatchStat: 7 },
};

const LeakReports: React.FC = () => {
  const [data, setData] = useState<LeakData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('customer');
  const [searchText, setSearchText] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<LeakData | null>(null);
  const [formValues, setFormValues] = useState<Partial<LeakData>>({});
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);


  const renderActionButtons = (record: LeakData) => (
    <div style={{ display: 'flex', gap: 4 }}>
      <Button icon={<CarOutlined />} onClick={() => showModal('Dispatch', record)} />
      <Button icon={<EditOutlined />} onClick={() => showModal('Update Report', record)} />
      <Button icon={<FileImageOutlined />} onClick={() => {
        setImageUrls(['https://via.placeholder.com/300', 'https://via.placeholder.com/300']);
        setImageModalVisible(true);
      }} />
      <Button icon={<FileSearchOutlined />} onClick={() => showModal('Report Details', record)} />
    </div>
  );

  const emptyCol = { title: '\u00A0', key: Math.random().toString(), render: () => null };

  const columnPresets: Record<string, ColumnsType<LeakData>> = {
    customer: [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Leak Type', dataIndex: 'leakType', key: 'leakType' },
      { title: 'Location', dataIndex: 'location', key: 'location' },
      { title: 'Landmark', dataIndex: 'landmark', key: 'landmark' },
      { title: 'Reference Meter', dataIndex: 'referenceMeter', key: 'referenceMeter' },
      { title: 'Contact No.', dataIndex: 'contactNo', key: 'contactNo' },
      { title: 'Date & Time Reported', dataIndex: 'dateReported', key: 'dateReported' },
      { title: 'Reference No.', dataIndex: 'referenceNo', key: 'referenceNo' },
      { title: 'Action', key: 'action', render: (_, record) => renderActionButtons(record) }
    ],
    leakdetection: [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Leak Type', dataIndex: 'leakType', key: 'leakType' },
      { title: 'Location', dataIndex: 'location', key: 'location' },
      { title: 'Landmark', dataIndex: 'landmark', key: 'landmark' },
      { title: 'Reference Meter', dataIndex: 'referenceMeter', key: 'referenceMeter' },
      { title: 'Date & Time Reported', dataIndex: 'dateReported', key: 'dateReported' },
      { title: 'Reference No.', dataIndex: 'referenceNo', key: 'referenceNo' },
      { title: 'Action', key: 'action', render: (_, record) => renderActionButtons(record) }
    ],
    dispatched: [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Leak Type', dataIndex: 'leakType', key: 'leakType' },
      { title: 'Location', dataIndex: 'location', key: 'location' },
      { title: 'Landmark', dataIndex: 'landmark', key: 'landmark' },
      { title: 'Reference Meter', dataIndex: 'referenceMeter', key: 'referenceMeter' },
      { title: 'Contact No.', dataIndex: 'contactNo', key: 'contactNo' },
      { title: 'Date & Time Reported', dataIndex: 'dateReported', key: 'dateReported' },
      { title: 'Reference No.', dataIndex: 'referenceNo', key: 'referenceNo' },
      { title: 'Action', key: 'action', render: (_, record) => renderActionButtons(record) }
    ],
    repaired: [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Leak Type', dataIndex: 'leakType', key: 'leakType' },
      { title: 'JMS Control No.', dataIndex: 'jmsControlNo', key: 'jmsControlNo' },
      { title: 'Reference Meter', dataIndex: 'referenceMeter', key: 'referenceMeter' },
      { title: 'Location', dataIndex: 'location', key: 'location' },
      { title: 'Landmark', dataIndex: 'landmark', key: 'landmark' },
      { title: 'Date Reported', dataIndex: 'dateReported', key: 'dateReported' },
      { title: 'Date Repaired', dataIndex: 'dateRepaired', key: 'dateRepaired' },
      { title: 'Team Leader', dataIndex: 'teamLeader', key: 'teamLeader' },
      { title: 'Actions', key: 'action', render: (_, record) => renderActionButtons(record) }
    ],
    scheduled: [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Leak Type', dataIndex: 'leakType', key: 'leakType' },
      { title: 'Reference No.', dataIndex: 'referenceNo', key: 'referenceNo' },
      { title: 'Reference Meter', dataIndex: 'referenceMeter', key: 'referenceMeter' },
      { title: 'Location', dataIndex: 'location', key: 'location' },
      { title: 'Landmark', dataIndex: 'landmark', key: 'landmark' },
      { title: 'Date Reported', dataIndex: 'dateReported', key: 'dateReported' },
      { title: 'Team Leader', dataIndex: 'teamLeader', key: 'teamLeader' },
      { title: 'Date Turn-overed', dataIndex: 'dateTurnOvered', key: 'dateTurnOvered' },
      { title: 'Reason', dataIndex: 'reason', key: 'reason' },
      { title: 'Actions', key: 'action', render: (_, record) => renderActionButtons(record) }
    ],
    turnover: [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Leak Type', dataIndex: 'leakType', key: 'leakType' },
      { title: 'JMS Control No.', dataIndex: 'jmsControlNo', key: 'jmsControlNo' },
      { title: 'Reference Meter', dataIndex: 'referenceMeter', key: 'referenceMeter' },
      { title: 'Location', dataIndex: 'location', key: 'location' },
      { title: 'Landmark', dataIndex: 'landmark', key: 'landmark' },
      { title: 'Date Reported', dataIndex: 'dateReported', key: 'dateReported' },
      { title: 'Team Leader', dataIndex: 'teamLeader', key: 'teamLeader' },
      { title: 'Date Turn-overed', dataIndex: 'dateTurnOvered', key: 'dateTurnOvered' },
      { title: 'Reason', dataIndex: 'reason', key: 'reason' },
      { title: 'Actions', key: 'action', render: (_, record) => renderActionButtons(record) }
    ],
    after: [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'Location', dataIndex: 'location', key: 'location' },
      { title: 'Landmark', dataIndex: 'landmark', key: 'landmark' },
      { title: 'JMS Control No.', dataIndex: 'jmsControlNo', key: 'jmsControlNo' },
      { title: 'Reference Meter', dataIndex: 'referenceMeter', key: 'referenceMeter' },
      { title: 'Date Reported', dataIndex: 'dateReported', key: 'dateReported' },
      { title: 'Team Leader', dataIndex: 'teamLeader', key: 'teamLeader' },
      { title: 'Reference No.', dataIndex: 'referenceNo', key: 'referenceNo' },
      { title: 'Actions', key: 'action', render: (_, record) => renderActionButtons(record) }
    ],
    notfound: [
      { title: 'ID', dataIndex: 'id', key: 'id' },
      { title: 'JMS Control No.', dataIndex: 'jmsControlNo', key: 'jmsControlNo' },
      { title: 'Reference Meter', dataIndex: 'referenceMeter', key: 'referenceMeter' },
      { title: 'Location', dataIndex: 'location', key: 'location' },
      { title: 'Landmark', dataIndex: 'landmark', key: 'landmark' },
      { title: 'Date Reported', dataIndex: 'dateReported', key: 'dateReported' },
      { title: 'Team Leader', dataIndex: 'teamLeader', key: 'teamLeader' },
      { title: 'Actions', key: 'action', render: (_, record) => renderActionButtons(record) }
    ]
  };

  useEffect(() => {
    fetchData(activeTab, pageIndex, pageSize);
  }, [activeTab]);

  const fetchData = async (tabKey: string, page: number, size: number) => {
    setLoading(true);
    try {
      const filter = tabFilters[tabKey];
      const params: Record<string, number> = {
        dispatchStat: filter.dispatchStat,
        pageIndex: page,
        pageSize: size
      };
      if (filter.flgLeakDetection !== undefined) {
        params.flgLeakDetection = filter.flgLeakDetection;
      }

      const res = await axios.get(
        'https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/LeakReports/GetLeakReportsFiltered',
        { params }
      );

      const apiData = res.data.data;
      setTotal(apiData.count);

      const normalized = apiData.data.map((item: any) => ({
        id: String(item.spool_ID),
        leakType: item.typeid,
        location: item.address,
        landmark: item.landmark,
        referenceMeter: item.nearestMtrAccNo || item.nearestMtr,
        contactNo: item.mobileNo,
        dateReported: item.dT_Reported,
        referenceNo: item.refAccNo,
        dispatchStat: item.dispatchStat,
        flgLeakDetection: item.flgLeakDetection,
      }));

      setData(normalized);
    } catch (error) {
      console.error('Error fetching leak reports', error);
    } finally {
      setLoading(false);
    }
  };


   const handleTableChange = (pagination: any) => {
    setPageIndex(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const filteredData = (tabKey: string) => {
    const filter = tabFilters[tabKey];
    let filtered = data.filter(d => Number(d.dispatchStat) === filter.dispatchStat);
    if (filter.flgLeakDetection !== undefined) {
      filtered = filtered.filter(d => Number(d.flgLeakDetection) === filter.flgLeakDetection);
    }
    if (searchText.trim()) {
      const keyword = searchText.toLowerCase();
      filtered = filtered.filter(record =>
        Object.values(record)
          .filter(val => typeof val === 'string' || typeof val === 'number')
          .some(val => val?.toString().toLowerCase().includes(keyword))
      );
    }
    return filtered;
  };

  const showModal = (title: string, record?: LeakData) => {
    setModalTitle(title);
    setSelectedRecord(record ?? null);
    if (title === 'Update Report' && record) {
      setFormValues({ ...record, id: String(record.id) });
    }
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setFormValues({});
    setSelectedRecord(null);
  };

  const handleInputChange = (field: keyof LeakData, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateSubmit = () => {
    if (!selectedRecord) return;
    const index = data.findIndex(d => d.id === selectedRecord.id);
    if (index !== -1) data[index] = { ...data[index], ...formValues } as LeakData;
    handleCancel();
  };

  const tabCounts: Record<string, number> = {};
  Object.keys(tabLabels).forEach(key => {
    tabCounts[key] = filteredData(key).length;
  });

  return (
    <div style={{ padding: 24 }}>
      <Input.Search
        placeholder="Search..."
        allowClear
        style={{ width: 300, marginBottom: 16 }}
        onChange={e => setSearchText(e.target.value)}
      />

      <Card bodyStyle={{ padding: 16 }}>
        <Tabs activeKey={activeTab} onChange={key => setActiveTab(key)}>
          {Object.entries(tabLabels).map(([key, label]) => (
            <TabPane
              key={key}
              tab={
                <span>
                  {label} <Badge count={tabCounts[key]} />
                </span>
              }
            />
          ))}
        </Tabs>

        <Table
          columns={columnPresets[activeTab] || []}
          dataSource={filteredData(activeTab)}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <DispatchModal
        visible={modalVisible && modalTitle === 'Dispatch'}
        onCancel={handleCancel}
        record={selectedRecord ?? undefined}
        fields={selectedRecord ? [
          { label: 'REPORT ID', value: String(selectedRecord.id) },
          { label: 'REFERENCE METER', value: selectedRecord.referenceMeter },
          { label: 'LOCATION', value: selectedRecord.location },
        ] : []}
      />

      <UpdateReport
        visible={modalVisible && modalTitle === 'Update Report'}
        record={selectedRecord ? { ...selectedRecord, id: String(selectedRecord.id) } : null}
        formValues={formValues}
        onChange={handleInputChange}
        onCancel={handleCancel}
        onSubmit={handleUpdateSubmit}
      />

      <ReportDetails
        visible={modalVisible && modalTitle === 'Report Details'}
        record={selectedRecord ? { ...selectedRecord, id: String(selectedRecord.id) } : null}
        activeTab={activeTab}
        columnMap={{}}
        columnPresets={{}}
        onCancel={handleCancel}
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
