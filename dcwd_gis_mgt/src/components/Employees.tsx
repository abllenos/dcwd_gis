import React, { useEffect, useState } from "react";
import { Table, Spin, Alert } from "antd";

interface Employee {
  empid: string;
  name: string;
  position: string;
  department: string;
  email: string;
}

const EmployeeTable: React.FC = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("https://www.davao-water.gov.ph:8443/dcwdApps/nsc/getEmployee.php");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const columns = [
    { title: "Employee ID", dataIndex: "empid", key: "empid" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Position", dataIndex: "position", key: "position" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Email", dataIndex: "email", key: "email" },
  ];

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error fetching data" description={error} type="error" showIcon />;

  return <Table dataSource={data} columns={columns} rowKey="empid" />;
};

export default EmployeeTable;
