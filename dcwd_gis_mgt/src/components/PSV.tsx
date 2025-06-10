import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Input, Button, Space, Breadcrumb } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';

interface PSV {
    psv_number: string;
    accountnumber: string;
    location: string;
    meter_number: string;
    size: number;
    brand_name: string;
    pressure_setting: string;
    remarks: string
}

const PSVTable: React.FC = () => {
    const [data, setData] = useState<PSV[]>([]);
    const [filteredData, setFilteredData] = useState<PSV[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("http://192.100.140.198/helpers/gis/mgtsys/getLayers/getPsv.php");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                const rawArray = Array.isArray(result.data) ? result.data : [];

                setData(rawArray);
                setFilteredData(rawArray);
            } catch (err: any){
                setError(err.message);
            } finally {
                setLoading(false);
            } 
        })();
    }, []);

    const handleSearch = (value: string) => {
        setSearchText(value);
        const lowerValue = value.toLowerCase();

        const filtered = data.filter((psv) =>
            (psv.psv_number?.toLowerCase() ?? '').includes(lowerValue) ||
            (psv.accountnumber?.toLowerCase() ?? '').includes(lowerValue) ||
            (psv.location?.toLowerCase() ?? '').includes(lowerValue) ||
            (psv.meter_number?.toLowerCase() ?? '').includes(lowerValue) ||
            (psv.size?.toString() ?? '').includes(lowerValue) ||
            (psv.brand_name?.toLowerCase() ?? '').includes(lowerValue) ||
            (psv.pressure_setting?.toLowerCase() ?? '').includes(lowerValue) ||
            (psv.remarks?.toLowerCase() ?? '').includes(lowerValue)
        );

        setFilteredData(filtered);
    };

    const columns = [
        { title: 'PSV Number', dataIndex: 'psv_number', key: 'psv_number' },
        { title: 'Account Number', dataIndex: 'accountnumber', key: 'accountnumber' },
        { title: 'Location', dataIndex: 'location', key: 'location' },
        { title: 'Meter Number', dataIndex: 'meter_number', key: 'meter_number' },
        { title: 'Size', dataIndex: 'size', key: 'size' },
        { title: 'Brand Description', dataIndex: 'brand_name', key: 'brand_name' },
        { title: 'Pressure Setting', dataIndex: 'pressure_setting', key: 'pressure_setting' },
        { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' },
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
                      <Breadcrumb.Item>Pressure Setting Valve</Breadcrumb.Item>
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

export default PSVTable;