import React, { useState, useMemo } from "react";
import { Table, Input, Spin, Alert, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {axiosInstance} from "./util/conn";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

const { Search } = Input;

interface FireHydrant {
    assetid: string;
    location: string; 
    barangay: string;
    size: string;
    type_description: string;
    remarks: string;
}

const fetchFireHydrant = async () => {
    const res = await axiosInstance.get("helpers/gis/mgtsys/getLayers/getFirehydrant.php");
    return Array.isArray(res.data.data) ? res.data.data : [];
};

const FireHydrantList: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });

    const { data, isLoading, error } = useQuery<FireHydrant[]>({
        queryKey: ["fireHydrantData"],
        queryFn: fetchFireHydrant,
    });

    const filteredData = useMemo(() => {
        if (!data) return [];
        const lowerValue = searchText.toLowerCase();
        return data.filter((firehydrant) =>
        (firehydrant.assetid?.toLowerCase() ?? "").includes(lowerValue) ||
        (firehydrant.location?.toLowerCase() ?? "").includes(lowerValue) ||
        (firehydrant.barangay?.toLowerCase() ?? "").includes(lowerValue) ||
        (firehydrant.size?.toString() ?? "").includes(lowerValue) ||
        (firehydrant.type_description?.toLowerCase() ?? "").includes(lowerValue) ||
        (firehydrant.remarks?.toLowerCase() ?? "").includes(lowerValue)
        );
    }, [data, searchText]);

    const columns: ColumnsType<FireHydrant> = [
        {
            title: "#",
            key: "index",
            render: (_text, _record, index) =>
            ((pagination.current || 1) - 1) * (pagination.pageSize || 10) + index + 1,
            width: 60,
        },
        { title: "Asset ID", dataIndex: "assetid", key: "assetid" },
        { title: "Location", dataIndex: "location", key: "location" },
        { title: "Barangay", dataIndex: "barangay", key: "barangay" },
        { title: "Size", dataIndex: "size", key: "size" },
        { title: "Type Description", dataIndex: "type_description", key: "type_description" },
        { title: "Remarks", dataIndex: "remarks", key: "remarks" },
    ];




    if (isLoading) return <Spin size="large"/>;
    if (error instanceof Error)
        return <Alert message="Error" description={error.message} type="error" showIcon />;

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item href="/">
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>Fire Hydrant</Breadcrumb.Item>
            </Breadcrumb>
            <Search
                placeholder="Search Fire Hydrant"
                value={searchText}
                onChange={(e) => {
                    setSearchText(e.target.value);
                    setPagination({ ...pagination, current: 1});
                }}
                style={{ width: 300, marginBottom: 20, marginTop: 20 }}
            />
            <Table
                    dataSource={filteredData}
                    columns={columns}
                    rowKey="dma_code"
                    pagination={{
                      ...pagination,
                      total: filteredData.length,
                      onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                    }}
                  />
        </div>
    );
};

export default FireHydrantList;