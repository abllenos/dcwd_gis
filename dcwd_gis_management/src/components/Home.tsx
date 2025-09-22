import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Card, Row, Col, List, Typography, Spin } from "antd";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { dashboardStore } from "../stores/dashboardStore";

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

interface HomeProps {
  themeMode?: 'dark' | 'light';
}

const Home: React.FC<HomeProps> = observer(({ themeMode }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {

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
              <Card variant="borderless" style={{ ...statCardStyle(), position: "relative" }}>
                <div>
                  <div className="dashboard-label" style={labelStyle}>Customer</div>
                  <div style={numberStyle}>{dashboardStore.summary.dispatched}</div>
                </div>
                <CheckCircleOutlined style={iconStyle} />
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card variant="borderless" style={{ ...statCardStyle(), position: "relative" }}>
                <div>
                  <div className="dashboard-label" style={labelStyle}>Pipe Network Length</div>
                  <div style={numberStyle}>{dashboardStore.summary.total}</div>
                </div>
                <FileTextOutlined style={iconStyle} />
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card variant="borderless" style={{ ...statCardStyle(), position: "relative" }}>
                <div>
                  <div className="dashboard-label" style={labelStyle}>Reassessed Pipe Network</div>
                  <div style={numberStyle}>{dashboardStore.summary.pending}</div>
                </div>
                <ClockCircleOutlined style={iconStyle} />
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
  color: typeof window !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark'
    ? '#fff'
    : '#232323',
  textShadow: 'none',
};

const iconStyle: React.CSSProperties = {
  fontSize: 34,
  color: "#4169E1",
  position: "absolute",
  right: 16,
  bottom: 16,
};

export default Home;
