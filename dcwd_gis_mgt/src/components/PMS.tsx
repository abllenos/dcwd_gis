import React, { Key, useEffect, useState } from 'react';
import { Table, Spin, Alert, Input, Button, Space, Breadcrumb, Card } from 'antd';
import { SearchOutlined, HomeOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { fetchData } from './endpoints/getPMS'; 

interface PMS {
  gid: number;
  pms_number: string;
  location: string;
  
}

const PMSList: React.FC = () => {
  const [data, setData] = useState<PMS[]>([]);
  const [filteredData, setFilteredData] = useState<PMS[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    const getData = async () => {
      try {
        const rawData = await fetchData();
        console.log("API response:", rawData);      
        if (Array.isArray(rawData)) {
          const transformedData: PMS[] = rawData.map((item: any[]) => ({
            gid: parseInt(item[0], 10),
            pms_number: item[1], 
            location: item[2],
                       
          }));
          setData(transformedData);
          setFilteredData(transformedData); 
        } else {
          throw new Error('Fetched data is not an array');
        }
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = data.filter((record) =>
      Object.values(record).some((field) =>
        field != null && field.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const handleReset = () => {
    setSearchText('');
    setFilteredData(data); 
  };

  if (loading) return <Spin tip="Loading..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'gid',
      key: 'gid',
    },
    {
      title: 'PMS Number',
      dataIndex: 'pms_number',
      key: 'pms_number',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },    
  ];

  return (
    <>
      <Breadcrumb style={{ margin: '20px 20px 20px 40px' }}>
        <Breadcrumb.Item href="/Dashboard">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span>Data Layers</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>PMS</Breadcrumb.Item>
      </Breadcrumb>
      <Card
        title="PMS"
        extra={
          <Space>
            <Input
              placeholder="Search..."
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

export default PMSList;
