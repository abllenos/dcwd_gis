import React, { Key, useEffect, useState } from 'react';
import { Table, Spin, Alert, Input, Button, Space, Breadcrumb, Card } from 'antd';
import { SearchOutlined, HomeOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { fetchData } from './endpoints/getDmaInlet'; 

interface DMA {
  gid: number;
  wonumber: string;
  project_title: string;
  size: number;
  type: string;
  length: number;
  created_at: Date;
}

const DMAList: React.FC = () => {
  const [data, setData] = useState<DMA[]>([]);
  const [filteredData, setFilteredData] = useState<DMA[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    const getData = async () => {
      try {
        const rawData = await fetchData();
        console.log("API response:", rawData);
        
        
        if (Array.isArray(rawData)) {
          const transformedData: DMA[] = rawData.map((item: any[]) => ({
            gid: parseInt(item[0], 10),
            wonumber: item[1], 
            project_title: item[2],
            size: parseFloat(item[3]), 
            type: item[4],
            length: parseFloat(item[5]),
            created_at: new Date(item[6]), 
            
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
      title: 'GID',
      dataIndex: 'gid',
      key: 'gid',
    },
    {
      title: 'Work Order Number',
      dataIndex: 'wonumber',
      key: 'wonumber',
    },
    {
      title: 'Project Title',
      dataIndex: 'project_title',
      key: 'project_title',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Length',
      dataIndex: 'length',
      key: 'length',
    },
    
  ];

  return (
    <>
      <Breadcrumb
        style={{ margin: '20px 20px 20px 40px' }}
        items={[
          {
            href: '/Dashboard',
            title: <HomeOutlined />,
          },
          {
            title: 'Data Layers',
          },
          {
            title: 'DMA Inlet',
          },
        ]}
      />

      <Card
        title="DMA"
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

export default DMAList;
