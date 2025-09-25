

import React, { useState, useMemo } from "react";
import { Table, Input, Spin, Alert, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { apiGis } from "./endpoints/Interceptor";
import Footer from './layout/Footer';
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

const { Search } = Input;
interface IsolationValve {
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

const fetchIsolationValve = async (): Promise<IsolationValve[]> => {
    const res = await apiGis.get("helpers/gis/mgtsys/getLayers/getIsolation.php");
    const arr = Array.isArray(res.data.data) ? res.data.data : [];
    // Map to IsolationValve interface shape
    return arr.map((item: any) => ({
        gvnumber: item.gvnumber || item.gv_number || item.gv_no || '',
        wonumber: item.wonumber || item.wo_number || item.wo_no || '',
        location: item.location || '',
        size: item.size || 0,
        noofturns: item.noofturns || item.no_of_turns || 0,
        depth: item.depth || 0,
        brand: item.brand || '',
        valve: item.valve || '',
        project_title: item.project_title || '',
        barangay: item.barangay || '',
    }));
};

const IsolationValveList: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });

    const { data, isLoading, error } = useQuery<IsolationValve[]>({
        queryKey: ["isolationValveData"],
        queryFn: fetchIsolationValve,
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

    const columns: ColumnsType<IsolationValve> = [
        {
            title: "ID",
            key: "index",
            render: (_text, _record, index) =>
                ((pagination.current || 1) - 1) * (pagination.pageSize || 10) + index + 1,
            width: 60,
        },
        { title: "GV Number", dataIndex: "gvnumber", key: "gvnumber" },
        { title: "Type", dataIndex: "valve", key: "valve" },
        { title: "Status", dataIndex: "brand", key: "brand" },
        { title: "Location", dataIndex: "location", key: "location" },
        {
            title: '',
            key: 'actions',
            width: 80,
            render: () => (
                <button style={{ background: '#1abc9c', border: 'none', borderRadius: 4, padding: 6, cursor: 'pointer' }}>
                    <svg width="20" height="20" fill="#fff" viewBox="0 0 1024 1024"><rect width="1024" height="1024" fill="none"/><path d="M160 160h704v704H160V160zm64 64v576h576V224H224zm64 64h448v448H288V288z"/></svg>
                </button>
            ),
        },
    ];

    if (isLoading) return <Spin size="large"/>;
    if (error instanceof Error) return <Alert message="Error" description={error.message} type="error" showIcon/>;

    return (
        <div style={{ padding: 20}}>
            <Breadcrumb>
                <Breadcrumb.Item href="/">
                    <HomeOutlined/>
                </Breadcrumb.Item>
                <Breadcrumb.Item>Isolation Valve</Breadcrumb.Item>
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
                rowKey={(_record) => _record.gvnumber + _record.wonumber}
                pagination={{
                    ...pagination,
                    total: filteredData.length,
                    onChange: (page, pageSize) => setPagination({ current: page, pageSize}),
                }}
            />
        </div>
    );
};

export default IsolationValveList;
