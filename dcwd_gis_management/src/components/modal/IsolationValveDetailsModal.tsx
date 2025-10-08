import React from 'react';
import { Modal, Typography, Button, Space, Input, Select, DatePicker } from 'antd';
import type { IsolationValve } from '../types/isolationValve';
import GeometryMap from '../GeometryMap';

const { Title, Text } = Typography;

interface IsolationValveDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  record: IsolationValve | null;
}

const IsolationValveDetailsModal: React.FC<IsolationValveDetailsModalProps> = ({ visible, onCancel, record }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1200}
      style={{ top: 20 }}
      styles={{ body: { padding: 0 } }}
      destroyOnClose
      maskClosable
    >
      <div style={{ padding: '24px 32px 0 32px', background: '#f7f9fc', borderRadius: '8px 8px 0 0' }}>
        <Title level={4} style={{ margin: 0, color: '#3a5fc8' }}>Isolation Valve - Details</Title>
      </div>
      <div style={{ background: '#fff', display: 'flex' }}>
        {/* Left side - Form */}
        <div style={{ flex: 1, padding: '24px 32px', borderRight: '1px solid #f0f0f0' }}>
          <div style={{ marginBottom: 20 }}>
            <Text style={{ display: 'block', marginBottom: 8, fontSize: '14px', color: '#666' }}>GV Number</Text>
            <Input
              style={{ width: '100%' }}
              value={record?.gvnumber}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <Text style={{ display: 'block', marginBottom: 8, fontSize: '14px', color: '#666' }}>Status</Text>
            <Select
              style={{ width: '100%' }}
              value={record?.brand}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Maintenance', value: 'maintenance' }
              ]}
            />
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <Text style={{ display: 'block', marginBottom: 8, fontSize: '14px', color: '#666' }}>Location</Text>
            <Input
              value={record?.location}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <Text style={{ display: 'block', marginBottom: 8, fontSize: '14px', color: '#666' }}>Date Installed</Text>
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Select date"
              format="YYYY-MM-DD"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <Text style={{ display: 'block', marginBottom: 8, fontSize: '14px', color: '#666' }}>Water Source</Text>
            <Select
              style={{ width: '100%' }}
              options={[
                { label: 'Main Line', value: 'main_line' },
                { label: 'Distribution', value: 'distribution' },
                { label: 'Service Line', value: 'service_line' }
              ]}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <Text style={{ display: 'block', marginBottom: 8, fontSize: '14px', color: '#666' }}>Barangay</Text>
            <Select
              style={{ width: '100%' }}
              value={record?.barangay}
              options={[
                { label: 'Barangay 1', value: 'barangay_1' },
                { label: 'Barangay 21', value: 'barangay_21' },
                { label: 'Barangay 15', value: 'barangay_15' }
              ]}
            />
          </div>

          <div style={{ marginBottom: 0 }}>
            <Text style={{ display: 'block', marginBottom: 8, fontSize: '14px', color: '#666' }}>Remarks</Text>
            <Input.TextArea
              rows={4}
              value={record?.remarks}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Right side - Map */}
        <div style={{ flex: 1, padding: '24px 32px' }}>
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ fontSize: '16px', color: '#333' }}>Location Map</Text>
          </div>
          {record && record.geom ? (
            <GeometryMap
              key={`isolation-valve-map-${record.id}`}
              geom={record.geom}
              height={400}
              markerColor="#ff4d4f"
              markerLabel={`Isolation Valve: ${record.gvnumber || 'Unknown'}`}
            />
          ) : (
            <div style={{ 
              height: 400, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: '#f5f5f5', 
              border: '1px solid #d9d9d9', 
              borderRadius: 6,
              color: '#999'
            }}>
              <Text>No location data available</Text>
            </div>
          )}
          <div style={{ marginTop: 8, fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
            Location view only - marker position cannot be changed
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '16px 32px', background: '#f7f9fc', borderRadius: '0 0 8px 8px', position: 'sticky', bottom: 0, zIndex: 10 }}>
        <Space>
          <Button danger onClick={onCancel}>Close</Button>
        </Space>
      </div>
    </Modal>
  );
};

export default IsolationValveDetailsModal;
