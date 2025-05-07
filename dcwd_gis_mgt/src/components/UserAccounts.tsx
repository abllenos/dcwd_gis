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
  AccessLevel: string;
  DeptID: string;
  Role: string;
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
    title: 'Access Level',
    dataIndex: 'AccessLevel',
  },
  {
    title: 'Department',
    dataIndex: 'DeptID',
  },
  {
    title: 'Role',
    dataIndex: 'Role',
  }
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
          const fullName = item[2]?.trim() || '';

          let lastName = '';
          let firstName = '';

          if (fullName.includes(',')) {
            const [last, firstMiddle] = fullName.split(',');
            lastName = last.trim().replace(/\s+/g, ' ');
            firstName = firstMiddle.trim().replace(/\s+/g, ' ');
          } else {
            lastName = fullName.trim();
            firstName = '';
          }

          const deptID = item[3]?.trim() || '';
          const accessLevel = item[4]?.trim() || '';
          const roleDesc = item[5]?.trim() || '';

          return {
            key: index,
            empID,
            FirstName: firstName,
            LastName: lastName,
            AccessLevel: accessLevel,
            DeptID: deptID,
            Role: roleDesc
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
          <span>System Management</span>
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
