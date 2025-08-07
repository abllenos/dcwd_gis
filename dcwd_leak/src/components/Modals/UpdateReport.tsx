import React from 'react';
import { Modal, Input, Button, Select } from 'antd';
import type { LeakData } from '../../types/Leakdata';

const { Option } = Select;

interface UpdateReportProps {
  visible: boolean;
  record: Partial<LeakData> | null;
  formValues: Partial<LeakData>;
  onChange: (field: keyof LeakData, value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

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
      title="Update Report"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width="60%"
      centered
      style={{ maxWidth: '200vw', padding: 0 }}
      bodyStyle={{ padding: 24 }}
    >
      {record && (
        <div className="update-form">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label>Location:</label>
              <Input value={formValues.location} disabled />
            </div>
            <div>
              <label>Landmark:</label>
              <Input
                value={formValues.landmark}
                onChange={e => onChange('landmark', e.target.value)}
              />
            </div>
            <div>
              <label>Contact No:</label>
              <Input
                value={formValues.contactNo}
                onChange={e => onChange('contactNo', e.target.value)}
              />
            </div>
            <div>
              <label>Nearest Meter:</label>
              <Input
                value={formValues.referenceMeter}
                onChange={e => onChange('referenceMeter', e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label>DMA ID:</label>
              <Select
                value={formValues.dmaId || undefined}
                placeholder="- SELECT -"
                onChange={value => onChange('dmaId' as keyof LeakData, value)}
              >
                <Option value="DMA001">DMA001</Option>
                <Option value="DMA002">DMA002</Option>
              </Select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label>Covering:</label>
              <Select
                value={formValues.covering || undefined}
                placeholder="- SELECT -"
                onChange={value => onChange('covering' as keyof LeakData, value)}
              >
                <Option value="SOIL">SOIL</Option>
                <Option value="CONCRETE">CONCRETE</Option>
              </Select>
            </div>
            <div>
              <label>NRW Level:</label>
              <Input
                value={formValues.nrwLevel || ''}
                onChange={e => onChange('nrwLevel' as keyof LeakData, e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={onCancel} style={{ background: '#00607A', color: '#fff' }}>
              Close
            </Button>
            <Button type="primary" onClick={onSubmit}>
              Save
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UpdateReport;
