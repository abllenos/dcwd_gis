import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Card, Row, Col, Spin } from "antd";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { dashboardStore } from "../stores/dashboardStore";
import "../styles/Home.css";

const Home: React.FC = observer(() => {

  useEffect(() => {
    // Initialize dashboard data if needed
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen pt-20 sm:pt-24 md:pt-28">
      {dashboardStore.loading && dashboardStore.reports.length === 0 ? (
        <div className="home-loading">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={6}>
              <Card variant="borderless" className="home-stat-card home-card-wrapper">
                <div>
                  <div className="dashboard-label home-dashboard-label">Customer</div>
                  <div className="home-dashboard-number">{dashboardStore.summary.dispatched}</div>
                </div>
                <CheckCircleOutlined className="home-dashboard-icon" />
              </Card>
            </Col>

            <Col xs={24} md={6}>
              <Card variant="borderless" className="home-stat-card home-card-wrapper">
                <div>
                  <div className="dashboard-label home-dashboard-label">Pipe Network Length</div>
                  <div className="home-dashboard-number">{dashboardStore.summary.total}</div>
                </div>
                <FileTextOutlined className="home-dashboard-icon" />
              </Card>
            </Col>

            <Col xs={24} md={6}>
              <Card variant="borderless" className="home-stat-card home-card-wrapper">
                <div>
                  <div className="dashboard-label home-dashboard-label">Reassessed Pipe Network</div>
                  <div className="home-dashboard-number">{dashboardStore.summary.pending}</div>
                </div>
                <ClockCircleOutlined className="home-dashboard-icon" />
              </Card>
            </Col>

            <Col xs={24} md={6}>
              <Card variant="borderless" className="home-stat-card home-card-wrapper">
                <div>
                  <div className="dashboard-label home-dashboard-label">Road Network</div>
                  <div className="home-dashboard-number">30017,8,556.41 km</div>
                </div>
                <FileTextOutlined className="home-dashboard-icon" />
              </Card>
            </Col>
          </Row>

          

          
        </>
      )}
    </div>
  );
});

export default Home;
