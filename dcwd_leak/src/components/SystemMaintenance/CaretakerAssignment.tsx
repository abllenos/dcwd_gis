import React, { useEffect } from 'react';
import { Table, Button, Breadcrumb, Card, Input } from 'antd';
import { FileSearchOutlined, DeleteOutlined, HomeFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { makeAutoObservable } from 'mobx';
import { caretakerStore } from '../../stores/caretakerStore';
import CaretakerModal from '../Modals/CaretakerModal';

class CaretakerAssignmentUIStore {
  searchText: string = '';
  modalVisible: boolean = false;
  selectedRecord: any = null;
  crewList: any[] = [];
  addMode: boolean = false;
  selectedCrewKey: string | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setSearchText(val: string) {
    this.searchText = val;
  }
  setModalVisible(val: boolean) {
    this.modalVisible = val;
  }
  setSelectedRecord(val: any) {
    this.selectedRecord = val;
    this.crewList = [];
  }
  setAddMode(val: boolean) {
    this.addMode = val;
  }
  setSelectedCrewKey(val: string | undefined) {
    this.selectedCrewKey = val;
  }
  addCrewToList(key: string) {
    const crew = caretakerStore.crews.find(c => c.key === key);
    if (crew && !this.crewList.some(c => c.key === crew.key)) {
      this.crewList.push(crew);
    }
    this.addMode = false;
    this.selectedCrewKey = undefined;
  }
  deleteCrewFromList(key: string) {
    this.crewList = this.crewList.filter(c => c.key !== key);
  }
  showDetails(record: any) {
    this.setSelectedRecord(record);
    this.setModalVisible(true);
  }
  handleCancel() {
    this.setModalVisible(false);
    this.setAddMode(false);
    this.setSelectedCrewKey(undefined);
    this.crewList = [];
  }
  get filteredCaretakers() {
    let data = caretakerStore.caretakers;
    if (this.searchText.trim()) {
      const keyword = this.searchText.toLowerCase();
      data = data.filter(record =>
        Object.values(record)
          .filter(val => typeof val === 'string')
          .some(val => (val as string).toLowerCase().includes(keyword))
      );
    }
    return data;
  }
  get availableCrews() {
    return caretakerStore.crews.filter(c => !this.crewList.some(enrolled => enrolled.key === c.key));
  }
}

const uiStore = new CaretakerAssignmentUIStore();

const CaretakerAssignment: React.FC = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    caretakerStore.fetchCaretakers();
    caretakerStore.fetchCrews();
  }, []);

  const columns: ColumnsType<any> = [
    { title: 'CT Code', dataIndex: 'ctCode' },
    { title: 'Description', dataIndex: 'empId' },
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
            onClick={() => uiStore.showDetails(record)}
          />
        </div>
      ),
    },
  ];

  const crewColumns: ColumnsType<any> = [
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
            onClick={() => uiStore.deleteCrewFromList(record.key)}
          />
        </div>
      ),  
    },
  ];

  return (
    <div style={{ padding: '4px 24px 24px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            icon={<HomeFilled />}
            onClick={() => navigate('/home')}
            type="text"
            style={{ fontSize: 16, color: '#00008B', margin: 0 }}
            shape="circle"
          />
          <Breadcrumb
            style={{fontSize: 16, fontWeight: 500}}
            items={[
              { title: "Maintenance"},
              { title: "Caretaker Assignment"}
            ]}
          />
        </div>
        <Input.Search
          placeholder="Search"
          allowClear
          style={{ width: 300 }}
          onChange={e => uiStore.setSearchText(e.target.value.toLowerCase())}
        />
      </div>

      <Card className='custom-card'>
        <Table
          columns={columns}
          dataSource={uiStore.filteredCaretakers}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 'max-content' }}
          bordered
          loading={caretakerStore.loading}
        />
      </Card>

      <CaretakerModal
        visible={uiStore.modalVisible}
        crewList={uiStore.crewList}
        addMode={uiStore.addMode}
        selectedCrewKey={uiStore.selectedCrewKey}
        availableCrews={uiStore.availableCrews}
        onCancel={() => uiStore.handleCancel()}
        onAddMode={val => uiStore.setAddMode(val)}
        onSelectCrew={val => uiStore.setSelectedCrewKey(val)}
        onAddCrew={async() => {
          if (uiStore.selectedCrewKey && uiStore.selectedRecord) {
            await caretakerStore.assignCrew({
              crewId: uiStore.selectedCrewKey,
              caretakerId: uiStore.selectedRecord.key,
              action: 'assign'
            });
            uiStore.addCrewToList(uiStore.selectedCrewKey);
          }
        }}
        onDeleteCrew={async key => {
          if (uiStore.selectedRecord) {
            await caretakerStore.assignCrew({
              crewId: key,
              caretakerId: uiStore.selectedRecord.key,
              action: 'unassign'
            });
            uiStore.deleteCrewFromList(key);
          }
        }}
      />
    </div>
  );
});

export default CaretakerAssignment;