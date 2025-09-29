import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Card, Row, Col, Spin, Typography, Statistic, Timeline } from "antd";

import {
  UserOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  TrophyOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { dashboardStore } from "../stores/dashboardStore";
import "../styles/Home.css";

const { Text, Title } = Typography;

const Home: React.FC = observer(() => {
  useEffect(() => {
    // Fetch customer stat on mount
    (async () => {
      try {
  const data = await getCustomerStat();
  // API returns { data: [{ All: string, ... }] }
  const count = data?.data?.[0]?.All ? Number(data.data[0].All) : 0;
  dashboardStore.setCustomerCount(count);
      } catch (e) {
  dashboardStore.setCustomerCount(0);
      }
    })();
  }, []);

  return (
    <div className="dashboard-container">
      {dashboardStore.loading && dashboardStore.reports.length === 0 ? (
        <div className="dashboard-loading">
          <Spin size="large" />
          <Text className="loading-text">Loading Dashboard...</Text>
        </div>
      ) : (
        <>
          <div className="dashboard-welcome-section">
            <div className="welcome-content">
              <HomeOutlined className="welcome-icon" />
              <div className="welcome-text">
                <Title level={2} className="welcome-title">
                  Welcome to DCWD GIS Management System
                </Title>
                <Text className="welcome-subtitle">
                  Your comprehensive water district infrastructure management platform
                </Text>
              </div>
            </div>
          </div>

          <Row gutter={[24, 24]} className="dashboard-stats-section">
            <Col xs={24} sm={12} lg={6}>
              <Card className="dashboard-stat-card blue-gradient">
                <div className="stat-content">
                  <div className="stat-info">
                    <Text className="stat-label">Total Customers</Text>
                    <Statistic 
                      value={dashboardStore.summary.dispatched || 15847} 
                      className="stat-number"
                    />
                  </div>
                  <UserOutlined className="stat-icon" />

                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="dashboard-stat-card green-gradient">
                <div className="stat-content">
                  <div className="stat-info">
                    <Text className="stat-label">Pipe Network Length</Text>
                    <Statistic 
                      value={dashboardStore.summary.total || 2453} 
                      suffix="km"
                      className="stat-number"
                    />
                  </div>
                  <EnvironmentOutlined className="stat-icon" />
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="dashboard-stat-card orange-gradient">
                <div className="stat-content">
                  <div className="stat-info">
                    <Text className="stat-label">Active Maintenance</Text>
                    <Statistic 
                      value={dashboardStore.summary.pending || 28} 
                      className="stat-number"
                    />
                  </div>
                  <SettingOutlined className="stat-icon" />
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="dashboard-stat-card purple-gradient">
                <div className="stat-content">
                  <div className="stat-info">
                    <Text className="stat-label">System Efficiency</Text>
                    <Statistic 
                      value={98.5} 
                      suffix="%" 
                      precision={1}
                      className="stat-number"
                    />
                  </div>
                  <TrophyOutlined className="stat-icon" />
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="dashboard-overview-section">
            <Col xs={24} lg={16}>
              <div style={{ height: '200px' }}></div>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Recent Activities" className="dashboard-activity-card">
                <Timeline
                  items={[
                    {
                      children: (
                        <div>
                          <Text strong>System Maintenance</Text>
                          <br />
                          <Text type="secondary">Valve inspection completed</Text>
                        </div>
                      ),
                      color: 'blue'
                    },
                    {
                      children: (
                        <div>
                          <Text strong>New Customer Registration</Text>
                          <br />
                          <Text type="secondary">45 new connections added</Text>
                        </div>
                      ),
                      color: 'green'
                    }
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
});

export default Home;
