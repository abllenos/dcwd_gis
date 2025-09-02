import React, { useState } from "react";
import { Card, Row, Col, Button, Modal } from "antd";
import { FileTextOutlined, HomeOutlined } from "@ant-design/icons";
import ReportModalContent from "./ReportModalContent"; 
const Reports: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentReport, setCurrentReport] = useState<string>("");

  const openModal = (reportType: string) => {
    setCurrentReport(reportType);
    setModalVisible(true);
  };

  return (
    <div className="page-body">
      <div className="container-fluid">
        <div className="page-header">
          <Row>
            <Col span={12}>
              <h3>Reports</h3>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="home.php">
                    <HomeOutlined />
                  </a>
                </li>
                <li className="breadcrumb-item active">Reports</li>
              </ol>
            </Col>
          </Row>
        </div>

        <Row gutter={16}>
          <Col span={8}>
            <Card title="Daily Reports">
              <Button
                type="link"
                icon={<FileTextOutlined />}
                onClick={() => openModal("dailyrepairs")}
              >
                Daily Accomplishment Report (Per Caretaker)
              </Button>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Statistical Reports">
              <Button
                type="link"
                icon={<FileTextOutlined />}
                onClick={() => openModal("period_ld_pamd_stat1")}
              >
                Leak Detection (PAMD-NRWMD)
              </Button>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Periodical Reports">
              <Button
                type="link"
                icon={<FileTextOutlined />}
                onClick={() => openModal("monthly_1")}
              >
                Monthly Reported Leaks (All Reporters)
              </Button>
              <br />
              <Button
                type="link"
                icon={<FileTextOutlined />}
                onClick={() => openModal("period_ld_pamd")}
              >
                Leak Detection Loading (PAMD-NRWMD)
              </Button>
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
        >
          {currentReport && <ReportModalContent reportType={currentReport} />}
        </Modal>
      </div>
    </div>
  );
};

export default Reports;
