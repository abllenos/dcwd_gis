import { Modal, Button, Table, Typography, Select, Input } from 'antd';
import { useState } from 'react';

const { Title } = Typography;

import type { ModalProps } from 'antd';

interface PmsMaintenanceModalProps {
  open: boolean;
  onClose: () => void;
}

const columns = [
  {
    title: <span>Maintenance<br /><span style={{ fontWeight: 400 }}>Trans ID</span></span>,
    dataIndex: 'transId',
    width: 90,
    align: 'center' as const,
    onCell: () => ({ style: { verticalAlign: 'top' } }),
  },
  {
    title: <span>Maintenance<br /><span style={{ fontWeight: 400 }}>Date</span></span>,
    dataIndex: 'date',
    width: 110,
    align: 'center' as const,
  },
  {
    title: 'Surroundings',
    dataIndex: 'surroundings',
    width: 120,
    align: 'center' as const,
  },
  {
    title: <span>Panel Box<br /><span style={{ fontWeight: 400 }}>Box</span></span>,
    dataIndex: 'panelBox',
    width: 90,
    align: 'center' as const,
  },
  {
    title: <span>Panel Box<br /><span style={{ fontWeight: 400 }}>Stand</span></span>,
    dataIndex: 'panelStand',
    width: 90,
    align: 'center' as const,
  },
  {
    title: <span>Panel Box<br /><span style={{ fontWeight: 400 }}>Logo</span></span>,
    dataIndex: 'panelLogo',
    width: 90,
    align: 'center' as const,
  },
  {
    title: <span>Barricade<br /><span style={{ fontWeight: 400 }}>Painted</span></span>,
    dataIndex: 'barricadePainted',
    width: 90,
    align: 'center' as const,
  },
  {
    title: <span>Barricade<br /><span style={{ fontWeight: 400 }}>Sticker</span></span>,
    dataIndex: 'barricadeSticker',
    width: 90,
    align: 'center' as const,
  },
  {
    title: 'Remarks',
    dataIndex: 'remarks',
    width: 120,
    align: 'center' as const,
  },
];

const PmsMaintenanceModal: React.FC<PmsMaintenanceModalProps> = ({ open, onClose }) => {
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  // Placeholder for data
  const data: any[] = [];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
      style={{ top: 16 }}
      bodyStyle={{ padding: 0, background: 'transparent' }}
      destroyOnClose
      title={null}
    >
      <div style={{ padding: '32px 32px 0 32px' }}>
        <Title level={3} style={{ margin: 0, color: '#444' }}>PMS Maintenance</Title>
        <Button type="primary" style={{ margin: '24px 0 16px 0', fontWeight: 600, fontSize: 16 }}>
          Add Maintenance Record
        </Button>
        <div style={{ background: '#e6edfc', borderRadius: 12, padding: '18px 18px 8px 18px', marginBottom: 0 }}>
          <Title level={5} style={{ color: '#2563eb', margin: 0, fontWeight: 600 }}>
            Pressure Monitoring System - Maintenance Logs
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0 12px 0', gap: 16 }}>
            <span>Show</span>
            <Select
              value={pageSize}
              onChange={setPageSize}
              style={{ width: 80 }}
              options={[10, 20, 50, 100].map(v => ({ value: v, label: v }))}
            />
            <span>entries</span>
            <div style={{ flex: 1 }} />
            <span>Search:</span>
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />
          </div>
          <Table
            bordered
            rowKey="transId"
            columns={columns}
            dataSource={data}
            pagination={{ pageSize, showSizeChanger: false }}
            style={{ background: '#fff', borderRadius: 8 }}
            locale={{ emptyText: 'No data available in table' }}
            scroll={{ x: 1100 }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default PmsMaintenanceModal;
