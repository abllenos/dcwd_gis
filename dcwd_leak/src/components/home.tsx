import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Card, Row, Col, List, Typography, Spin } from "antd";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { dashboardStore } from "../stores/dashboardStore";
import MonthlyLeakChart from "./MonthlyLeakChart";

const { Title } = Typography;

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  "Un-Dispatch": { bg: "#fde68a", text: "#92400e", border: "#f59e0b" },
  Dispatched: { bg: "#22aa52ff", text: "#ebf7efff", border: "#14bb51ff" },
  Repaired: { bg: "#3b82f6", text: "#e0f2fe", border: "#2563eb" },
  "For Schedule": { bg: "#f59e0b", text: "#fff7ed", border: "#d97706" },
  "For Turn over": { bg: "#8b5cf6", text: "#f3e8ff", border: "#7c3aed" },
  "After The Meter Leak": { bg: "#ef4444", text: "#fee2e2", border: "#dc2626" },
  Unknown: { bg: "#9ca3af", text: "#f9fafb", border: "#6b7280" },
};

const Home: React.FC = observer(() => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    dashboardStore.fetchInitial(); 
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen pt-20 sm:pt-24 md:pt-28">
      {dashboardStore.loading && dashboardStore.reports.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: 100 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card bordered={false} style={{ ...statCardStyle(), position: "relative" }}>
                <div>
                  <div style={labelStyle}>Dispatched</div>
                  <div style={numberStyle}>{dashboardStore.summary.dispatched}</div>
                </div>
                <CheckCircleOutlined style={iconStyle} />
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card bordered={false} style={{ ...statCardStyle(), position: "relative" }}>
                <div>
                  <div style={labelStyle}>Total Reports</div>
                  <div style={numberStyle}>{dashboardStore.summary.total}</div>
                </div>
                <FileTextOutlined style={iconStyle} />
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card bordered={false} style={{ ...statCardStyle(), position: "relative" }}>
                <div>
                  <div style={labelStyle}>Pending (Un-Dispatch)</div>
                  <div style={numberStyle}>{dashboardStore.summary.pending}</div>
                </div>
                <ClockCircleOutlined style={iconStyle} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24}>
              <Card title="Monthly Leak Reports" bordered={false} style={{ height: 350 }}>
                <MonthlyLeakChart data={dashboardStore.monthlyReports} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24}>
              <Card bordered={false}>
                <Title level={5}>Leak Reports</Title>
                <Row
                  style={{
                    fontWeight: 600,
                    backgroundColor: "#f9fafb",
                    borderBottom: "2px solid #e5e7eb",
                    padding: "8px 0",
                    marginBottom: 8,
                  }}
                  gutter={[8, 8]}
                >
                  <Col xs={2}>ID</Col>
                  <Col xs={5}>Date Reported</Col>
                  <Col xs={3}>Leak Type</Col>
                  <Col xs={4}>Ref/Meter</Col>
                  <Col xs={4}>Address</Col>
                  <Col xs={6}>Status</Col>
                </Row>

                <List
                  dataSource={dashboardStore.reports}
                  loading={dashboardStore.loading}
                  pagination={{
                    current: dashboardStore.page,
                    pageSize: dashboardStore.pageSize,
                    total: dashboardStore.total,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20", "50"],
                    onChange: (page, pageSize) => {
                      dashboardStore.setPage(page, pageSize);
                    },
                  }}
                  renderItem={(item) => (
                    <List.Item style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <Row style={{ width: "100%" }} gutter={[8, 8]}>
                        <Col xs={2}>{item.id}</Col>
                        <Col xs={5}>{item.date_time_reported}</Col>
                        <Col xs={3}>{item.leak_type}</Col>
                        <Col xs={4}>{item.ref_meter}</Col>
                        <Col xs={4}>{item.address ?? "N/A"}</Col>
                        <Col xs={6}>
                          <span
                            style={{
                              backgroundColor: statusColors[item.status]?.bg,
                              color: statusColors[item.status]?.text,
                              border: `1px solid ${statusColors[item.status]?.border}`,
                              padding: "2px 8px",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              textTransform: "uppercase",
                            }}
                          >
                            {item.status}
                          </span>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
});

const statCardStyle = () => ({
  backgroundColor: "#ffffff",
  boxShadow: `0 2px 8px rgba(0,0,0,0.08)`,
  minHeight: 115,
  borderRadius: 8,
  padding: 16,
});

const labelStyle: React.CSSProperties = {
  fontSize: "1.10rem",
  color: "#504f4fff",
};

const numberStyle: React.CSSProperties = {
  fontSize: "1.40rem",
  fontWeight: 600,
};

const iconStyle: React.CSSProperties = {
  fontSize: 34,
  color: "#4169E1",
  position: "absolute",
  right: 16,
  bottom: 16,
};

export default Home;
