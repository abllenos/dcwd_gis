import React from 'react';
import { Modal, Table, Button, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface CaretakerModalProps {
  visible: boolean;
  crewList: any[];
  addMode: boolean;
  selectedCrewKey: string | undefined;
  availableCrews: any[];
  onCancel: () => void;
  onAddMode: (val: boolean) => void;
  onSelectCrew: (val: string) => void;
  onAddCrew: () => void;
  onDeleteCrew: (key: string) => void;
}

const crewColumns = (onDeleteCrew: (key: string) => void): ColumnsType<any> => [
  { title: 'Employee ID No.', dataIndex: 'empID' },
  { title: 'Name', dataIndex: 'name' },
  {
    title: 'Action',
    key: 'action',
    render: (_: any, record: any) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          icon={<DeleteOutlined />}
          danger
          style={{ backgroundColor: '#FF4D4F', color: '#FFFFFF' }}
          onClick={() => onDeleteCrew(record.key)}
        />
      </div>
    ),
  },
];

const CaretakerModal: React.FC<CaretakerModalProps> = ({
  visible,
  crewList,
  addMode,
  selectedCrewKey,
  availableCrews,
  onCancel,
  onAddMode,
  onSelectCrew,
  onAddCrew,
  onDeleteCrew,
}) => (
  <Modal
    title="Crew List"
    open={visible}
    onCancel={onCancel}
    footer={null}
  >
    <Table
      columns={crewColumns(onDeleteCrew)}
      dataSource={crewList}
      pagination={false}
      bordered
      size="small"
    />
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 16 }}>
      {!addMode ? (
        <Button type="primary" icon={<PlusOutlined />} onClick={() => onAddMode(true)}>
          Add Crew
        </Button>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 475 }}>
          <Select
            showSearch
            placeholder="Select crew to enroll"
            style={{ minWidth: 375 }}
            optionFilterProp="children"
            onChange={onSelectCrew}
            value={selectedCrewKey}
            filterOption={(input, option) =>
              typeof option?.children === 'string' &&
              (option.children as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {availableCrews.map(c => (
              <Select.Option key={c.key} value={c.key}>
                {`${c.empId} - ${c.name}`}
              </Select.Option>
            ))}
          </Select>
          <Button
            type="primary"
            disabled={!selectedCrewKey}
            onClick={onAddCrew}
          >
            Enroll
          </Button>
        </div>
      )}
    </div>
  </Modal>
);

export default CaretakerModal;