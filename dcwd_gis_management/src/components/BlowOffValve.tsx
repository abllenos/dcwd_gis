
import { observer } from 'mobx-react-lite';
import BlowOffValveModal from './modal/BlowOffValveModal';
import { Table, Input, Select, Button, Typography, Card } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import Footer from './layout/Footer';
import { blowOffValveStore } from '../stores/blowOffValveStore';

const { Title, Text } = Typography;

const initialData = [
  { id: 1, workOrder: 'Un-Updated', location: 'Dapsa Village, St. John', status: 'Un-Updated', size: 50, project: 'Un-Updated' },
  { id: 2, workOrder: 'Un-Updated', location: 'Dapsa Village, St. John', status: 'Un-Updated', size: 50, project: 'Un-Updated' },
  { id: 3, workOrder: '02-02-05-17', location: 'Tahimik St., DAPSA', status: 'Un-Updated', size: 50, project: 'MI @ Purok 12-B, Tahimik St., DAPSA, Brgy. 76-A, Bucana, Davao City' },
  { id: 4, workOrder: 'Un-Updated', location: 'Manggahan', status: 'Un-Updated', size: 50, project: 'Un-Updated' },
  { id: 5, workOrder: 'Installation of 7 Units B.O.V. Bucana', location: 'Manggahan', status: 'Un-Updated', size: 50, project: 'Installation of 7 Units BOV @ Bucana' },
  { id: 6, workOrder: 'Installation of 7 Units B.O.V. Bucana', location: 'Manggahan Bucan', status: 'Un-Updated', size: 50, project: 'Installation of 7 Units BOV @ Bucana' },
];

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    sorter: (a: any, b: any) => a.id - b.id,
    width: 60,
  },
  {
    title: 'Work Order No.',
    dataIndex: 'workOrder',
  },
  {
    title: 'Location',
    dataIndex: 'location',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'Size',
    dataIndex: 'size',
    width: 70,
  },
  {
    title: 'Project Title',
    dataIndex: 'project',
  },
  {
    title: '',
    key: 'action',
    width: 60,
    render: () => (
      <Button type="primary" shape="circle" icon={<AppstoreOutlined />} style={{ background: '#1abc9c', border: 'none' }} />
    ),
  },
];



const BlowOffValve = observer(() => {
  const filteredData = initialData.filter(
    row =>
      row.workOrder.toLowerCase().includes(blowOffValveStore.search.toLowerCase()) ||
      row.location.toLowerCase().includes(blowOffValveStore.search.toLowerCase()) ||
      row.status.toLowerCase().includes(blowOffValveStore.search.toLowerCase()) ||
      row.project.toLowerCase().includes(blowOffValveStore.search.toLowerCase())
  );

  return (
    <>
      <Card style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
        <div style={{ background: '#e6edfc', borderRadius: 8, padding: '16px 24px', marginBottom: 24 }}>
          <Title level={4} style={{ color: '#2563eb', margin: 0 }}>Blow Off Valve - Maintenance</Title>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Instructions:</Text>
          <div style={{ marginLeft: 12, marginTop: 2 }}>
            <Text>Instruction: Double Click row to edit Details.</Text>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 16 }}>
          <span>Display</span>
          <Select
            value={blowOffValveStore.pageSize}
            onChange={blowOffValveStore.setPageSize.bind(blowOffValveStore)}
            style={{ width: 80 }}
            options={[10, 20, 50, 100].map(v => ({ value: v, label: v }))}
          />
          <span>records per page</span>
          <div style={{ flex: 1 }} />
          <span>Search:</span>
          <Input
            value={blowOffValveStore.search}
            onChange={e => blowOffValveStore.setSearch(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
        </div>
        <Table
          bordered
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: blowOffValveStore.pageSize }}
          style={{ background: '#fff', borderRadius: 8 }}
          onRow={record => ({
            onDoubleClick: () => {
              blowOffValveStore.setSelectedRow(record);
              blowOffValveStore.setModalOpen(true);
            },
          })}
        />
      </Card>
      <BlowOffValveModal
        open={blowOffValveStore.modalOpen}
        onClose={() => blowOffValveStore.setModalOpen(false)}
        initialValues={blowOffValveStore.selectedRow || {}}
      />
    </>
  );
});

export default BlowOffValve;
