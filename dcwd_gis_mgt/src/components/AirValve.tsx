import React, { useState, useMemo } from "react";
import {
  Table,
  Spin,
  Alert,
  Input,
  Breadcrumb,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {axiosInstance} from "./util/conn";

const { Search } = Input;

interface AirValve {
  gid: number;
  arv_number: string;
  dategeocoded: string;
  wonumber: string;
  size: number;
  brand_description: string;
  status: string;
  location: string;
}

const fetchAirValves = async (): Promise<AirValve[]> => {
    const res = await axiosInstance.get("helpers/gis/mgtsys/getLayers/getAv.php");
    return Array.isArray(res.data.data) ? res.data.data : [];
}

const AirValveTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const { data, isLoading, error } = useQuery<AirValve[]>({
    queryKey: ["airValves"],
    queryFn: fetchAirValves,
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    const lowerValue = searchText.toLowerCase();
    return data.filter((item) =>
      (item.arv_number?.toLowerCase() ?? '').includes(lowerValue) ||
      (item.dategeocoded?.toLowerCase() ?? '').includes(lowerValue) ||
      (item.wonumber?.toLowerCase() ?? '').includes(lowerValue) ||
      (item.size?.toString() ?? '').includes(lowerValue) ||
      (item.brand_description?.toLowerCase() ?? '').includes(lowerValue) ||
      (item.status?.toLowerCase() ?? '').includes(lowerValue) ||
      (item.location?.toLowerCase() ?? '').includes(lowerValue)
    );
  }, [data, searchText]);

  const columns = [
    { title: "ARV Number", dataIndex: "arv_number", key: "arv_number" },
    { title: "Date Geocoded", dataIndex: "dategeocoded", key: "dategeocoded" },
    { title: "WO Number", dataIndex: "wonumber", key: "wonumber" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Brand Description", dataIndex: "brand_description", key: "brand_description" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Location", dataIndex: "location", key: "location" },
  ];

  if (isLoading) return <Spin size="large" />;
  if (error instanceof Error) return <Alert message={error.message} type="error" showIcon />;

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Air Valve</Breadcrumb.Item>
      </Breadcrumb>

      <Search
        placeholder="Search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 20, marginTop: 20 }}
      />

      <Table dataSource={filteredData} columns={columns} rowKey="gid" />
    </div>
  );
};

export default AirValveTable;
