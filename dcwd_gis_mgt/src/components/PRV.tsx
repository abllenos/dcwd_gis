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

    const onSearch = (value: string) => {
        const lowercasedValue = value.toLowerCase();
        const filtered = data.filter((prv) => 
            Object.values(prv).some(
                (field) =>
                    field &&
                    field.toString().toLowerCase().includes(lowercasedValue)
            )
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
                <Breadcrumb.Item>PRV</Breadcrumb.Item>
            </Breadcrumb>
            <Input.Search
                placeholder="Search PRV"
                onSearch={onSearch}
                style={{ marginBottom: 8, width: 200, marginTop: 16 }}
            />
            <Table dataSource={filteredData} columns={columns} />;
        </div>
    );
    }; 

    export default PRVTable;