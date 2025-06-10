import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Input, Card, Space, Button, Breadcrumb } from "antd";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

interface AirValve {
    gid: number;
    arv_number: string;
    dategeocoded: string;
    wonumber: string;
    size: number;
    brand_description: string;
    status: string;
    location: string;
}

const AirValveTable: React.FC = () => {
    const [data, setData] = useState<AirValve[]>([]);
    const [filteredData, setFilteredData] = useState<AirValve[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>("");

    useEffect(() => {
        // const fetchAirValve = async () => {
        //     try {
        //         const response = await fetch("http://192.100.140.198/helpers/gis/mgtsys/getLayers/getAv.php");
        //         if (!response.ok) {
        //             throw new Error(`HTTP error! Status: ${response.status}`);
        //         }
        //         const result = await response.json();
        //         const airValves = Array.isArray(result.data) ? result.data : [];
        //         setData(airValves);
        //         setFilteredData(airValves);
        //     } catch (err: any) {
        //         setError(err.message);
        //     } finally {
        //         setLoading(false);
        //     }
        // };

        // fetchAirValve();

        (async () => {
            try {
                const response = await fetch("http://192.100.140.198/helpers/gis/mgtsys/getLayers/getAv.php");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                const airValves = Array.isArray(result.data) ? result.data : [];
                setData(airValves);
                setFilteredData(airValves);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = data.filter((airValve) =>
            (airValve.arv_number ?? '').toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };


    const handleReset = () => {
        setSearchText("");
        setFilteredData(data);
    };

    const columns = [
        { title: "ARV Number", dataIndex: "arv_number", key: "arv_number" },
        { title: "Date Geocoded", dataIndex: "dategeocoded", key: "dategeocoded" },
        { title: "WO Number", dataIndex: "wonumber", key: "wonumber" },
        { title: "Size", dataIndex: "size", key: "size" },
        { title: "Brand Description", dataIndex: "brand_description", key: "brand_description" },
        { title: "Status", dataIndex: "status", key: "status" },
        { title: "Location", dataIndex: "location", key: "location" },
    ];

    if (loading) return <Spin size="large" />;
    if (error) return <Alert message={error} type="error" showIcon />;

    return (
        <>
            <Breadcrumb
                style={{ margin: '20px 20px 20px 40px' }}
                items={[
                    { href: '/Dashboard', title: <HomeOutlined /> },
                    { title: 'GIS Management' },
                    { title: 'Air Valves' },
                ]}
            />

            <Card
                title="Air Valves"
                extra={
                    <Space>
                        <Input
                            placeholder="Search ARV Number..."
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: 200 }}
                            suffix={<SearchOutlined />}
                        />
                        <Button onClick={handleReset}>Reset</Button>
                    </Space>
                }
            >
                <Table
                    dataSource={filteredData}
                    columns={columns}
                    rowKey="gid"
                />
            </Card>
        </>
    );
};

export default AirValveTable;
