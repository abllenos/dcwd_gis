import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Input } from "antd";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

interface PRV {
    gid: number;
    prv_number: string;
    dategeocoded: string;
    wonumber: string;
    size: string;
    prv_setting: string;
    projecttitle: string;
    status_remarks: string;
}

const PRVTable: React.FC = () => {
    const [data, setData] = useState<PRV[]>([]);
    const [filteredData, setFilteredData] = useState<PRV[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>("");

    useEffect(() => {
        (async() => {
                  try {
                const response = await fetch("http://192.100.140.198/helpers/gis/mgtsys/getLayers/getPrv.php");
                if (!response.ok){
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                const rawArray = Array.isArray(result.data) ? result.data : [];

                setData(rawArray);
                setFilteredData(rawArray);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();

    }, []);

    const handleSearch = (value: string) => {
        setSearchText(value);
        const lowerValue = value.toLowerCase();

        const filtered = data.filter((prv) =>
            (prv.prv_number?.toLowerCase() ?? '').includes(lowerValue) ||
            (prv.dategeocoded?.toLowerCase() ?? '').includes(lowerValue) ||
            (prv.wonumber?.toLowerCase() ?? '').includes(lowerValue) ||
            (prv.size?.toString() ?? '').includes(lowerValue) ||
            (prv.prv_setting?.toLowerCase() ?? '').includes(lowerValue) ||
            (prv.projecttitle?.toLowerCase() ?? '').includes(lowerValue) ||
            (prv.status_remarks?.toLowerCase() ?? '').includes(lowerValue)
        );
        setFilteredData(filtered);
    };

    const columns = [
        { title: "PRV Number", dataIndex: "prv_number", key: "prv_number" },
        { title: "Date Geocoded", dataIndex: "dategeocoded", key: "dategeocoded" },
        { title: "WO Number", dataIndex: "wonumber", key: "wonumber" },
        { title: "Size", dataIndex: "size", key: "size" },
        { title: "PRV Setting", dataIndex: "prv_setting", key: "prv_setting" },
        { title: "Project Title", dataIndex: "projecttitle", key: "projecttitle" },
        { title: "Status Remarks", dataIndex: "status_remarks", key: "status_remarks" },
    ];

    if (loading) {
        return <Spin />;
    }

    if (error) {
        return <Alert message={error} type="error" />;
    }

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item href="/">
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>Air Valve</Breadcrumb.Item>
            </Breadcrumb>
            <Input.Search
                placeholder="Search"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 300, marginBottom: 20, marginTop: 20 }}
                 
            />
            <Table dataSource={filteredData} columns={columns} />;
        </div>
    );
    }; 

    export default PRVTable;