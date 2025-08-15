import React from 'react';
import { Modal, Select, Button } from 'antd';
import { CarOutlined } from '@ant-design/icons';

const { Option } = Select;

interface DispatchModalProps {
  visible: boolean;
  onCancel: () => void;
  record: any | null;
  fields: { label: string; value?: string }[];
}

const DispatchModal: React.FC<DispatchModalProps> = ({
  visible,
  onCancel,
  record,
  fields,
}) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Select
            showSearch
            placeholder="Select dispatcher"
            optionFilterProp="children"
            style={{ minWidth: 200, textAlign: 'left' }}
            filterOption={(input, option) =>
              typeof option?.children === 'string' &&
              (option.children as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="dispatcher1">Dispatcher 1</Option>
            <Option value="dispatcher2">Dispatcher 2</Option>
            <Option value="dispatcher3">Dispatcher 3</Option>
          </Select>

          <Button
            type="primary"
            style={{
              backgroundColor: '#3B82F6',
              borderColor: '#3B82F6',
              marginLeft: 'auto',
            }}
          >
            Dispatch Leak
          </Button>
        </div>
      }
      width={720}
      closeIcon={false}
      bodyStyle={{ paddingTop: 0, paddingBottom: 8 }}
      centered
      title={
        <div
          style={{
            backgroundColor: '#3B82F6',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '10px 10px 0 0',
            fontWeight: 600,
            fontSize: 16,
            top: '-28px',
            position: 'absolute',
            height: 'auto',            
          }}
        >
          <CarOutlined style={{ marginRight: 8 }} />
          Dispatch
        </div>
      }
    >
      {record && (
        <div
          style={{
            backgroundColor: '#f8fbfe',
            border: '1px solid #bcdfff',
            borderRadius: '0 0 10px 10px',
            padding: '20px 24px',
            marginTop: -16,
            fontSize: 15,
            lineHeight: '1.8',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', rowGap: 7 }}>
            {fields.map(({ label, value }) => (
              <React.Fragment key={label}>
                <div>
                  <strong>{label}:</strong>
                </div>
                <div>{value || 'N/A'}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DispatchModal;
