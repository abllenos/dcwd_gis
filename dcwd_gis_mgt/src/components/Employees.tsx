import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Input } from "antd";
import { Breadcrumb } from "antd"; 
import { HomeOutlined } from "@ant-design/icons";

const { Search } = Input;

interface Employee {
  EmpId: string;
  FirstName: string;
  LastName: string;
  MiddleName: string;
  Sex: number;
  computed1: string;
}

const EmployeeTable: React.FC = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [filteredData, setFilteredData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://192.100.140.198/api/react/employee.php");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setFilteredData(result); 
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  
  const onSearch = (value: string) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = data.filter((employee) => 
      Object.values(employee).some(
        (field) =>
          field &&
          field.toString().toLowerCase().includes(lowercasedValue)
      )
    );
    setFilteredData(filtered);
  };

  const columns = [
    { title: "Employee ID", dataIndex: "EmpId", key: "EmpId" },
    { title: "First Name", dataIndex: "FirstName", key: "FirstName" },
    { title: "Last Name", dataIndex: "LastName", key: "LastName" },
    { title: "Middle Name", dataIndex: "MiddleName", key: "MiddleName" },
    { title: "Sex", dataIndex: "Sex", key: "Sex", render: (text: number) => (text === 1 ? "Male" : "Female") },
    { title: "Birthdate", dataIndex: "computed1", key: "computed1", render: (text: string) => 
        text ? `${text.slice(0, 4)}/${text.slice(4, 6)}/${text.slice(6, 8)}` : "" },
  ];

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error fetching data" description={error} type="error" showIcon />;

  return (
    <div>
      <Breadcrumb style={{ margin: "20px 20px 20px 40px" }}>
        <Breadcrumb.Item href="/Dashboard">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span>Management</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Employees</Breadcrumb.Item>
      </Breadcrumb>

      <Search 
        placeholder="Search Employee by any field" 
        allowClear 
        enterButton="Search" 
        size="large" 
        onSearch={onSearch} 
        style={{ width: 400, marginBottom: 20, marginLeft: 40 }}
      />

      <Table dataSource={filteredData} columns={columns} rowKey="EmpId" />
    </div>
  );
};

export default EmployeeTable;
