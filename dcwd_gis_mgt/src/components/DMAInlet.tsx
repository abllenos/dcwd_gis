import React, { useEffect, useState } from 'react';
import { Table, Input, Spin, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { Breadcrumb } from "antd";

interface DMA {
  dma_code: string;
  landmark: string;
  watersource: string;
  size: number;
  depth: number;
  date_installed: string;
  prv_date_installed: string;
  status_of_work: string;
}

const DMAList: React.FC = () => {
  const [data, setData] = useState<DMA[]>([]);
  const [filteredData, setFilteredData] = useState<DMA[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');


 useEffect(() => {
        (async() => {
          try {
            const response = await fetch("http://192.100.140.198/helpers/gis/mgtsys/getLayers/getDmaInlet.php");
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

  const filtered = data.filter((dma) =>
    (dma.dma_code?.toLowerCase() ?? '').includes(lowerValue) ||
    (dma.landmark?.toLowerCase() ?? '').includes(lowerValue) ||
    (dma.watersource?.toLowerCase() ?? '').includes(lowerValue) ||
    (dma.status_of_work?.toLowerCase() ?? '').includes(lowerValue) ||
    (dma.date_installed?.toLowerCase() ?? '').includes(lowerValue) ||
    (dma.prv_date_installed?.toLowerCase() ?? '').includes(lowerValue) ||
    (dma.size?.toString() ?? '').includes(lowerValue) ||
    (dma.depth?.toString() ?? '').includes(lowerValue)
  );

  setFilteredData(filtered);
};


  const columns: ColumnsType<DMA> = [
    { title: 'DMA Code', dataIndex: 'dma_code', key: 'dma_code' },
    { title: 'Landmark', dataIndex: 'landmark', key: 'landmark' },
    { title: 'Water Source', dataIndex: 'watersource', key: 'watersource' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    { title: 'Depth', dataIndex: 'depth', key: 'depth' },
    { title: 'Date Installed', dataIndex: 'date_installed', key: 'date_installed' },
    { title: 'Previous Date Installed', dataIndex: 'prv_date_installed', key: 'prv_date_installed' },
    { title: 'Status of Work', dataIndex: 'status_of_work', key: 'status_of_work' },
  ];

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div style={{ padding: 20 }}>
        <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>DMA Inlet</Breadcrumb.Item>
        </Breadcrumb>
      <Input
        placeholder="Search DMA..."
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: 300, marginBottom: 20, marginTop: 20 }}
        suffix={<SearchOutlined />}
      />
      <Table dataSource={filteredData} columns={columns} rowKey="gid" />
    </div>
  );
};

export default DMAList;
