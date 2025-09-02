import React from 'react';
import { Modal, Input, Button, Select } from 'antd';
import type { LeakData } from '../../types/Leakdata';
import { EditOutlined } from '@ant-design/icons';
import { MODAL_SIZES, SECTION_STYLES, BUTTON_STYLES, GRID_LAYOUTS } from './ModalDesignSystem';

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
      footer={[
        <Button
          key="cancel"
          style={BUTTON_STYLES.secondary}
          onClick={onCancel}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          style={BUTTON_STYLES.primary}
          onClick={onSubmit}

        >
          Update Report
        </Button>,
      ]}
      width={MODAL_SIZES.large}
      centered
      closeIcon={false}
      title={null}
      style={{ padding: 0 }}
    >
      {record && (
        <div style={{ padding: 16 }}>
          <div style={{ 
            textAlign: "center",
            marginBottom: 16,
            padding: "16px 0",
          }}>
            <EditOutlined style={{ fontSize: 20, color: '#3B82F6', marginRight: 8 }} />
            <span style={{ 
              fontSize: 18, 
              fontWeight: 600, 
              color: '#3B82F6'
            }}>
              Update Report
            </span>
          </div>
          
          <div style={SECTION_STYLES.form}>
            <div style={GRID_LAYOUTS.twoColumn}>
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
                  <Option value="ASPHALT">ASPHALT</Option>
                </Select>
              </div>
              <div>
                <label style={labelStyle}>Location Leak:</label>
                <Input
                  value={formValues.leakType || ''}
                  onChange={e => onChange('leakType', e.target.value)}
                  style={{ padding: '8px 12px' }}
                />
              </div>
              <div>
                <label style={labelStyle}>NRW LEVEL - %:</label>
                <Input
                  value={formValues.nrwLevel || ''}
                  onChange={e => onChange('nrwLevel', e.target.value)}
                  style={{ padding: '8px 12px' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UpdateReport;
