import React from "react";
import { observer } from "mobx-react-lite";
import { Table, Button, Tooltip } from "antd";
import { 
  EditOutlined, 
  TruckOutlined, 
  FileSearchOutlined, 
  FileImageOutlined 
} from "@ant-design/icons";

import { leakReportsStore } from "../../stores/leakReportsStore";
import { unifiedOperationsStore } from "../../stores/unifiedOperationsStore";

import DispatchModal from "../Modals/DispatchModal";
import UpdateReport from "../Modals/UpdateModal";
import ReportDetails from "../Modals/ReportModal";
import ImageModal from "../Modals/ImageModal";

import type { ColumnsType } from "antd/es/table";
import type { LeakData } from "../../types/Leakdata";

const LeakReports: React.FC = observer(() => {

  const renderActionButtons = (record: LeakData) => {
    const actionButtons = {
      dispatch: (
        <Tooltip key="dispatch" title="Dispatch">
          <Button 
            icon={<TruckOutlined />} 
            onClick={() => leakReportsStore.showModal("Dispatch", record)} 
          />
        </Tooltip>
      ),
      update: (
        <Tooltip key="update" title="Update Report">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => leakReportsStore.showModal("Update Report", record)} 
          />
        </Tooltip>
      ),
      image: (
        <Tooltip key="image" title="View Images">
          <Button 
            icon={<FileImageOutlined />} 
            onClick={() => leakReportsStore.setImageModal(true, ["https://via.placeholder.com/300"])} 
          />
        </Tooltip>
      ),
      details: (
        <Tooltip key="details" title="Report Details">
          <Button 
            icon={<FileSearchOutlined />} 
            onClick={() => leakReportsStore.showModal("Report Details", record)} 
          />
        </Tooltip>
      )
    };

    const tabActions: Record<string, string[]> = {
      customer: ["dispatch", "details"],
      leakdetection: ["dispatch", "details", "update"],
      dispatched: ["details"],
      repaired: ["details"],
      scheduled: ["dispatch", "image"],
      turnover: ["dispatch", "details"],
      after: ["details"],
      notfound: ["details"]
    };

    const actions = tabActions[unifiedOperationsStore.activeStatus] || ["dispatch", "update", "image", "details"];

    return (
      <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
        {actions.map(action => actionButtons[action as keyof typeof actionButtons])}
      </div>
    );
  };

  const generateColumns = (): ColumnsType<LeakData> => {
    // Status filter options
    const statusFilters = [
      { text: "Customer", value: "customer" },
      { text: "Leak Detection", value: "leakdetection" },
      { text: "Dispatched", value: "dispatched" },
      { text: "Repaired", value: "repaired" },
      { text: "Scheduled", value: "scheduled" },
      { text: "Turnover", value: "turnover" },
      { text: "After", value: "after" },
      { text: "Not Found", value: "notfound" }
    ];

    if (unifiedOperationsStore.activeStatus === "all") {
      return [
        { title: "Date Reported", dataIndex: "dateReported", key: "dateReported" },
        { title: "Leak Type", dataIndex: "leakType", key: "leakType" },
        { title: "Reference Meter", dataIndex: "referenceMeter", key: "referenceMeter" },
        { title: "Address", dataIndex: "location", key: "location" },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          filters: statusFilters,
          onFilter: (value, record) => record.status === value,
          render: (status: string) => {
            const label = statusFilters.find(f => f.value === status)?.text || status;
            return <span>{label}</span>;
          }
        },
        {
          title: "Actions",
          key: "action",
          render: (_: any, record: LeakData) => renderActionButtons(record),
        }
      ];
    }

    return [
      { title: "Leak Type", dataIndex: "leakType", key: "leakType" },
      { title: "Reference Meter", dataIndex: "referenceMeter", key: "referenceMeter" },
      { title: "Location", dataIndex: "location", key: "location" },
      { title: "Date Reported", dataIndex: "dateReported", key: "dateReported" },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        filters: statusFilters,
        onFilter: (value, record) => record.status === value,
        render: (status: string) => {
          const label = statusFilters.find(f => f.value === status)?.text || status;
          return <span>{label}</span>;
        }
      },
      {
        title: "Actions",
        key: "action",
        render: (_: any, record: LeakData) => renderActionButtons(record),
      }
    ];
  };

  return (
    <>
      <Table
        columns={generateColumns()}
        dataSource={leakReportsStore.data}
        loading={leakReportsStore.loading}
        pagination={{
          current: leakReportsStore.pageIndex,
          pageSize: leakReportsStore.pageSize,
          total: leakReportsStore.total,
          onChange: leakReportsStore.setPagination.bind(leakReportsStore),
        }}
        rowKey={(record) => record.key || record.id || `row-${Math.random()}`}
      />

      {/* Modals */}
      <DispatchModal 
        visible={leakReportsStore.modalVisible && leakReportsStore.modalTitle === "Dispatch"} 
        onCancel={() => leakReportsStore.hideModal()} 
        record={leakReportsStore.selectedRecord ?? undefined} 
        fields={leakReportsStore.selectedRecord ? [
          { label: "REPORT ID", value: String(leakReportsStore.selectedRecord.id) },
          { label: "REFERENCE METER", value: leakReportsStore.selectedRecord.referenceMeter },
          { label: "LOCATION", value: leakReportsStore.selectedRecord.location },
        ] : []} 
      />

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
        activeTab={unifiedOperationsStore.activeStatus}
        columnMap={{}}
        columnPresets={{}}
        onCancel={() => leakReportsStore.hideModal()}
      />

      <ImageModal 
        visible={leakReportsStore.imageModalVisible} 
        onCancel={() => leakReportsStore.setImageModal(false)} 
        images={leakReportsStore.imageUrls} 
      />
    </>
  );
});

export default LeakReports;
