import React, { useState, useMemo } from "react";
import { Table, Input, Spin, Alert, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {axiosInstance} from "./util/conn";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

const { Search } = Input;

interface Distribution {
    gid: number;
    size: string;
    type: string;
    date_commissioned: string;
    length: string;
    description: string;
    ws: string;
    otp: string;
}

const fetchDistributionData = async (): Promise<Distribution[]> => {
    const res = await axiosInstance.get("helpers/gis/mgtsys/getPipeSys.php");
    return Array.isArray(res.data.data) ? res.data.data : [];
};

const DistributionList: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });

const { data, isLoading, error } = useQuery<Distribution[]>({
    queryKey: ["distributionData"],
    queryFn: fetchDistributionData,
});

const filteredData = useMemo(() => {
    if (!data) return [];
    const lowerValue = searchText.toLowerCase();
    return data.filter((distribution) =>
        (distribution.size?.toLowerCase() ?? "").includes(lowerValue) ||
        (distribution.type?.toLowerCase() ?? "").includes(lowerValue) ||
        (distribution.date_commissioned?.toLowerCase() ?? "").includes(lowerValue) ||
        (distribution.length?.toLowerCase() ?? "").includes(lowerValue) ||
        (distribution.description?.toLowerCase() ?? "").includes(lowerValue) ||
        (distribution.ws?.toLowerCase() ?? "").includes(lowerValue) ||
        (distribution.otp?.toLowerCase() ?? "").includes(lowerValue)
    );
}, [data, searchText]);

const columns: ColumnsType<Distribution> = [
    {
        title: "#",
        key: "gid",
        render: (_text, _record, index) =>
        ((pagination.current || 1) - 1) * (pagination.pageSize || 10) + index + 1,
        width: 60,
    },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Date Commissioned", dataIndex: "date_commissioned", key: "date_commissioned" },
    { title: "Length", dataIndex: "length", key: "length" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "WS", dataIndex: "ws", key: "ws" },
    { title: "OTP", dataIndex: "otp", key: "otp" },
];

if (isLoading) return <Spin size="large"/>;
if (error instanceof Error) return <Alert message="Error" description={error.message} type="error" showIcon/>

return (
     <div style={{ padding: 20 }}>
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>Distribution & Transmission</Breadcrumb.Item>
          </Breadcrumb>
    
          <Search
            placeholder="Search ..."
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
            rowKey="distributionData"
            pagination={{
              ...pagination,
              total: filteredData.length,
              onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
            }}
          />
        </div>
    );
};

export default DistributionList;
