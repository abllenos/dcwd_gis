import React, { useState, useMemo } from "react";
import {
  Table,
  Input,
  Spin,
  Alert,
  Breadcrumb,
  Modal,
  Row,
  Col,
  Form, 
  Select
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./util/conn";
import MapComponent from "./mapView";

const { Search } = Input;
const { Option } = Select;

interface DMA {
  dma_code: string;
  landmark: string;
  watersource: string;
  size: number;
  depth: number;
  date_installed: string;
  prv_date_installed: string;
  status_of_work: string;
  st_asgeojson?: string;
}

interface WSSOption {
  wscode: number;
  description: string;
}

const fetchWSSData = async (): Promise<WSSOption[]> => {
  const res = await axiosInstance.get("helpers/gis/mgtsys/getWss.php");
  return Array.isArray(res.data.data) ? res.data.data : [];
};

const fetchDMAData = async (): Promise<DMA[]> => {
  const res = await axiosInstance.get("helpers/gis/mgtsys/getLayers/getDmaInlet.php");
  return Array.isArray(res.data.data) ? res.data.data : [];
};

const DMAList: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DMA | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading, error } = useQuery<DMA[]>({
    queryKey: ["dmaData"],
    queryFn: fetchDMAData,
  });

  const { data: wssList = [] } = useQuery<WSSOption[]>({
    queryKey: ["wssData"],
    queryFn: fetchWSSData,
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

  const handleRowDoubleClick = (record: DMA) => {
    setSelectedRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      console.log("Updated values:", { ...selectedRecord, ...values });
      setIsModalOpen(false);
      setSelectedRecord(null);
    });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const columns = [
    {
      title: "#",
      key: "index",
      render: (_text: any, _record: any, index: number) =>
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
          setPagination({ ...pagination, current: 1 });
        }}
        style={{ width: 300, marginBottom: 20, marginTop: 20 }}
      />

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="dma_code"
        onRow={(record) => ({
          onDoubleClick: () => handleRowDoubleClick(record),
        })}
        pagination={{
          ...pagination,
          total: filteredData.length,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
        }}
      />

            <Modal
        title="DMA Inlet Details"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={1000} 
        style={{ top: 20 }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dma_code" label="DMA Code"><Input /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="landmark" label="Landmark"><Input /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="watersource" label="Water Source">
                <Select
                  placeholder="Select water source"
                  onChange={(value) => {
                    console.log("Selected WSS ID:", value);
                  }}
                >
                  {wssList.map((wss) => (
                    <Option key={wss.wscode} value={wss.wscode}>
                      {wss.description}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="size" label="Size"><Input /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="depth" label="Depth"><Input /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date_installed" label="Date Installed"><Input /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="prv_date_installed" label="Previous Date Installed"><Input /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status_of_work" label="Status of Work"><Input /></Form.Item>
            </Col>
          </Row>
        </Form>

        <div style={{ marginTop: 20, height: "100%", width: "100%" }}>
          {selectedRecord?.st_asgeojson ? (() => {
            try {
              const parsed = JSON.parse(selectedRecord.st_asgeojson);
              if (parsed.type === "Point" && Array.isArray(parsed.coordinates)) {
                const [lng, lat] = parsed.coordinates;
                return (
                  <MapComponent
                    geometry={{ coordinates: [{ lat, lng }] }}
                    center={{ lat, lng }}
                  />
                );
              }
              return <p style={{ textAlign: "center", color: "#999" }}>Unsupported geometry</p>;
            } catch {
              return <p style={{ textAlign: "center", color: "#999" }}>Invalid GeoJSON</p>;
            }
          })() : (
            <p style={{ textAlign: "center", color: "#999" }}>No geometry available</p>
          )}
        </div>
      </Modal>

    </div>
  );
};

export default DMAList;
