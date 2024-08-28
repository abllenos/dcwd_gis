import React, { useState } from 'react';
import { Table, Breadcrumb } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

type TableRowSelection<T> = TableProps<T>['rowSelection'];

interface DataType {
  key: React.Key;
  id: number;
  accesslevel: string;
  description: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Access Level',
    dataIndex: 'accesslevel',
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
];

const data: DataType[] = [];
for (let i = 0; i < 15; i++) {
  data.push({
    key: i,
    id: i,
    accesslevel: `R000${i}`,
    description: `Access${i}`,
  });
}

const AccessLevel: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
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
        <Breadcrumb.Item>Application</Breadcrumb.Item>
      </Breadcrumb>
      <Table
        style={{ margin: '20px' }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};

export default AccessLevel;
