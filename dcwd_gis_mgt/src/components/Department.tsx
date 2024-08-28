import React, { useEffect, useState } from 'react';
import { fetchData } from './endpoints/getDept';
import { Table } from 'antd'
import 'antd/dist/reset.css'


interface Department {
  ID: number;
  Department: string;
  DepartmentCode: string;
}

const App: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const response = await fetchData();
        console.log("API response:", response);

       
        const data = response.data;

        
        if (Array.isArray(data)) {
          
          const transformedData: Department[] = data.map((item: any[]) => ({
            ID: parseInt(item[0], 10), 
            Department: item[1],
            DepartmentCode: item[2]
          }));

          
          setDepartments(transformedData);
        } else {
          console.error('Fetched data is not an array:', data);
          setDepartments([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setDepartments([]);
      }
    };

    getDepartments();
  }, []);


    const columns = [
      {
        title: 'ID',
        dataIndex: 'ID',
        key: 'ID',
      },
      {
        title: 'Name',
        dataIndex: 'Department',
        key: 'Department',
      },
      {
        title: 'Code',
        dataIndex: 'DepartmentCode',
        key: 'DepartmentCode',
      },
    ];

  return (
    <div>
      <h1>Departments</h1>
      <Table
        dataSource={departments}
        columns={columns}
        rowKey="ID"
        pagination={false}
      />
    </div>
  );
};

export default App;
