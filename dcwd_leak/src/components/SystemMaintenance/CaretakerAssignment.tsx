import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Table, Button, Breadcrumb, Card, Input, Modal, Select, message } from 'antd';
import { FileSearchOutlined, PlusOutlined, DeleteOutlined, HomeFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { caretakerStore } from "../../stores/caretakerStore";

const CaretakerAssignment: React.FC = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    caretakerStore.fetchCaretakers();
    caretakerStore.fetchCrews();
  }, []);

  const filteredCaretakers = caretakerStore.caretakers.filter(c =>
    c.ctCode.toLowerCase().includes(caretakerStore.searchText?.toLowerCase() ?? '')
  );

  const columns: ColumnsType<typeof caretakerStore.caretakers[0]> = [
    { title: 'CT Code', dataIndex: 'ctCode' },
    { title: 'Assigned Crew', dataIndex: 'assignedCrewId', render: (_, record) => { const crew = caretakerStore.crews.find(c => c.empId === record.assignedCrewId); return crew ? `${crew.empId} - ${crew.mobileNo}` : 'None'; }},
    { title: 'Active', dataIndex: 'active', render: (_, record) => (record.assignedCrewId ? 'Yes' : 'No') },
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
            onClick={() => {
              caretakerStore.setSelectedCaretaker(record);
              caretakerStore.setModalVisible(true);
              caretakerStore.setAddMode(false);
              caretakerStore.setSelectedCrewKey(undefined);
            }}
          />
        </div>
      ),
    },
  ];

  const assignedCrew = caretakerStore.crews.find(
    crew => crew.empId === caretakerStore.selectedCaretaker?.assignedCrewId
  );
  const assignedCrews = assignedCrew ? [assignedCrew] : [];

  const availableCrews = caretakerStore.crews.filter(
    crew => !caretakerStore.caretakers.some(ct => ct.assignedCrewId === crew.empId)
  );

  const crewColumns: ColumnsType<any> = [
    { title: 'Employee ID', dataIndex: 'empId' },
    { title: 'Mobile No.', dataIndex: 'mobileNo' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            icon={<DeleteOutlined />}
            danger
            style={{ backgroundColor: '#FF4D4F', color: '#FFFFFF' }}
            onClick={async () => {
              if (caretakerStore.selectedCaretaker) {
                await caretakerStore.unassignCrew({
                  caretakerId: caretakerStore.selectedCaretaker.key,
                  crewId: record.key,
                });
                message.success('Crew unassigned');
                caretakerStore.setModalVisible(false);
              }
            }}
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
            style={{ fontSize: 16, fontWeight: 500 }}
            items={[
              { title: "Maintenance" },
              { title: "Caretaker Assignment" }
            ]}
          />
        </div>
        <Input.Search
          placeholder="Search"
          allowClear
          style={{ width: 300 }}
          onChange={e => caretakerStore.setSearchText(e.target.value)}
        />
      </div>

      <Card className='custom-card'>
        <Table
          columns={columns}
          dataSource={filteredCaretakers}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 'max-content' }}
          bordered
          rowKey="key"
          loading={caretakerStore.loading}
        />
      </Card>

      <Modal
        title="Crew List"
        open={caretakerStore.modalVisible}
        onCancel={() => caretakerStore.setModalVisible(false)}
        footer={null}
      >
        <Table
          columns={crewColumns}
          dataSource={assignedCrews}
          pagination={false}
          bordered
          size="small"
          rowKey="key"
        />
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 16 }}>
          {!caretakerStore.addMode && assignedCrews.length === 0 ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => caretakerStore.setAddMode(true)}>
              Add Crew
            </Button>
          ) : null }
          {caretakerStore.addMode &&  assignedCrews.length === 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 475 }}>
              <Select
                showSearch
                placeholder="Select crew to enroll"
                style={{ minWidth: 375 }}
                optionFilterProp="children"
                onChange={caretakerStore.setSelectedCrewKey}
                value={caretakerStore.selectedCrewKey}
                filterOption={(input, option) =>
                  typeof option?.children === 'string' &&
                  (option.children as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                {availableCrews.map(c => (
                  <Select.Option key={c.key} value={c.key}>
                    {`${c.empId} - ${c.mobileNo}`}
                  </Select.Option>
                ))}
              </Select>
              <Button
                type="primary"
                disabled={!caretakerStore.selectedCrewKey}
                onClick={async () => {
                  if (caretakerStore.selectedCaretaker && caretakerStore.selectedCrewKey) {
                      const selectedCrew = caretakerStore.crews.find(c => c.key === caretakerStore.selectedCrewKey);
                    if (selectedCrew) {
                    await caretakerStore.assignCrew({
                      caretakerId: caretakerStore.selectedCaretaker.key,
                      crewId: selectedCrew.key,
                      crewEmpId: selectedCrew.empId,
                    });
                    message.success('Crew assigned');
                    caretakerStore.setAddMode(false);
                    caretakerStore.setSelectedCrewKey(undefined);
                    caretakerStore.setModalVisible(false);
                    }
                  }
                }}
              >
                Assign
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
});

export default CaretakerAssignment;