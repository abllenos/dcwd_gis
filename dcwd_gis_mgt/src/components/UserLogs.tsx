import React from "react";
import { observer } from "mobx-react";
import { Table, Breadcrumb, Spin, Alert, Select, Input, Modal } from "antd";
import { ColumnsType } from "antd/es/table";
import { HomeOutlined } from "@ant-design/icons";
import { logsStore } from "./stores/LogsStore";
import MapComponent from "./mapView";

const UserLogs: React.FC = observer(() => {
  const columns: ColumnsType<any> = [
    { title: "#", key: "index", render: (_t, _r, i) => i + 1 },
    { title: "ID", dataIndex: "ID", key: "ID" },
    { title: "Layer ID", dataIndex: "layerid", key: "layerid" },
    { title: "Asset ID", dataIndex: "assetid", key: "assetid" },
    { title: "Modified By", dataIndex: "modified_by", key: "modified_by" },
    { title: "Transaction Type", dataIndex: "access_flg", key: "access_flg" },
    { title: "Transaction DateTime", dataIndex: "transaction_datetime", key: "transaction_datetime" },
    { title: "Description", dataIndex: "description", key: "description" },
  ];

  return (
    <div>
      <Breadcrumb
        style={{ margin: "20px 20px 20px 40px" }}
        items={[
          { href: "/Dashboard", title: <HomeOutlined /> },
          { title: "Management" },
          { title: "Logs" },
        ]}
      />

      <Select
        style={{ width: 200, margin: "20px", cursor: "pointer" }}
        placeholder="Select a Layer ID"
        onChange={(val) => logsStore.fetchLogsData(val)}
        options={logsStore.layerOptions}
      />

      <Select
        style={{ width: 200, margin: "20px", cursor: "pointer" }}
        placeholder="Select Search Field"
        value={logsStore.searchField}
        onChange={(val) => logsStore.setSearchField(val)}
        options={[
          { value: "ID", label: "ID" },
          { value: "assetid", label: "Asset ID" },
          { value: "modified_by", label: "Modified By" },
          { value: "access_flg", label: "Access Flag" },
        ]}
      />

      <Input
        style={{ width: 300, margin: "20px" }}
        placeholder={`Search by ${logsStore.searchField}`}
        value={logsStore.searchValue}
        onChange={(e) => logsStore.setSearchValue(e.target.value)}
      />

      {logsStore.loading ? (
        <Spin size="large" style={{ margin: "20px" }} />
      ) : logsStore.error ? (
        <Alert message="Error" description={logsStore.error} type="error" showIcon style={{ margin: "20px" }} />
      ) : (
        <Table
          style={{ margin: "20px" }}
          columns={columns}
          dataSource={logsStore.filteredLogs}
          rowKey="ID"
          pagination={{ pageSize: 15, showSizeChanger: false }}
          onRow={(record) => ({
            onClick: () => logsStore.selectLog(record),
          })}
        />
      )}

      <Modal
        title="Log Details"
        open={logsStore.isModalVisible}
        onCancel={() => logsStore.closeModal()}
        footer={null}
        width={800}
      >
        {logsStore.selectedLog && (
          <div>
            <p><strong>ID:</strong> {logsStore.selectedLog.ID}</p>
            <p><strong>Layer ID:</strong> {logsStore.selectedLog.layerid}</p>
            <p><strong>Asset ID:</strong> {logsStore.selectedLog.assetid}</p>
            <p><strong>Modified By:</strong> {logsStore.selectedLog.modified_by}</p>
            <p><strong>Transaction Type:</strong> {logsStore.selectedLog.access_flg}</p>
            <p><strong>Transaction DateTime:</strong> {logsStore.selectedLog.transaction_datetime}</p>
            <p><strong>Description:</strong> {logsStore.selectedLog.description}</p>

            {logsStore.geometry && logsStore.mapCenter && (
              <MapComponent geometry={logsStore.geometry} center={logsStore.mapCenter} />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
});

export default UserLogs;
