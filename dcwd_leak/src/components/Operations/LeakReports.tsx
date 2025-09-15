import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Table, Button, Input, Badge, Card, Breadcrumb, Select, Tooltip, Switch, Divider } from "antd";
import { EditOutlined, TruckOutlined, FileSearchOutlined, FileImageOutlined, HomeFilled, DownOutlined, ReloadOutlined, ClockCircleOutlined } from "@ant-design/icons";
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
  all: "All Reports",

};

const LeakReports: React.FC = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    leakReportsStore.fetchCounts();
    leakReportsStore.fetchData();
    
    // Cleanup auto-refresh on component unmount
    return () => {
      leakReportsStore.cleanup();
    };
  }, []);

  // Handle visibility change to pause/resume auto-refresh when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && leakReportsStore.autoRefreshEnabled) {
        leakReportsStore.stopAutoRefresh();
      } else if (!document.hidden && leakReportsStore.autoRefreshEnabled) {
        leakReportsStore.startAutoRefresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleHomeClick = () => navigate("/home");

  const renderActionButtons = (record: LeakData) => {
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

    const actions = tabActions[leakReportsStore.activeTab] || ["dispatch", "update", "image", "details"];
    
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
        {actions.map(action => actionButtons[action as keyof typeof actionButtons])}
      </div>
    );
  };

  const generateColumns = (tab: string) => {
  if (tab === "all") {
    const allReportsColumns: ColumnsType<LeakData> = [
      { title: "ID", dataIndex: "id", key: "id" },
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
    ];

    return allReportsColumns;
  }

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
    <>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
      <div style={{ padding: "4px 24px 24px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button icon={<HomeFilled />} onClick={handleHomeClick} type="text" style={{ fontSize: 16, color: "#00008B" }} shape="circle" />
          <Breadcrumb
            style={{ fontSize: 16, fontWeight: 500 }}
            items={[
              { title: "Operation" },
              { title: "Leak Reports" }
            ]}
          />
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Auto-refresh controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", backgroundColor: "#f5f5f5", borderRadius: 6 }}>
            <ClockCircleOutlined style={{ color: "#1890ff" }} />
            <span style={{ fontSize: 12, color: "#666", minWidth: 70 }}>Auto-refresh:</span>
            <Switch
              size="small"
              checked={leakReportsStore.autoRefreshEnabled}
              onChange={(checked) => leakReportsStore.setAutoRefreshEnabled(checked)}
            />
            <Select
              size="small"
              value={leakReportsStore.autoRefreshInterval}
              onChange={(value) => leakReportsStore.setAutoRefreshInterval(value)}
              style={{ width: 80 }}
              disabled={!leakReportsStore.autoRefreshEnabled}
            >
              <Select.Option value={10000}>10s</Select.Option>
              <Select.Option value={30000}>30s</Select.Option>
              <Select.Option value={60000}>1m</Select.Option>
              <Select.Option value={120000}>2m</Select.Option>
              <Select.Option value={300000}>5m</Select.Option>
            </Select>
            {leakReportsStore.autoRefreshEnabled && (
              <span style={{ fontSize: 11, color: "#1890ff", minWidth: 25 }}>
                {leakReportsStore.nextRefreshCountdown}s
              </span>
            )}
          </div>
          
          <Divider type="vertical" style={{ height: 20 }} />
          
          {/* Manual refresh button */}
          <Tooltip title="Refresh now">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => leakReportsStore.manualRefresh()}
              loading={leakReportsStore.loading}
              size="small"
            >
              Refresh
            </Button>
          </Tooltip>
          
          <Input.Search 
            placeholder="Search..." 
            allowClear 
            style={{ width: 300 }} 
            onChange={(e) => leakReportsStore.setSearchText(e.target.value)} 
          />
        </div>
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

        {/* Auto-refresh status indicator */}
        {(leakReportsStore.autoRefreshEnabled || leakReportsStore.lastRefreshTime) && (
          <div style={{ 
            marginBottom: 16, 
            padding: "8px 12px", 
            backgroundColor: "#f8f9fa", 
            borderRadius: 4, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            fontSize: 12,
            color: "#666"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {leakReportsStore.autoRefreshEnabled ? (
                <>
                  <div style={{ 
                    width: 8, 
                    height: 8, 
                    backgroundColor: "#52c41a", 
                    borderRadius: "50%",
                    animation: "pulse 2s infinite"
                  }} />
                  <span>Auto-refresh enabled</span>
                </>
              ) : (
                <>
                  <div style={{ 
                    width: 8, 
                    height: 8, 
                    backgroundColor: "#d9d9d9", 
                    borderRadius: "50%"
                  }} />
                  <span>Auto-refresh disabled</span>
                </>
              )}
            </div>
            {leakReportsStore.lastRefreshTime && (
              <span>
                Last updated: {leakReportsStore.lastRefreshTime.toLocaleTimeString()}
              </span>
            )}
          </div>
        )}

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
          rowKey={(record) => record.key || record.id}
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
    </>
  );
});

export default LeakReports;
