import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Table, Button, Input, Badge, Card, Breadcrumb, Select, Tooltip } from "antd";
import { 
  EditOutlined, 
  TruckOutlined, 
  FileSearchOutlined, 
  FileImageOutlined, 
  HomeFilled, 
  DownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DispatchModal from "../Modals/DispatchModal";
import UpdateReport from "../Modals/UpdateModal";
import ReportDetails from "../Modals/ReportModal";
import ImageModal from "../Modals/ImageModal";
import SupplyComplaintDetailsModal from "../Modals/SupplyComplaintDetailsModal";
import { leakReportsStore } from "../../stores/leakReportsStore";
import { 
  unifiedOperationsStore, 
  OperationType, 
  operationConfigs,
  type UnifiedData 
} from "../../stores/unifiedOperationsStore";
import type { ColumnsType } from "antd/es/table";
import type { LeakData } from "../../types/Leakdata";
import type { ComplaintData as SupplyComplaintData } from "../../stores/supplyComplaintsStore";
import type { QualityComplaintData } from "../../stores/qualityComplaintsStore";

const { Option } = Select;

const UnifiedOperations: React.FC = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    unifiedOperationsStore.initialize();
  }, []);

  const handleHomeClick = () => navigate("/home");

  // Render action buttons for leak reports
  const renderLeakActionButtons = (record: LeakData) => {
    const actionButtons = {
      dispatch: (
        <Tooltip key="dispatch" title="Dispatch">
          <Button 
            icon={<TruckOutlined />} 
            onClick={() => leakReportsStore.showModal("Dispatch", record)} 
            style={{ 
              borderColor: "#e55745", 
              color: "#e55745",
              backgroundColor: "transparent",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e55745";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#e55745";
            }}
          />
        </Tooltip>
      ),
      update: (
        <Tooltip key="update" title="Update Report">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => leakReportsStore.showModal("Update Report", record)} 
            style={{ 
              borderColor: "#febc2e", 
              color: "#febc2e",
              backgroundColor: "transparent",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#febc2e";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#febc2e";
            }}
          />
        </Tooltip>
      ),
      image: (
        <Tooltip key="image" title="View Images">
          <Button 
            icon={<FileImageOutlined />} 
            onClick={() => leakReportsStore.setImageModal(true, ["https://via.placeholder.com/300", "https://via.placeholder.com/300"])} 
            style={{ 
              borderColor: "#4e72de", 
              color: "#4e72de",
              backgroundColor: "transparent",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4e72de";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#4e72de";
            }}
          />
        </Tooltip>
      ),
      details: (
        <Tooltip key="details" title="Report Details">
          <Button 
            icon={<FileSearchOutlined />} 
            onClick={() => leakReportsStore.showModal("Report Details", record)} 
            style={{ 
              borderColor: "#27cc3f", 
              color: "#27cc3f",
              backgroundColor: "transparent",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#27cc3f";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#27cc3f";
            }}
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

  // Render action buttons for complaints
  const renderComplaintActionButtons = (record: SupplyComplaintData | QualityComplaintData) => {
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
        <Tooltip title="View Details">
          <Button 
            icon={<FileSearchOutlined />} 
            onClick={() => unifiedOperationsStore.setComplaintModal(true, record)}
            style={{ 
              borderColor: "#27cc3f", 
              color: "#27cc3f",
              backgroundColor: "transparent",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#27cc3f";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#27cc3f";
            }}
          />
        </Tooltip>
      </div>
    );
  };

  // Generate columns based on operation type
  const generateColumns = () => {
    if (unifiedOperationsStore.activeOperation === OperationType.LEAK_REPORTS) {
      return generateLeakReportColumns();
    } else {
      return generateComplaintColumns();
    }
  };

  const generateLeakReportColumns = (): ColumnsType<LeakData> => {
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
          render: (status: string) => {
            const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
              "Undispatched": { bg: "#fde68a", text: "#92400e", border: "#f59e0b" },
              "Dispatched": { bg: "#22aa52ff", text: "#ebf7efff", border: "#14bb51ff" },
              "Repaired": { bg: "#3b82f6", text: "#e0f2fe", border: "#2563eb" },
              "For Schedule": { bg: "#f59e0b", text: "#fff7ed", border: "#d97706" },
              "For Turnover": { bg: "#8b5cf6", text: "#f3e8ff", border: "#7c3aed" },
              "After the meter link": { bg: "#ef4444", text: "#fee2e2", border: "#dc2626" },
              "Unknown": { bg: "#9ca3af", text: "#f9fafb", border: "#6b7280" },
            };
            
            const statusLabel = status || 'Unknown';
            const style = statusStyles[statusLabel] || statusStyles["Unknown"];

            return (
              <span
                style={{
                  backgroundColor: style.bg,
                  color: style.text,
                  border: `1px solid ${style.border}`,
                  padding: "4px 8px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: "500",
                  display: "inline-block",
                  minWidth: "80px",
                  textAlign: "center"
                }}
              >
                {statusLabel}
              </span>
            );
          }
        },
        {
          title: "Actions",
          key: "action",
          render: (_: any, record: LeakData) => renderLeakActionButtons(record),
        }
      ];
    }

    const baseColumns: ColumnsType<LeakData> = [
      { title: "Leak Type", dataIndex: "leakType", key: "leakType" },
      { title: "Reference Meter", dataIndex: "referenceMeter", key: "referenceMeter" },
      { title: "Location", dataIndex: "location", key: "location" },
      { title: "Landmark", dataIndex: "landmark", key: "landmark" },
      { title: "Date Reported", dataIndex: "dateReported", key: "dateReported" },
      { title: "Team Leader", dataIndex: "teamLeader", key: "teamLeader", hidden: unifiedOperationsStore.activeStatus === "customer" || unifiedOperationsStore.activeStatus === "leakdetection" || unifiedOperationsStore.activeStatus === "dispatched" },
      { title: "Reference No.", dataIndex: "referenceNo", key: "referenceNo" },
      { title: "JMS Control No.", dataIndex: "jmsControlNo", key: "jmsControlNo", hidden: unifiedOperationsStore.activeStatus === "customer" || unifiedOperationsStore.activeStatus === "leakdetection" || unifiedOperationsStore.activeStatus === "scheduled" || unifiedOperationsStore.activeStatus === "dispatched" },
      { title: "Date Repaired", dataIndex: "dateRepaired", key: "dateRepaired", hidden: unifiedOperationsStore.activeStatus !== "repaired" },
      { title: "Date Turn-overed", dataIndex: "dateTurnOvered", key: "dateTurnOvered", hidden: unifiedOperationsStore.activeStatus !== "scheduled" && unifiedOperationsStore.activeStatus !== "turnover" },
      { title: "Reason", dataIndex: "reason", key: "reason", hidden: unifiedOperationsStore.activeStatus !== "scheduled" && unifiedOperationsStore.activeStatus !== "turnover" },
      {
        title: "Actions",
        key: "action",
        render: (_: any, record: LeakData) => renderLeakActionButtons(record),
      }
    ];

    return baseColumns.filter((c) => !c.hidden);
  };

  const generateComplaintColumns = (): ColumnsType<SupplyComplaintData | QualityComplaintData> => {
    const baseColumns: ColumnsType<SupplyComplaintData | QualityComplaintData> = [
      { 
        title: "Account Number", 
        dataIndex: "accountNumber", 
        key: "accountNumber",
        hidden: unifiedOperationsStore.activeOperation !== OperationType.QUALITY_COMPLAINTS
      },
      { title: "Location", dataIndex: "location", key: "location" },
      { title: "Remarks", dataIndex: "remarks", key: "remarks" },
      { title: "Reference Meter", dataIndex: "referenceMeter", key: "referenceMeter" },
      { title: "Contact No.", dataIndex: "contactNo", key: "contactNo" },
      { title: "Date/Time Reported", dataIndex: "dateTimeReported", key: "dateTimeReported" },
      {
        title: "Actions",
        key: "action",
        render: (_: any, record: SupplyComplaintData | QualityComplaintData) => renderComplaintActionButtons(record),
      }
    ];

    return baseColumns.filter((c) => !c.hidden);
  };

  return (
    <div style={{ padding: "4px 24px 24px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button 
            icon={<HomeFilled />} 
            onClick={handleHomeClick} 
            type="text" 
            style={{ fontSize: 16, color: "#00008B" }} 
            shape="circle" 
          />
          <Breadcrumb
            style={{ fontSize: 16, fontWeight: 500 }}
            items={[
              { title: "Operations" },
              { title: unifiedOperationsStore.currentConfig.title }
            ]}
          />
        </div>
        <Input.Search 
          placeholder="Search..." 
          allowClear 
          style={{ width: 300 }} 
          value={unifiedOperationsStore.searchText}
          onChange={(e) => unifiedOperationsStore.setSearchText(e.target.value)}
        />
      </div>

      <Card className="custom-card">
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#595959" }}>Operation Type:</span>
            <Select
              value={unifiedOperationsStore.activeOperation}
              onChange={unifiedOperationsStore.setActiveOperation}
              style={{ width: 175 }}
              suffixIcon={<DownOutlined />}
            >
              {Object.entries(operationConfigs).map(([key, config]) => (
                <Option key={key} value={key}>
                  {config.title}
                </Option>
              ))}
            </Select>
          </div>

          {/* Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#595959" }}>Status:</span>
            <Select
              value={unifiedOperationsStore.activeStatus}
              onChange={unifiedOperationsStore.setActiveStatus}
              style={{ width: 235 }}
              suffixIcon={<DownOutlined />}
              placeholder="Select status"
            >
              {Object.entries(unifiedOperationsStore.currentConfig.statuses).map(([key, label]) => (
                <Option key={key} value={key}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <span>{label}</span>
                    <Badge 
                      count={unifiedOperationsStore.statusCounts[key] ?? 0} 
                      size="small" 
                      color="blue" 
                      style={{ marginLeft: 8 }}
                    />
                  </div>
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <Table
          columns={generateColumns() as any}
          dataSource={unifiedOperationsStore.data as any}
          loading={unifiedOperationsStore.loading}
          pagination={{
            current: unifiedOperationsStore.pagination.current,
            pageSize: unifiedOperationsStore.pagination.pageSize,
            total: unifiedOperationsStore.pagination.total,
            onChange: unifiedOperationsStore.setPagination,
          }}
          rowKey={(record) => record.key || record.id || `row-${Math.random()}`}
        />
      </Card>

      {/* Modals for Leak Reports */}
      {unifiedOperationsStore.activeOperation === OperationType.LEAK_REPORTS && (
        <>
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
      )}

      {/* Modal for Complaints */}
      {(unifiedOperationsStore.activeOperation === OperationType.SUPPLY_COMPLAINTS || unifiedOperationsStore.activeOperation === OperationType.QUALITY_COMPLAINTS) && (
        <SupplyComplaintDetailsModal
          visible={unifiedOperationsStore.complaintModalVisible}
          selectedRecord={unifiedOperationsStore.selectedComplaint as any}
          onCancel={() => unifiedOperationsStore.setComplaintModal(false)}
          onSubmitRemarks={(remarks: string) => {
            console.log('Submitted remarks:', remarks);
            unifiedOperationsStore.setComplaintModal(false);
          }}
        />
      )}
    </div>
  );
});

export default UnifiedOperations;
