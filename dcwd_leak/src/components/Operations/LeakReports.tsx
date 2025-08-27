import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Table, Button, Input, Badge, Card, Breadcrumb, Select } from "antd";
import { EditOutlined, TruckOutlined, FileSearchOutlined, FileImageOutlined, HomeFilled, DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DispatchModal from "../Modals/DispatchModal";
import UpdateReport from "../Modals/UpdateModal";
import ReportDetails from "../Modals/ReportModal";
import ImageModal from "../Modals/ImageModal";
import { leakReportsStore } from "../../stores/leakReportsStore";
import type { ColumnsType } from "antd/es/table";
import type { LeakData } from "../../types/Leakdata";

const { Option } = Select;

const tabLabels: Record<string, string> = {
  customer: "Customer",
  leakdetection: "Leak Detection",
  dispatched: "Dispatched",
  repaired: "Repaired Leaks",
  scheduled: "Repair Scheduled",
  turnover: "Repair Turn-over",
  after: "Leak After the Meter",
  notfound: "Leak Not Found",
};

const LeakReports: React.FC = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    leakReportsStore.fetchCounts();
    leakReportsStore.fetchData();
  }, []);

  const handleHomeClick = () => navigate("/home");

  const renderActionButtons = (record: LeakData) => (
    <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
      <Button icon={<TruckOutlined />} onClick={() => leakReportsStore.showModal("Dispatch", record)} style={{ backgroundColor: "#6782f5", borderColor: "#6782f5", color: "white" }} />
      <Button icon={<EditOutlined />} onClick={() => leakReportsStore.showModal("Update Report", record)} style={{ backgroundColor: "#6782f5", borderColor: "#6782f5", color: "white" }} />
      <Button
        icon={<FileImageOutlined />}
        onClick={() => leakReportsStore.setImageModal(true, ["https://via.placeholder.com/300", "https://via.placeholder.com/300"])}
        style={{ backgroundColor: "#6782f5", borderColor: "#6782f5", color: "white" }}
      />
      <Button icon={<FileSearchOutlined />} onClick={() => leakReportsStore.showModal("Report Details", record)} style={{ backgroundColor: "#6782f5", borderColor: "#6782f5", color: "white" }} />
    </div>
  );

  const generateColumns = (tab: string) => {
  const baseColumns: ColumnsType<LeakData> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Leak Type", dataIndex: "leakType", key: "leakType" },
    { title: "Reference Meter", dataIndex: "referenceMeter", key: "referenceMeter" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Landmark", dataIndex: "landmark", key: "landmark" },
    { title: "Date Reported", dataIndex: "dateReported", key: "dateReported" },
    { title: "Team Leader", dataIndex: "teamLeader", key: "teamLeader", hidden: tab === "customer" || tab === "leakdetection" || tab === "dispatched" },
    { title: "Reference No.", dataIndex: "referenceNo", key: "referenceNo" },
    { title: "JMS Control No.", dataIndex: "jmsControlNo", key: "jmsControlNo", hidden: tab === "customer" || tab === "leakdetection" || tab === "scheduled" || tab === "dispatched" },
    { title: "Date Repaired", dataIndex: "dateRepaired", key: "dateRepaired", hidden: tab !== "repaired" },
    { title: "Date Turn-overed", dataIndex: "dateTurnOvered", key: "dateTurnOvered", hidden: tab !== "scheduled" && tab !== "turnover" },
    { title: "Reason", dataIndex: "reason", key: "reason", hidden: tab !== "scheduled" && tab !== "turnover" },
  ];

  const actionColumn = {
    title: "Actions",
    key: "action",
    render: (_: any, record: LeakData) => renderActionButtons(record),
  };

  return [...baseColumns.filter((c) => !c.hidden), actionColumn];
};

  return (
    <div style={{ padding: "4px 24px 24px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button icon={<HomeFilled />} onClick={handleHomeClick} type="text" style={{ fontSize: 16, color: "#00008B" }} shape="circle" />
          <Breadcrumb style={{ fontSize: 16, fontWeight: 500 }}>
            <Breadcrumb.Item>Operation</Breadcrumb.Item>
            <Breadcrumb.Item>Leak Reports</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Input.Search placeholder="Search..." allowClear style={{ width: 300 }} onChange={(e) => leakReportsStore.setSearchText(e.target.value)} />
      </div>

      <Card className="custom-card">
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#595959" }}>Filter by Status:</span>
          <Select
            value={leakReportsStore.activeTab}
            onChange={(value) => leakReportsStore.setActiveTab(value)}
            style={{ width: 300 }}
            suffixIcon={<DownOutlined />}
            placeholder="Select status"
          >
            {Object.entries(tabLabels).map(([key, label]) => (
              <Option key={key} value={key}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <span>{label}</span>
                  <Badge 
                    count={leakReportsStore.tabCounts[key] ?? 0} 
                    size="small" 
                    color="blue" 
                    style={{ marginLeft: 8 }}
                  />
                </div>
              </Option>
            ))}
          </Select>
        </div>

        <Table
          columns={generateColumns(leakReportsStore.activeTab)}
          dataSource={leakReportsStore.data}
          loading={leakReportsStore.loading}
          pagination={{
            current: leakReportsStore.pageIndex,
            pageSize: leakReportsStore.pageSize,
            total: leakReportsStore.total,
            onChange: (page, size) => leakReportsStore.setPagination(page, size),
          }}
          rowKey="id"
        />
      </Card>

      <DispatchModal visible={leakReportsStore.modalVisible && leakReportsStore.modalTitle === "Dispatch"} onCancel={() => leakReportsStore.hideModal()} record={leakReportsStore.selectedRecord ?? undefined} fields={leakReportsStore.selectedRecord ? [
        { label: "REPORT ID", value: String(leakReportsStore.selectedRecord.id) },
        { label: "REFERENCE METER", value: leakReportsStore.selectedRecord.referenceMeter },
        { label: "LOCATION", value: leakReportsStore.selectedRecord.location },
      ] : []} />

      <UpdateReport
        visible={leakReportsStore.modalVisible && leakReportsStore.modalTitle === "Update Report"}
        record={leakReportsStore.selectedRecord ? { ...leakReportsStore.selectedRecord, id: String(leakReportsStore.selectedRecord.id) } : null}
        formValues={leakReportsStore.formValues}
        onChange={(field, value) => leakReportsStore.setFormValue(field, value)}
        onCancel={() => leakReportsStore.hideModal()}
        onSubmit={() => {
          if (!leakReportsStore.selectedRecord) return;
          const index = leakReportsStore.data.findIndex((d) => d.id === leakReportsStore.selectedRecord?.id);
          if (index !== -1) leakReportsStore.data[index] = { ...leakReportsStore.data[index], ...leakReportsStore.formValues } as LeakData;
          leakReportsStore.hideModal();
        }}
      />

      <ReportDetails
        visible={leakReportsStore.modalVisible && leakReportsStore.modalTitle === "Report Details"}
        record={leakReportsStore.selectedRecord ? { ...leakReportsStore.selectedRecord, id: String(leakReportsStore.selectedRecord.id) } : null}
        activeTab={leakReportsStore.activeTab}
        columnMap={{}}
        columnPresets={{}}
        onCancel={() => leakReportsStore.hideModal()}
      />

      <ImageModal visible={leakReportsStore.imageModalVisible} onCancel={() => leakReportsStore.setImageModal(false)} images={leakReportsStore.imageUrls} />
    </div>
  );
});

export default LeakReports;
