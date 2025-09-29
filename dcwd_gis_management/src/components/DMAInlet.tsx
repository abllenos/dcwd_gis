

import { observer } from 'mobx-react-lite';
import { Card, Typography, Table, Select, Input, Button, Space, Spin, Alert } from 'antd';
import { SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import PipeConditionAssessmentModal from './modal/PipeConditionAssessmentModal';
import { dmaInletStore } from '../stores/dmaInletStore';
import { useQuery } from '@tanstack/react-query';
import Footer from './layout/Footer';
import axios from 'axios';

const { Title } = Typography;

interface DMAInletRecord {
  id: number;
  woNumber: string;
  projectTitle: string;
  size: number;
  type: string;
  length: number;
}

const API_URL = 'http://192.100.140.198/helpers/gis/mgtsys/getLayers/getDmaInlet.php';
const fetchDMAInlet = async (): Promise<DMAInletRecord[]> => {
  const response = await axios.get(API_URL);
  let data = response.data;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    data = data.results || data.data || [];
  }
  return (Array.isArray(data) ? data : []).map((item: any, idx: number) => ({
    id: item.gid ?? item.id ?? idx + 1,
    woNumber: item.woNumber || item.wo_number || item.wonumber || '',
    projectTitle: item.projectTitle || item.project_title || '',
    size: item.size || item.diameter || 0,
    type: item.type || item.pipe_type || '',
    length: item.length || item.pipe_length || 0,
    ...item,
  }));
};




const DMAInlet = observer(() => {
  const { data, isLoading, error } = useQuery<DMAInletRecord[]>({
    queryKey: ['dmaInletData'],
    queryFn: fetchDMAInlet,
  });

  const columns = [
    { title: 'Asset ID', dataIndex: 'id', width: 80, sorter: (a: any, b: any) => a.id - b.id },
    { title: 'WO Number', dataIndex: 'woNumber' },
    { title: 'Project Title', dataIndex: 'projectTitle' },
    { title: 'Size', dataIndex: 'size', width: 80 },
    { title: 'Type', dataIndex: 'type', width: 80 },
    { title: 'Length', dataIndex: 'length', width: 100 },
    {
      title: 'Action',
      key: 'action',
      width: 90,
      render: (_: any, record: any) => (
        <Space>
          <Button
            className="btn-action-circle"
            icon={<SettingOutlined />}
            onClick={() => {
              dmaInletStore.setSelectedAssetId(record.id);
              dmaInletStore.setModalOpen(true);
            }}
          />
          <Button className="btn-info-circle" icon={<InfoCircleOutlined />} />
        </Space>
      ),
    },
  ];

  const filteredData = (data || []).filter(
    row =>
      (row.woNumber?.toLowerCase() ?? '').includes(dmaInletStore.search.toLowerCase()) ||
      (row.projectTitle?.toLowerCase() ?? '').includes(dmaInletStore.search.toLowerCase()) ||
      String(row.size).includes(dmaInletStore.search) ||
      (row.type?.toLowerCase() ?? '').includes(dmaInletStore.search.toLowerCase())
  );

  return (
    <>
      <Card style={{ background: '#f6f8fc', border: 'none', boxShadow: 'none' }}>
        <div style={{ background: '#e6edfc', borderRadius: 8, padding: '12px 24px', marginBottom: 18 }}>
          <Title level={5} style={{ color: '#2563eb', margin: 0 }}>Distribution & Transmission</Title>
        </div>
        <div className="license-controls-container">
          <div className="license-display-controls">
            <span>Display</span>
            <Select
              value={dmaInletStore.pageSize}
              onChange={dmaInletStore.setPageSize.bind(dmaInletStore)}
              size="small"
              style={{ width: 90 }}
              options={[10, 20, 50, 100].map(v => ({ value: v, label: v }))}
            />
            <span>records per page</span>
          </div>
          <div className="license-search-controls">
            <span>Search:</span>
            <Input.Search
              placeholder="Search..."
              size="small"
              allowClear
              enterButton
              value={dmaInletStore.search}
              onChange={e => dmaInletStore.setSearch(e.target.value)}
              style={{ width: 200 }}
            />
          </div>
        </div>
        {isLoading ? <Spin /> : error ? <Alert type="error" message="Failed to load DMA Inlet data" /> : (
          <Table
            bordered
            rowKey="id"
            columns={columns}
            dataSource={filteredData}
            pagination={{
              current: dmaInletStore.current,
              pageSize: dmaInletStore.pageSize,
              total: data?.length || 0,
              showSizeChanger: false,
              onChange: dmaInletStore.setCurrent.bind(dmaInletStore),
            }}
            style={{ background: '#fff', borderRadius: 8 }}
          />
        )}
        <div style={{ marginTop: 8, color: '#888' }}>
          Showing 1 to {dmaInletStore.pageSize} of {data?.length || 0} entries
        </div>
      </Card>
      <PipeConditionAssessmentModal
        open={dmaInletStore.modalOpen}
        onClose={() => dmaInletStore.setModalOpen(false)}
        assetId={dmaInletStore.selectedAssetId}
      />
    </>
  );
});

export default DMAInlet;
