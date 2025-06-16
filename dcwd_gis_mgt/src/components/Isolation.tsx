import React, { useState, useMemo } from "react";
import { Table, Spin, Alert, Input, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./util/conn";
import type { ColumnsType, TablePaginationConfig } from  "antd/es/table";

const { Search } = Input;

interface Isolation {
    gvnumber: string;
    wonumber: string;
    location: string;
    size: number;
    noofturns: number;
    depth: number;
    brand: string;
    valve: string;
    project_title: string;
    barangay: string;   
}

const fetchIsolationData = async (): Promise<Isolation[]> => {
  const res = await axiosInstance.get("helpers/gis/mgtsys/getLayers/getIsolation.php");
  return Array.isArray(res.data.data) ? res.data.data : [];
};

const IsolationTable: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });

const { data, isLoading, error } = useQuery<Isolation[]>({
    queryKey: ["isolationData"],
    queryFn: fetchIsolationData,
});

const filteredData = useMemo(() => {
    if (!data) return [];
    const lowerValue = searchText.toLowerCase();
    return data.filter((isolation) =>
    (isolation.gvnumber?.toLowerCase() ?? "").includes(lowerValue) ||
    (isolation.wonumber?.toLowerCase() ?? "").includes(lowerValue) ||
    (isolation.location?.toLowerCase() ?? "").includes(lowerValue) ||
    (isolation.size?.toString() ?? "").includes(lowerValue) ||
    (isolation.noofturns?.toString() ?? "").includes(lowerValue) ||
    (isolation.depth?.toString() ?? "").includes(lowerValue) ||
    (isolation.brand?.toLowerCase() ?? "").includes(lowerValue) ||
    (isolation.valve?.toLowerCase() ?? "").includes(lowerValue) ||
    (isolation.project_title?.toLowerCase() ?? "").includes(lowerValue) ||
    (isolation.barangay?.toLowerCase() ?? "").includes(lowerValue)
    
);
}, [data, searchText]);

const columns: ColumnsType<Isolation> = [
    {
        title: "#",
        key: "index",
        render: (_text, _record, index) =>
        ((pagination.current || 1) - 1) * (pagination.pageSize || 10) + index + 1,
        width: 60,
    },
    { title: "GV Number", dataIndex: "gvnumber", key: "gvnumber" },
    { title: "WO Number", dataIndex: "wonumber", key: "wonumber" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "No. of Turns", dataIndex: "noofturns", key: "noofturns" },
    { title: "Depth", dataIndex: "depth", key: "depth" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Valve", dataIndex: "valve", key: "valve" },
    { title: "Project Title", dataIndex: "project_title", key: "project_title" },
    { title: "Barangay", dataIndex: "barangay", key: "barangay" },
];

if (isLoading) return <Spin size="large"/>;
if (error instanceof Error) return <Alert message="Error" description={error.message} type="error" showIcon/>;

return (
    <div style={{ padding: 20}}>
        <Breadcrumb>
            <Breadcrumb.Item href="/">
                <HomeOutlined/>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Isolation</Breadcrumb.Item>
        </Breadcrumb>

        <Search
            placeholder="Search"
            value={searchText}
            onChange={(e) => {
                setSearchText(e.target.value);
                setPagination({ ...pagination, current: 1});
            }}
            style={{ width: 300, marginBottom: 20, marginTop: 20}}
        />

        <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="isolationData"
            pagination={{
                ...pagination,
                total: filteredData.length,
                onChange: (page, pageSize) => setPagination({ current: page, pageSize}),
            }}
        />
    </div>
    );
};

export default IsolationTable;