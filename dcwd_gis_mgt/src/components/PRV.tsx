import React, { useState, useMemo } from "react";
import { Table, Spin, Alert, Input, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";

const { Search } = Input;

interface PRV {
    prv_number: string;
    dategeocoded: Date;
    wonumber: string;
    size: string;
    status_remarks: string;
    prv_setting: string;
    projecttitle: string;
    location: string;
    accessby: string;
    st_asgeojson: string;
}

const fetchPRV = async (): Promise<PRV[]> => {
    const res = await fetch("http://192.100.140.198/helpers/gis/mgtsys/getLayers/getPrv.php");
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const result = await res.json();
    return Array.isArray(result.data) ? result.data : [];
};

const PRVTable: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const { data, isLoading, error } = useQuery<PRV[]>({
        queryKey: ["prv"],
        queryFn: fetchPRV,
    });

    const filteredData = useMemo(() => {
        if (!data) return [];
        const lowerValue = searchText.toLowerCase();
        return data.filter((item) =>
            (item.prv_number?.toLowerCase() ?? "").includes(lowerValue) ||
            (item.dategeocoded?.toString().toLowerCase() ?? "").includes(lowerValue) ||
            (item.wonumber?.toLowerCase() ?? "").includes(lowerValue) ||
            (item.size?.toString() ?? "").includes(lowerValue) ||
            (item.status_remarks?.toLowerCase() ?? "").includes(lowerValue) ||
            (item.prv_setting?.toLowerCase() ?? "").includes(lowerValue) ||
            (item.projecttitle?.toLowerCase() ?? "").includes(lowerValue) ||
            (item.location?.toLowerCase() ?? "").includes(lowerValue) ||
            (item.accessby?.toLowerCase() ?? "").includes(lowerValue)
        );
    }, [data, searchText]);

    const columns = [
        { title: "PRV Number", dataIndex: "prv_number", key: "prv_number" },
        { title: "Date Geocoded", dataIndex: "dategeocoded", key: "dategeocoded" },
        { title: "WO Number", dataIndex: "wonumber", key: "wonumber" },
        { title: "Size", dataIndex: "size", key: "size" },
        { title: "Status Remarks", dataIndex: "status_remarks", key: "status_remarks" },
        { title: "PRV Setting", dataIndex: "prv_setting", key: "prv_setting" },
        { title: "Project Title", dataIndex: "projecttitle", key: "projecttitle" },
        { title: "Location", dataIndex: "location", key: "location" },
        { title: "Access By", dataIndex: "accessby", key: "accessby" },
    ];

    if (isLoading) return <Spin size = "large"/>;
    if (error instanceof Error) return <Alert message={error.message} type="error" showIcon />;

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item href="/">
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>PRV</Breadcrumb.Item>
            </Breadcrumb>
            <h1>PRV</h1>
            <Search placeholder="Search PRV" 
                value={searchText} onChange={(e) => setSearchText(e.target.value)} 
                style={{ width: 300, marginBottom: 20, marginTop: 20 }}/>
            <Table dataSource={filteredData} columns={columns} />;
        </div>
    );
};

export default PRVTable;