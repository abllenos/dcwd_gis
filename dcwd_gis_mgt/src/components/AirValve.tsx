import React, { useState, useMemo } from "react";
import {
  Table,
  Spin,
  Alert,
  Input,
  Breadcrumb,
  Row,
  Col,
} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {axiosInstance} from "./util/conn";
import { Modal, Form, Button } from "antd";
import MapComponent from "./mapView";

const { Search } = Input;

interface AirValve {
  gid: string;
  accessby: string;
  arv_number: string;
  barangay: string;
  brand: string | null;
  brand_description: string | null;
  brgycode: string;
  created_at: string;
  date_commissioned: string;
  dategeocoded: string | null;
  hotlink: string;
  installdate: string | null;
  location: string;
  modified_at: string;
  number_of_turns: string;
  project_title: string;
  remarks: string | null;
  serialno: string | null;
  size: string;
  st_asgeojson: string;
  status: string | null;
  type: string;
  type2: string;
  wonumber: string;
  wscode: string;
  
}

const fetchAirValves = async (): Promise<AirValve[]> => {
    const res = await axiosInstance.get("helpers/gis/mgtsys/getLayers/getAv.php");
    return Array.isArray(res.data.data) ? res.data.data : [];
}

const AirValveTable: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AirValve | null>(null);
  const [form] = Form.useForm();

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

  const onRowDoubleClick = (record: AirValve) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Updated record:", { ...editingRecord, ...values });
        setIsModalOpen(false);
        setEditingRecord(null);
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

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

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="gid"
        onRow={(record) => ({
          onDoubleClick: () => onRowDoubleClick(record),
        })}
      />

      <Modal
        title="Air Valve"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        width={2000} // Wider to accommodate both form and map nicely
      >
        <Row gutter={24}>
          {/* Left side: Form fields */}
          <Col span={14}>
            <Form form={form} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="arv_number" label="ARV Number"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="barangay" label="Barangay"><Input /></Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="brand_description" label="Brand"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="created_at" label="Created At"><Input /></Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="date_commissioned" label="Date Commissioned"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="hotlink" label="Hotlink"><Input /></Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="installdate" label="Install Date"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="location" label="Location"><Input /></Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="modified_at" label="Modified At"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="number_of_turns" label="Number of Turns"><Input /></Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="project_title" label="Project Title"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="remarks" label="Remarks"><Input /></Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="size" label="Size"><Input /></Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="status" label="Status"><Input /></Form.Item>
                </Col>

                {/* <Col span={12}>
                  <Form.Item name="type2" label="Type"><Input /></Form.Item>
                </Col> */}
                <Col span={12}>
                  <Form.Item name="wonumber" label="WO Number"><Input /></Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
         <Col span={10}>
            <div style={{ height: '100%', width: '100%' }}>
              {editingRecord?.st_asgeojson ? (() => {
                try {
                  const parsed = JSON.parse(editingRecord.st_asgeojson);
                  if (parsed.type === "Point" && Array.isArray(parsed.coordinates)) {
                    const [lng, lat] = parsed.coordinates;
                    return (
                      <div style={{ height: '100%', width: '100%' }}>
                        <MapComponent
                          geometry={{ coordinates: [{ lat, lng }] }}
                          center={{ lat, lng }}
                        />
                      </div>
                    );
                  } else {
                    return <p style={{ textAlign: "center", color: "#999" }}>Unsupported geometry</p>;
                  }
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


export default AirValveTable;
