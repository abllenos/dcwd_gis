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

const { Search } = Input;

interface BOV {
  bovnumber: string;
  wonumber: string;
  dategeocoded: string; // changed to string for consistent formatting
  size: number;
  status_remarks: string;
  date_commissioned: string;
  location: string;
  brgycode: number;
}

const fetchBOVData = async (): Promise<BOV[]> => {
  const res = await axiosInstance.get("getBov.php");
  return Array.isArray(res.data.data) ? res.data.data : [];
};

const BOVTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const { data, isLoading, error } = useQuery<BOV[]>({
    queryKey: ["bovData"],
    queryFn: fetchBOVData,
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    const lowerValue = searchText.toLowerCase();
    return data.filter((bov) =>
      (bov.bovnumber?.toLowerCase() ?? "").includes(lowerValue) ||
      (bov.wonumber?.toLowerCase() ?? "").includes(lowerValue) ||
      (bov.dategeocoded?.toLowerCase() ?? "").includes(lowerValue) ||
      (bov.size?.toString() ?? "").includes(lowerValue) ||
      (bov.status_remarks?.toLowerCase() ?? "").includes(lowerValue) ||
      (bov.date_commissioned?.toLowerCase() ?? "").includes(lowerValue) ||
      (bov.location?.toLowerCase() ?? "").includes(lowerValue) ||
      (bov.brgycode?.toString() ?? "").includes(lowerValue)
    );
  }, [data, searchText]);

  const columns = [
    { title: "BOV Number", dataIndex: "bovnumber", key: "bovnumber" },
    { title: "WO Number", dataIndex: "wonumber", key: "wonumber" },
    { title: "Date Geocoded", dataIndex: "dategeocoded", key: "dategeocoded" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Status Remarks", dataIndex: "status_remarks", key: "status_remarks" },
    { title: "Date Commissioned", dataIndex: "date_commissioned", key: "date_commissioned" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Brgy Code", dataIndex: "brgycode", key: "brgycode" },
  ];

  if (isLoading) return <Spin size="large" />;
  if (error instanceof Error) return <Alert message={error.message} type="error" showIcon />;

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Blow Off Valve</Breadcrumb.Item>
      </Breadcrumb>

      <Search
        placeholder="Search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 20, marginTop: 20 }}
      />

      <Table dataSource={filteredData} columns={columns} rowKey="bovnumber" />
    </div>
  );
};

export default BOVTable;
