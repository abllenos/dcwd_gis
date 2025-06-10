import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Input, Breadcrumb } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';

interface BOV {
    bovnumber: string;
    wonumber: string;
    dategeocoded: Date;
    size: number;
    status_remarks: string;
    date_commissioned: Date;
    location: string;
    brgycode: number;
}

const BOVTable: React.FC = () => {
    const [data, setData] = useState<BOV[]>([]);
    const [filteredData, setFilteredData] = useState<BOV[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        (async() => {
            try {
                const response = await fetch("http://192.100.140.198/helpers/gis/mgtsys/getLayers/getBov.php");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                const rawArray = Array.isArray(result.data) ? result.data : [];

                setData(rawArray);
                setFilteredData(rawArray);
            }   catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleSearch = (value: string) => {
        setSearchText(value);
        const lowerValue = value.toLowerCase();

        const filtered = data.filter((bov) =>
            (bov.bovnumber?.toLowerCase() ?? '').includes(lowerValue) ||
            (bov.wonumber?.toLowerCase() ?? '').includes(lowerValue) ||
            (bov.dategeocoded?.toString() ?? '').includes(lowerValue) ||
            (bov.size?.toString() ?? '').includes(lowerValue) ||
            (bov.status_remarks?.toLowerCase() ?? '').includes(lowerValue) ||
            (bov.date_commissioned?.toString() ?? '').includes(lowerValue) ||
            (bov.location?.toLowerCase() ?? '').includes(lowerValue)
        );
        setFilteredData(filtered);
    };

    const columns = [
        { title: 'BOV Number', dataIndex: 'bovnumber', key: 'bovnumber' },
        { title: 'WO Number', dataIndex: 'wonumber', key: 'wonumber' },
        { title: 'Date Geocoded', dataIndex: 'dategeocoded', key: 'dategeocoded' },
        { title: 'Size', dataIndex: 'size', key: 'size' },
        { title: 'Status Remarks', dataIndex: 'status_remarks', key: 'status_remarks' },
        { title: 'Date Commissioned', dataIndex: 'date_commissioned', key: 'date_commissioned' },
        { title: 'Location', dataIndex: 'location', key: 'location' },
        { title: 'Brgy Code', dataIndex: 'brgycode', key: 'brgycode' },
    ];

    if (loading){
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
            <Breadcrumb.Item>Blow Off Valve</Breadcrumb.Item>
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

export default BOVTable;