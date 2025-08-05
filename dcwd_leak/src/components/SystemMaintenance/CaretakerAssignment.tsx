import React, { useState } from 'react';
import {
  Table,
  Button,
  Breadcrumb,
  Card,
  Input,
  Modal,
  Select,
} from 'antd';
import { FileSearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';


interface CaretakerData {
  key: string;
  id: string;
  ctCode: string;
  description: string;
  mobileNo: string;
}

const caretakerData: CaretakerData[] = [
  {
    key: '1',
    id: '50124',
    ctCode: 'CT-001',
    description: 'Caretaker for Zone 8',
    mobileNo: '09190002222',
  },
];

interface CrewData {
  key: string;
  employeeId: string;
  name: string;
}

const initialCrewList: CrewData[] = [
  { key: '1', employeeId: 'EMP-101', name: 'Pedro Cruz' },
  { key: '2', employeeId: 'EMP-102', name: 'Juan Luna' },
];

const availableCrews: CrewData[] = [
  { key: '3', employeeId: 'EMP-103', name: 'Carlos Reyes' },
  { key: '4', employeeId: 'EMP-104', name: 'Ana Flores' },
  { key: '5', employeeId: 'EMP-105', name: 'Liza Gomez' },
];

const CaretakerAssignment: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CaretakerData | null>(null);
  const [crewList, setCrewList] = useState<CrewData[]>(initialCrewList);
  const [crewModalVisible, setCrewModalVisible] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [selectedCrewKey, setSelectedCrewKey] = useState<string | undefined>(undefined);

  const showDetails = (record: CaretakerData) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleCancel = () => setModalVisible(false);

  const filteredData = (): CaretakerData[] => {
    let data = caretakerData;
    if (searchText.trim()) {
      const keyword = searchText.toLowerCase();
      data = data.filter(record =>
        Object.values(record)
          .filter(val => typeof val === 'string')
          .some(val => (val as string).toLowerCase().includes(keyword))
      );
    }
    return data;
  };

  const handleDeleteCrew = (key: string) => {
    setCrewList(prev => prev.filter(c => c.key !== key));
  };

  const handleAddCrewClick = () => {
    setAddMode(true);
  };

  const handleSelectCrew = (key: string) => {
    const crew = availableCrews.find(c => c.key === key);
    if (crew && !crewList.some(c => c.key === crew.key)) {
      setCrewList(prev => [...prev, crew]);
    }
    setAddMode(false);
    setSelectedCrewKey(undefined);
  };

  const columns: ColumnsType<CaretakerData> = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'CT Code', dataIndex: 'ctCode' },
    { title: 'Description', dataIndex: 'description' },
    { title: 'Mobile No.', dataIndex: 'mobileNo' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            icon={<FileSearchOutlined />}
            style={{
              backgroundColor: '#00008B',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              padding: 0,
            }}
            onClick={() => showDetails(record)}
          />
        </div>
      ),
    },
  ];

  const crewColumns: ColumnsType<CrewData> = [
    { title: 'Employee ID No.', dataIndex: 'employeeId' },
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            icon={<DeleteOutlined />}
            danger
            style={{
              backgroundColor: '#FF4D4F',
              color: '#FFFFFF'}}
            onClick={() => handleDeleteCrew(record.key)}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '4px 24px 24px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Breadcrumb style={{ marginBottom: 30, fontSize: 16, fontWeight: 500 }}>
          <Breadcrumb.Item>Maintenance</Breadcrumb.Item>
          <Breadcrumb.Item>Caretaker Assignment</Breadcrumb.Item>
        </Breadcrumb>
        <Input.Search
          placeholder="Search"
          allowClear
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value.toLowerCase())}
        />
      </div>

      <Card style={{ marginBottom: 0, width: '100%', maxWidth: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={filteredData()}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 'max-content' }}
          bordered
        />
      </Card>

      <Modal
        title="Crew List"
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Table
          columns={crewColumns}
          dataSource={crewList}
          pagination={false}
          bordered
          size="small"
        />
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 16 }}>
          {!addMode ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCrewClick}>
              Add Crew
            </Button>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 475 }}>
              <Select
                showSearch
                placeholder="Select crew to enroll"
                style={{ minWidth: 375 }}
                optionFilterProp="children"
                onChange={setSelectedCrewKey}
                value={selectedCrewKey}
                filterOption={(input, option) =>
                  typeof option?.children === 'string' &&
                  (option.children as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                {availableCrews
                  .filter(c => !crewList.some(enrolled => enrolled.key === c.key))
                  .map(c => (
                    <Select.Option key={c.key} value={c.key}>
                      {`${c.employeeId} - ${c.name}`}
                    </Select.Option>
                  ))}
              </Select>
              <Button
                type="primary"
                disabled={!selectedCrewKey}
                onClick={() => selectedCrewKey && handleSelectCrew(selectedCrewKey)}
              >
                Enroll
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CaretakerAssignment;