import React, { useState, useMemo } from "react";
import { Table, Input, Spin, Alert, Breadcrumb, Modal, Row, Col, Form } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./util/conn";
import MapComponent from "./mapView";

const { Search } = Input;

interface Distribution {
  gid: number;
  size: string;
  type: string;
  date_commissioned: string;
  length: string;
  description: string;
  ws: string;
  otp: string;
  st_asgeojson?: string; // Add if geometry is present
}

const fetchDistributionData = async (): Promise<Distribution[]> => {
  const res = await axiosInstance.get("helpers/gis/mgtsys/getPipeSys.php");
  return Array.isArray(res.data.data) ? res.data.data : [];
};

const DistributionList: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Distribution | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading, error } = useQuery<Distribution[]>({
    queryKey: ["distributionData"],
    queryFn: fetchDistributionData,
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    const lower = searchText.toLowerCase();
    return data.filter((d) =>
      (d.size ?? "").toLowerCase().includes(lower) ||
      (d.type ?? "").toLowerCase().includes(lower) ||
      (d.date_commissioned ?? "").toLowerCase().includes(lower) ||
      (d.length ?? "").toLowerCase().includes(lower) ||
      (d.description ?? "").toLowerCase().includes(lower) ||
      (d.ws ?? "").toLowerCase().includes(lower) ||
      (d.otp ?? "").toLowerCase().includes(lower)
    );
  }, [data, searchText]);

  const handleRowDoubleClick = (record: Distribution) => {
    setSelectedRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      console.log("Save:", { ...selectedRecord, ...values });
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
      key: "gid",
      render: (_: any, __: any, index: number) =>
        ((pagination.current || 1) - 1) * (pagination.pageSize || 10) + index + 1,
      width: 60,
    },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Date Commissioned", dataIndex: "date_commissioned", key: "date_commissioned" },
    { title: "Length", dataIndex: "length", key: "length" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "WS", dataIndex: "ws", key: "ws" },
    { title: "OTP", dataIndex: "otp", key: "otp" },
  ];

  if (isLoading) return <Spin size="large" />;
  if (error instanceof Error) return <Alert message="Error" description={error.message} type="error" showIcon />;

  return (
    <div style={{ padding: 20 }}>
      <Breadcrumb>
        <Breadcrumb.Item href="/"><HomeOutlined /></Breadcrumb.Item>
        <Breadcrumb.Item>Distribution & Transmission</Breadcrumb.Item>
      </Breadcrumb>

      <Search
        placeholder="Search ..."
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
        rowKey="gid"
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
        title="Pipe System"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={2000}
      >
        <Row gutter={24}>
          <Col span={14}>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="size" label="Size"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="type" label="Type"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="date_commissioned" label="Date Commissioned"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="length" label="Length"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="description" label="Description"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="ws" label="WS"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="otp" label="OTP"><Input /></Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col span={10}>
            <div style={{ height: '100%', width: '100%' }}>
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
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default DistributionList;
