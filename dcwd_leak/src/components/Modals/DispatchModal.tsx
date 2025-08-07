import React from 'react';
import { Modal, Select, Button } from 'antd';

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
      title="Dispatch"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width="60%"
      centered
      style={{ maxWidth: '200vw', padding: 0 }}
      bodyStyle={{ padding: 24 }}
    >
      {record && (
        <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          {fields.map(({ label, value }) => (
            <p key={label}>
              <strong>{label}:</strong> {value}
            </p>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 24,
            }}
          >
            <Select
              showSearch
              placeholder="Select dispatcher"
              optionFilterProp="children"
              style={{ minWidth: 200 }}
              filterOption={(input, option) =>
                typeof option?.children === 'string' &&
                (option.children as string).toLowerCase().includes(input.toLowerCase())
              }
            >
              <Option value="dispatcher1">Dispatcher 1</Option>
              <Option value="dispatcher2">Dispatcher 2</Option>
              <Option value="dispatcher3">Dispatcher 3</Option>
            </Select>
            <Button type="primary">Dispatch Leak</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DispatchModal;
