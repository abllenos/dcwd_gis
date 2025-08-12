import React from 'react';
import { Modal, Input, Button, Select } from 'antd';
import type { LeakData } from '../../types/Leakdata';
import { EditOutlined } from '@ant-design/icons';

const { Option } = Select;

interface UpdateReportProps {
  visible: boolean;
  record: Partial<LeakData> | null;
  formValues: Partial<LeakData>;
  onChange: (field: keyof LeakData, value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  marginBottom: 6,
  display: 'block',
};

const UpdateReport: React.FC<UpdateReportProps> = ({
  visible,
  record,
  formValues,
  onChange,
  onCancel,
  onSubmit,
}) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width="60%"
      centered
      style={{ maxWidth: '200vw' }}
      bodyStyle={{ padding: 0 }}
      title={
        <div
          style={{
            backgroundColor: '#3B82F6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '10px 10px 0 0',
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          <EditOutlined style={{ marginRight: 8 }} />
          Update Report
        </div>
      }
    >
      {record && (
        <div
          style={{
            backgroundColor: '#f8fbfe',
            border: '1px solid #bcdfff',
            borderRadius: '0 0 10px 10px',
            padding: '24px 32px',
            fontSize: 15,
            marginTop: -16,
            lineHeight: '1.8',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px 32px',
            }}
          >
            <div>
              <label style={labelStyle}>Location:</label>
              <Input value={formValues.location} disabled style={{ padding: '8px 12px' }} />
            </div>
            <div>
              <label style={labelStyle}>Landmark:</label>
              <Input
                value={formValues.landmark}
                onChange={e => onChange('landmark', e.target.value)}
                style={{ padding: '8px 12px' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Contact No:</label>
              <Input
                value={formValues.contactNo}
                onChange={e => onChange('contactNo', e.target.value)}
                style={{ padding: '8px 12px' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Nearest Meter:</label>
              <Input
                value={formValues.referenceMeter}
                onChange={e => onChange('referenceMeter', e.target.value)}
                style={{ padding: '8px 12px' }}
              />
            </div>
            <div>
              <label style={labelStyle}>DMA ID:</label>
              <Select
                value={formValues.dmaId || undefined}
                placeholder="- SELECT -"
                onChange={value => onChange('dmaId', value)}
                style={{ width: '100%' }}
              >
                <Option value="DMA001">DMA001</Option>
                <Option value="DMA002">DMA002</Option>
              </Select>
            </div>
            <div>
              <label style={labelStyle}>Covering:</label>
              <Select
                value={formValues.covering || undefined}
                placeholder="- SELECT -"
                onChange={value => onChange('covering', value)}
                style={{ width: '100%' }}
              >
                <Option value="SOIL">SOIL</Option>
                <Option value="CONCRETE">CONCRETE</Option>
              </Select>
            </div>
            <div>
              <label style={labelStyle}>NRW Level:</label>
              <Input
                value={formValues.nrwLevel || ''}
                onChange={e => onChange('nrwLevel', e.target.value)}
                style={{ padding: '8px 12px' }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: 40,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 16,
            }}
          >
            <Button
              onClick={onCancel}
              style={{
                background: '#00607A',
                color: '#fff',
                borderRadius: 6,
                padding: '6px 24px',
                fontWeight: 600,
              }}
            >
              Close
            </Button>
            <Button
              type="primary"
              onClick={onSubmit}
              style={{
                borderRadius: 6,
                padding: '6px 24px',
                fontWeight: 600,
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UpdateReport;
