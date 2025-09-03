import React, { useState } from "react";
import { Card, Row, Col, Button, Modal, Breadcrumb, Typography, Space } from "antd";
import { FileTextOutlined, HomeFilled } from "@ant-design/icons";
import ReportModalContent from "./ReportModalContent";

const { Title } = Typography; 
const Reports: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentReport, setCurrentReport] = useState<string>("");

  const openModal = (reportType: string) => {
    setCurrentReport(reportType);
    setModalVisible(true);
  };

  return (
    <div style={{ padding: '4px 24px 24px 24px', backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button icon={<HomeFilled />} type="text" style={{ fontSize: 16, color: "#00008B" }} shape="circle" />
          <Breadcrumb
            style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}
            items={[
              { title: "Reports" }
            ]}
          />
        </div>
      </div>

      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          padding: 24,
          borderRadius: 8,
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <Title level={3} style={{ marginBottom: 24, fontFamily: 'Montserrat, sans-serif' }}>
          Report Management
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <Card 
              title="Daily Reports" 
              style={{ 
                height: '100%',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              headStyle={{ 
                backgroundColor: '#f8f9fa',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="link"
                  icon={<FileTextOutlined />}
                  onClick={() => openModal("dailyrepairs")}
                  style={{ 
                    padding: 0, 
                    height: 'auto',
                    textAlign: 'left',
                    fontFamily: 'Montserrat, sans-serif'
                  }}
                >
                  Daily Accomplishment Report (Per Caretaker)
                </Button>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card 
              title="Statistical Reports"
              style={{ 
                height: '100%',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              headStyle={{ 
                backgroundColor: '#f8f9fa',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="link"
                  icon={<FileTextOutlined />}
                  onClick={() => openModal("period_ld_pamd_stat1")}
                  style={{ 
                    padding: 0, 
                    height: 'auto',
                    textAlign: 'left',
                    fontFamily: 'Montserrat, sans-serif'
                  }}
                >
                  Leak Detection (PAMD-NRWMD)
                </Button>
              </Space>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card 
              title="Periodical Reports"
              style={{ 
                height: '100%',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              headStyle={{ 
                backgroundColor: '#f8f9fa',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="link"
                  icon={<FileTextOutlined />}
                  onClick={() => openModal("monthly_1")}
                  style={{ 
                    padding: 0, 
                    height: 'auto',
                    textAlign: 'left',
                    fontFamily: 'Montserrat, sans-serif',
                    marginBottom: 8
                  }}
                >
                  Monthly Reported Leaks (All Reporters)
                </Button>
                <Button
                  type="link"
                  icon={<FileTextOutlined />}
                  onClick={() => openModal("period_ld_pamd")}
                  style={{ 
                    padding: 0, 
                    height: 'auto',
                    textAlign: 'left',
                    fontFamily: 'Montserrat, sans-serif'
                  }}
                >
                  Leak Detection Loading (PAMD-NRWMD)
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Modal */}
        <Modal
          title={`Report: ${currentReport}`}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
          styles={{
            header: {
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600
            }
          }}
        >
          {currentReport && <ReportModalContent reportType={currentReport} />}
        </Modal>
      </div>
    </div>
  );
};

export default Reports;
