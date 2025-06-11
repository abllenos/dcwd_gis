import React, { useState, useMemo } from "react";
import {
  Table,
  Spin,
  Alert,
  Input,
  Breadcrumb,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./util/conn";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

const { Search } = Input;

interface PSV {
  psv_number: string;
  accountnumber: string;
  location: string;
  meter_number: string;
  size: number;
  brand_name: string;
  pressure_setting: string;
  remarks: string;
}

const fetchPSVData = async (): Promise<PSV[]> => {
  const res = await axiosInstance.get("getPsv.php");
  return Array.isArray(res.data.data) ? res.data.data : [];
};

const PSVTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const { data, isLoading, error } = useQuery<PSV[]>({
    queryKey: ["psvData"],
    queryFn: fetchPSVData,
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    const lowerValue = searchText.toLowerCase();
    return data.filter((psv) =>
      (psv.psv_number?.toLowerCase() ?? "").includes(lowerValue) ||
      (psv.accountnumber?.toLowerCase() ?? "").includes(lowerValue) ||
      (psv.location?.toLowerCase() ?? "").includes(lowerValue) ||
      (psv.meter_number?.toLowerCase() ?? "").includes(lowerValue) ||
      (psv.size?.toString() ?? "").includes(lowerValue) ||
      (psv.brand_name?.toLowerCase() ?? "").includes(lowerValue) ||
      (psv.pressure_setting?.toLowerCase() ?? "").includes(lowerValue) ||
      (psv.remarks?.toLowerCase() ?? "").includes(lowerValue)
    );
  }, [data, searchText]);

  const columns: ColumnsType<PSV> = [
    {
      title: "#",
      key: "index",
      render: (_text, _record, index) =>
        ((pagination.current || 1) - 1) * (pagination.pageSize || 10) + index + 1,
      width: 60,
    },
    { title: "PSV Number", dataIndex: "psv_number", key: "psv_number" },
    { title: "Account Number", dataIndex: "accountnumber", key: "accountnumber" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Meter Number", dataIndex: "meter_number", key: "meter_number" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Brand Description", dataIndex: "brand_name", key: "brand_name" },
    { title: "Pressure Setting", dataIndex: "pressure_setting", key: "pressure_setting" },
    { title: "Remarks", dataIndex: "remarks", key: "remarks" },
  ];

  if (isLoading) return <Spin size="large" />;
  if (error instanceof Error)
    return <Alert message="Error" description={error.message} type="error" showIcon />;

  return (
    <div style={{ padding: 20 }}>
      <Breadcrumb>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Pressure Setting Valve</Breadcrumb.Item>
      </Breadcrumb>

      <Search
        placeholder="Search"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setPagination({ ...pagination, current: 1 }); 
        }}
        style={{ width: 300, marginBottom: 20, marginTop: 20 }}
      />

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="psv_number"
        pagination={{
          ...pagination,
          total: filteredData.length,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
        }}
      />
    </div>
  );
};

export default PSVTable;
