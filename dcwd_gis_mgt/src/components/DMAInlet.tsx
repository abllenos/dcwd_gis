import React, { useState, useMemo } from "react";
import { Table, Input, Spin, Alert, Breadcrumb } from "antd";
import { HomeOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./util/conn";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

const { Search } = Input;

interface DMA {
  dma_code: string;
  landmark: string;
  watersource: string;
  size: number;
  depth: number;
  date_installed: string;
  prv_date_installed: string;
  status_of_work: string;
}

const fetchDMAData = async (): Promise<DMA[]> => {
  const res = await axiosInstance.get("getDmaInlet.php");
  return Array.isArray(res.data.data) ? res.data.data : [];
};

const DMAList: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const { data, isLoading, error } = useQuery<DMA[]>({
    queryKey: ["dmaData"],
    queryFn: fetchDMAData,
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    const lowerValue = searchText.toLowerCase();
    return data.filter((dma) =>
      (dma.dma_code?.toLowerCase() ?? "").includes(lowerValue) ||
      (dma.landmark?.toLowerCase() ?? "").includes(lowerValue) ||
      (dma.watersource?.toLowerCase() ?? "").includes(lowerValue) ||
      (dma.size?.toString() ?? "").includes(lowerValue) ||
      (dma.depth?.toString() ?? "").includes(lowerValue) ||
      (dma.date_installed?.toLowerCase() ?? "").includes(lowerValue) ||
      (dma.prv_date_installed?.toLowerCase() ?? "").includes(lowerValue) ||
      (dma.status_of_work?.toLowerCase() ?? "").includes(lowerValue)
    );
  }, [data, searchText]);

  const columns: ColumnsType<DMA> = [
    {
      title: "#",
      key: "index",
      render: (_text, _record, index) =>
        ((pagination.current || 1) - 1) * (pagination.pageSize || 10) + index + 1,
      width: 60,
    },
    { title: "DMA Code", dataIndex: "dma_code", key: "dma_code" },
    { title: "Landmark", dataIndex: "landmark", key: "landmark" },
    { title: "Water Source", dataIndex: "watersource", key: "watersource" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Depth", dataIndex: "depth", key: "depth" },
    { title: "Date Installed", dataIndex: "date_installed", key: "date_installed" },
    { title: "Previous Date Installed", dataIndex: "prv_date_installed", key: "prv_date_installed" },
    { title: "Status of Work", dataIndex: "status_of_work", key: "status_of_work" },
  ];

  if (isLoading) return <Spin size="large" />;
  if (error instanceof Error)
    return <Alert message="Error" description={error.message} type="error" showIcon />;

  return (
    <div style={{ padding: 20 }}>
      <Breadcrumb>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>DMA Inlet</Breadcrumb.Item>
      </Breadcrumb>

      <Search
        placeholder="Search DMA..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setPagination({ ...pagination, current: 1 }); // reset to page 1
        }}
        style={{ width: 300, marginBottom: 20, marginTop: 20 }}
       
      />

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="dma_code"
        pagination={{
          ...pagination,
          total: filteredData.length,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
        }}
      />
    </div>
  );
};

export default DMAList;
