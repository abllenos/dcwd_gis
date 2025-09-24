import React from 'react';
import { observer } from 'mobx-react-lite';
import { Card, Row, Col, Select, Input, Table, Typography, Alert, Space, Tag, Button, Modal, Descriptions, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { logStore } from '../stores/logStore';
import type { LogRecord } from '../stores/logTypes';
import { formatAssetId, safeString } from '../utils/formatters';
import { logUiStore } from '../stores/logUiStore';
import MapView from './MapView';

const { Title } = Typography;

const columns: ColumnsType<LogRecord> = [
  { title: 'ID', dataIndex: 'id', sorter: (a, b) => (Number(a.id) || 0) - (Number(b.id) || 0), width: 90 },
  { title: 'Layer ID', dataIndex: 'layerId', width: 160, sorter: (a, b) => safeString(a.layerId).localeCompare(safeString(b.layerId)) },
  { title: 'Asset ID', dataIndex: 'assetId', width: 180, sorter: (a, b) => safeString(a.assetId).localeCompare(safeString(b.assetId)), render: (val: unknown) => formatAssetId(String(val ?? '')) },
  { title: 'Modified By', dataIndex: 'modifiedBy', width: 140, sorter: (a, b) => safeString(a.modifiedBy).localeCompare(safeString(b.modifiedBy)) },
  { title: 'Access Flag', dataIndex: 'accessFlag', width: 130, sorter: (a, b) => safeString(a.accessFlag).localeCompare(safeString(b.accessFlag)) },
  { title: 'Date & Time', dataIndex: 'dateTime', width: 200, sorter: (a, b) => safeString(a.dateTime).localeCompare(safeString(b.dateTime)) },
  { title: 'Description', dataIndex: 'description', sorter: (a, b) => safeString(a.description).localeCompare(safeString(b.description)) },
];

const LogPage: React.FC = observer(() => {
  const { layerOptions, selectedLayer, pageSize, currentPage, search, filteredData, loading, error } = logStore;

  return (
    <Card className="card shadow mb-4" style={{ borderRadius: 8 }}>
      <div className="card-header py-3" style={{ background: 'var(--bg-muted)' }}>
        <Title level={4} style={{ margin: 0 }}>Log trails</Title>
      </div>
    <div className="card-body" style={{ paddingTop: 20, paddingLeft: 28, paddingRight: 28 }}>
        {/* Row 1: Map Layers */}
        <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 12 }}>
          <Col xs={24} md={12} lg={8}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontWeight: 600, marginBottom: 6 }}>Map Layers<span style={{ color: 'var(--primary)' }}>*</span></label>
              <Select
                value={selectedLayer}
                style={{ width: '100%', cursor: 'pointer' }}
                onChange={(val) => logStore.setLayer(val)}
                showSearch={false}
                allowClear={false}
                options={layerOptions.map(o => ({ label: o.label, value: o.value }))}
              />
            </div>
          </Col>
        </Row>

        {/* Row 2: Display (left) and Search (right) above the table */}
        <Row gutter={[16, 8]} align="middle" style={{ marginBottom: 8 }}>
          <Col xs={24} md={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Display</span>
              <Select
                value={pageSize}
                onChange={(v) => logStore.setPageSize(v)}
                options={[10,20,50,100].map(n => ({ label: String(n), value: n }))}
                style={{ width: 100 }}
              />
              <span>records per page</span>
            </div>
          </Col>
          <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 320 }}>
              <label style={{ fontWeight: 600, marginBottom: 6 }}>Search:</label>
              <Input
                placeholder="Type to filter..."
                value={search}
                onChange={(e) => logStore.setSearch(e.target.value)}
                allowClear
              />
            </div>
          </Col>
        </Row>

        {error && (
          <Alert
            type="error"
            showIcon
            message="API request failed or returned no data"
            description={
              <div>
                <div>{error}</div>
                {logStore.debugStatus === 'disconnected' && (
                  <div>Cannot connect to API. Check network, base URL, or CORS.</div>
                )}
              </div>
            }
            style={{ marginBottom: 8 }}
          />
        )}
        <div className="form-row" style={{ marginTop: 8 }}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            onRow={(record) => ({
              onClick: () => logUiStore.open(record),
              style: { cursor: 'pointer' },
            })}
            pagination={{
              pageSize: pageSize,
              current: currentPage,
              total: filteredData.length,
              onChange: (p, s) => { if (s !== pageSize) { logStore.setPageSize(s); } logStore.setPage(p); },
              showTotal: (total) => `${total} record${total === 1 ? '' : 's'}`
            }}
            scroll={{ x: 900 }}
            bordered
            locale={{ emptyText: 'Empty' }}
          />
        </div>
        <Modal
          title="Log Details"
          open={logUiStore.isModalOpen}
          onCancel={() => logUiStore.close()}
          footer={[
            <Button key="close" onClick={() => logUiStore.close()}>Close</Button>,
          ]}
        >
          {logUiStore.selected && (
            <>
              <Descriptions column={1} size="small" styles={{ label: { width: 200 } }}>
                <Descriptions.Item label="ID">{logUiStore.selected.id}</Descriptions.Item>
                <Descriptions.Item label="Layer ID">{logUiStore.selected.layerId}</Descriptions.Item>
                <Descriptions.Item label="Asset ID">{formatAssetId(logUiStore.selected.assetId)}</Descriptions.Item>
                <Descriptions.Item label="Modified By">{logUiStore.selected.modifiedBy}</Descriptions.Item>
                <Descriptions.Item label="Transaction Type">{logUiStore.selected.accessFlag}</Descriptions.Item>
                <Descriptions.Item label="Transaction Date & Time">{logUiStore.selected.dateTime}</Descriptions.Item>
                <Descriptions.Item label="Description">{logUiStore.selected.description || '-'}</Descriptions.Item>
              </Descriptions>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Map</div>
                {logUiStore.geometryLoading && <div style={{ padding: 8 }}>Loading geometry…</div>}
                {!logUiStore.geometryLoading && logUiStore.geometry && (
                  <MapView height={280} geometry={logUiStore.geometry} />
                )}
                {!logUiStore.geometryLoading && !logUiStore.geometry && (
                  <div style={{ padding: 8, color: 'var(--text-muted)' }}>
                    {logUiStore.geometryError || 'No geometry available.'}
                  </div>
                )}
              </div>
            </>
          )}
        </Modal>
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Space size={8} wrap>
            {logStore.debugStatus === 'ok' && (
              <>
                <Tag color="green">Loaded</Tag>
                <Tag>Count: {logStore.lastCount}</Tag>
                {logStore.lastFetchedAt && (
                  <Tag>Fetched: {new Date(logStore.lastFetchedAt).toLocaleString()}</Tag>
                )}
              </>
            )}
            {logStore.debugStatus === 'empty' && (
              <Tag color="gold">No Data Found</Tag>
            )}
            {logStore.debugStatus === 'disconnected' && (
              <Tag color="red">Disconnected</Tag>
            )}
          </Space>
          <Space size={8}>
            <Button onClick={() => logStore.fetchLogs()} loading={loading}>
              Refresh
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
});

export default LogPage;
