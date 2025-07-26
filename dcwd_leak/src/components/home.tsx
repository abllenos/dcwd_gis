import React from 'react';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";

interface DataType {
  key: string;
  id: string;
  date_time_reported: string;
  leak_type: string;
  location: string;
  ref_meter: string;
  ref_no: string;
  status: string;
  tags: string[];
}

const chartConfig = {
    type: "bar",
    height: 240,
    series: [
        {
            name: "Tickets",
            data: [50,40,300,320,500,350,200,230,500],
        },
    ],
    options: {
        char: {
            toolbar: {
                show: false,
            },
        },
    }
}
const columns: TableProps<DataType>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Date & Time Reported',
    dataIndex: 'date_time_reported',
    key: 'date_time_reported',
  },
  {
    title: 'Leak Type',
    dataIndex: 'leak_type',
    key: 'leak_type',
  },
  {
    title: 'Reference Meter',
    dataIndex: 'ref_meter',
    key: 'ref_meter',
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: 'Ref No.',
    dataIndex: 'ref_no',
    key: 'ref_no',
  },
  {
    title: 'Ticket Status',
    key: 'status',
    dataIndex: 'status',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
];

const data: DataType[] = [
  {
    key: 'id',
    id: '12',
    date_time_reported: 'May 13, 2025, 8:00 PM',
    leak_type: 'SL',
    ref_meter: '519486764J',
    location: 'Maa',
    ref_no: '2025010351321',
    status: 'pending', 
    tags: ['dispatched'],
  },
];

const Home: React.FC = () => <Table<DataType> columns={columns} dataSource={data} />;

export default Home;