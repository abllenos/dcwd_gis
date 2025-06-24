import React, { useState, useMemo } from "react";
import { Table, Input, Spin, Alert, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./util/conn";

const { Search } = Input;

interface AccessLevel {
  ID: number;
  Accesslevel: string;
  Description: string
}

const fetchAccessLevel = async (): Promise<AccessLevel[]> => {
  const res = await axiosInstance.get("helpers/gis/mgtsys/getAccesslevel.php");
  return Array.isArray(res.data.data) ? res.data.data : [];
};

const AccessLevelTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const { data, isLoading, error } = useQuery<AccessLevel[]>({
    queryKey: ["accesslevelData"],
    queryFn: fetchAccessLevel,
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    const lowerValue = searchText.toLowerCase();
    return data.filter((accesslevel) =>
      (accesslevel.ID?.toString() ?? "").includes(lowerValue) ||
      (accesslevel.Accesslevel?.toLowerCase() ?? "").includes(lowerValue) ||
      (accesslevel.Description?.toLowerCase() ?? "").includes(lowerValue)
    );
  }, [data, searchText]);

  const columns = [
    { title: "ID", dataIndex: "ID", key: "ID" },
    { title: "Access Level", dataIndex: "Accesslevel", key: "Accesslevel" },
    { title: "Description", dataIndex: "Description", key: "Description" },
  ];

  if (isLoading) return <Spin size="large"/>;
  if (error instanceof Error) return <Alert message={error.message} type="error" showIcon/>;

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Access Level</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Access Level</h1>
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 10 }}/>
    </div>
  );
};

export default AccessLevelTable;