import React, { useEffect, useState } from 'react';
import { Table, Breadcrumb, Spin, message } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

type TableRowSelection<T> = TableProps<T>['rowSelection'];

interface DataType {
  key: React.Key;
  empID: string;
  FirstName: string;
  LastName: string;
  Username: string;
  AccessLevel: string;
  DeptID: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'Employee ID',
    dataIndex: 'empID',
  },
  {
    title: 'First Name',
    dataIndex: 'FirstName',
  },
  {
    title: 'Last Name',
    dataIndex: 'LastName',
  },
  {
    title: 'User Name',
    dataIndex: 'Username',
  },
  {
    title: 'Access Level',
    dataIndex: 'AccessLevel',
  },
  {
    title: 'DeptID',
    dataIndex: 'DeptID',
  },
];

const UserAccounts: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      {
        key: 'select-all',
        text: 'Select All',
        onSelect: (changeableRowKeys) => {
          setSelectedRowKeys(changeableRowKeys);
        },
      },
      {
        key: 'select-none',
        text: 'Select None',
        onSelect: () => {
          setSelectedRowKeys([]);
        },
      },
      {
        key: 'select-odd',
        text: 'Select Odd Rows',
        onSelect: (changeableRowKeys) => {
          const newSelectedRowKeys = changeableRowKeys.filter((_, index) => index % 2 === 0);
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'select-even',
        text: 'Select Even Rows',
        onSelect: (changeableRowKeys) => {
          const newSelectedRowKeys = changeableRowKeys.filter((_, index) => index % 2 !== 0);
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  useEffect(() => {
    fetch('http://192.100.140.198/api/react/useraccounts.php')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((json) => {
        const formattedData: DataType[] = json.data.map((item: any[], index: number) => {
          const empID = item[1];
          const fullName = item[2].trim();
          const [last, firstMiddle] = fullName.includes(',') ? fullName.split(',') : [fullName, ''];
          const firstName = firstMiddle?.trim() || '';
          const lastName = last.trim();
          const username = empID; // You can change this logic if needed
          const deptID = item[3].trim();
          const accessLevel = item[4]?.trim() || '';

          return {
            key: index,
            empID,
            FirstName: firstName,
            LastName: lastName,
            Username: username,
            AccessLevel: accessLevel,
            DeptID: deptID,
          };
        });

        setData(formattedData);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        message.error('Failed to load user data.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="">
          <UserOutlined />
          <span>Application List</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>User Accounts</Breadcrumb.Item>
      </Breadcrumb>

      <Spin spinning={loading}>
        <Table
          style={{ margin: '20px' }}
          columns={columns}
          dataSource={data}
        />
      </Spin>
      
    </div>
  );
};

export default UserAccounts;
