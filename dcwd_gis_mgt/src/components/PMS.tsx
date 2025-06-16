import React, { useState, useMemo } from "react";
import { Table, Input, Spin, Alert, Breadcrumb } from "antd";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {axiosInstance} from "./util/conn";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

const { Search } = Input;

interface PMS {
  pms_number: string;
  location: string;
  wonumber: string;
  year_installed: string;
  tapping_details: string;
  remarks: string;
  serialno: string;
  model: string;
}

const fetchPMSData = async (): Promise<PMS[]> => {
  const res = await axiosInstance.get("helpers/gis/mgtsys/getLayers/getPMS.php");
  return Array.isArray(res.data.data) ? res.data.data : [];
};

const PMSTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({

  });

  const { data, isLoading, error } = useQuery<PMS[]>({
    queryKey: ["pmsData"],
    queryFn: fetchPMSData,
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    const lowerValue = searchText.toLowerCase();
    return data.filter((pms) =>
      (pms.pms_number?.toLowerCase() ?? "").includes(lowerValue) ||
      (pms.location?.toLowerCase() ?? "").includes(lowerValue) ||
      (pms.wonumber?.toLowerCase() ?? "").includes(lowerValue) ||
      (pms.year_installed?.toLowerCase() ?? "").includes(lowerValue) ||
      (pms.tapping_details?.toLowerCase() ?? "").includes(lowerValue) ||
      (pms.remarks?.toLowerCase() ?? "").includes(lowerValue) ||
      (pms.serialno?.toLowerCase() ?? "").includes(lowerValue) ||
      (pms.model?.toLowerCase() ?? "").includes(lowerValue)
    );
  }, [data, searchText]);

  const columns: ColumnsType<PMS> = [
    {
      title: "#",
      key: "index",
      render: (_text, _record, index) =>
        ((pagination.current || 1) - 1) * (pagination.pageSize || 10) + index + 1,
      width: 50,
    },
    { title: "PMS Number", dataIndex: "pms_number", key: "pms_number" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "WO Number", dataIndex: "wonumber", key: "wonumber" },
    { title: "Year Installed", dataIndex: "year_installed", key: "year_installed" },
    { title: "Tapping Details", dataIndex: "tapping_details", key: "tapping_details" },
    { title: "Remarks", dataIndex: "remarks", key: "remarks" },
    { title: "Serial No", dataIndex: "serialno", key: "serialno" },
    { title: "Model", dataIndex: "model", key: "model" },
  ];

  if (isLoading) return <Spin size="large" />;
  if (error instanceof Error) return <Alert message={error.message} type="error" showIcon />;

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>PMS</Breadcrumb.Item>
      </Breadcrumb>
      <Search
       placeholder="Search..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setPagination({ ...pagination, current: 1 }); 
        }}
        style={{ width: 300, marginBottom: 20, marginTop: 20 }}
      />
      <Table dataSource={filteredData}
        columns={columns}
        rowKey="pms_number"
        pagination={{
          ...pagination,
          total: filteredData.length,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
        }} />
    </div>
  );
};

export default PMSTable;