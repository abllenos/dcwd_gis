import React, { useEffect } from "react";
import { Table, Spin, Alert, Input, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { observer } from "mobx-react";
import { employeeStore } from "./stores/EmployeeStore";

const { Search } = Input;

const EmployeeTable: React.FC = observer(() => {
  useEffect(() => {
    employeeStore.fetchEmployees();
  }, []);

  const columns = [
    { title: "Employee ID", dataIndex: "EmpId", key: "EmpId"},
    { title: "First Name", dataIndex: "FirstName", key: "FirstName"},
    { title: "Last Name", dataIndex: "LastName", key: "LastName"},
    { title: "Middle Name", dataIndex: "MiddleName", key: "MiddleName"},
    {
      title: "Sex",
      dataIndex: "Sex",
      key: "Sex",
      render: (text: number) => (text === 1 ? "Male" : "Female"),
    },
    {
      title: "Birthdate",
      dataIndex: "computed1",
      key: "computed1",
      render: (text: string) =>
        text ? `${text.slice(0,4)}/${text.slice(4,6)}/${text.slice(6,8)}` : "",
    },
  ];

  if (employeeStore.loading) return <Spin size="large"/>;
  if (employeeStore.error)
    return (
      <Alert
        message = "Error fetching data"
        description = {employeeStore.error}
        type = "error"
        showIcon
      />
    );

    return (
      <div>
        <Breadcrumb
          style = {{ margin: "20px 20px 20px 40px"}}
          items = {[
            {
              href: "/Dashboard",
              title: <HomeOutlined/>,
            },
            {
              title: "Management",
            },
            {
              title: "Employees",
            },
          ]}
        />

        <Search
          placeholder = "Search Employee by any field"
          allowClear
          enterButton = "Search"
          size = "large"
          onSearch = {(value) => employeeStore.search(value)}
          style = {{ width: 400, marginBottom: 20, marginLeft: 40}}
        />

        <Table
          dataSource = {employeeStore.filteredEmployees}
          columns = {columns}
          rowKey = "EmpId"
        />
      </div>
    );
});

export default EmployeeTable;