import React, { useState } from "react";
import { Card, Row, Col, Button, Modal, Breadcrumb, Typography, Space } from "antd";
import { FileTextOutlined, HomeFilled } from "@ant-design/icons";
import ReportModalContent from "./ReportModalContent";
import { SearchOutlined } from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';

const { Title } = Typography; 
const Reports: React.FC = () => {
  // Handler for dropdown icon click
  const handleHeaderDropdown = (reportType: string) => {
    openModal(reportType);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [currentReport, setCurrentReport] = useState<string>("");

  const openModal = (reportType: string) => {
    setCurrentReport(reportType);
    setModalVisible(true);
  };

  // Dropdown menus for each card
  const dailyMenu = (
    <Menu onClick={({ key }) => openModal(key)}>
      <Menu.Item key="dailyrepairs">Daily Accomplishment Report (Per Caretaker)</Menu.Item>
    </Menu>
  );
  const statisticalMenu = (
    <Menu onClick={({ key }) => openModal(key)}>
      <Menu.Item key="period_ld_pamd_stat1">Leak Detection (PAMD-NRWMD)</Menu.Item>
    </Menu>
  );
  const periodicalMenu = (
    <Menu onClick={({ key }) => openModal(key)}>
      <Menu.Item key="monthly_1">Monthly Reported Leaks (All Reporters)</Menu.Item>
      <Menu.Item key="period_ld_pamd">Leak Detection Loading (PAMD-NRWMD)</Menu.Item>
    </Menu>
  );

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ fontFamily: 'Montserrat, sans-serif', margin: 0 }}>
            Report Management
          </Title>
          <div style={{ minWidth: 280, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search reports..."
              style={{
                width: '100%',
                padding: '8px 36px 8px 12px',
                borderRadius: 6,
                border: '1px solid #1890ff',
                fontSize: 16,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = '#0050b3')}
              onBlur={e => (e.target.style.borderColor = '#1890ff')}
            />
            <SearchOutlined style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: '#1890ff' }} />
          </div>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Daily Reports</span>
                  <Dropdown overlay={dailyMenu} placement="bottomRight" trigger={["click"]}>
                    <DownOutlined style={{ fontSize: 16, color: '#888', cursor: 'pointer', marginLeft: 8 }} />
                  </Dropdown>
                </div>
              }
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
            />
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Statistical Reports</span>
                  <Dropdown overlay={statisticalMenu} placement="bottomRight" trigger={["click"]}>
                    <DownOutlined style={{ fontSize: 16, color: '#888', cursor: 'pointer', marginLeft: 8 }} />
                  </Dropdown>
                </div>
              }
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
            />
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Periodical Reports</span>
                  <Dropdown overlay={periodicalMenu} placement="bottomRight" trigger={["click"]}>
                    <DownOutlined style={{ fontSize: 16, color: '#888', cursor: 'pointer', marginLeft: 8 }} />
                  </Dropdown>
                </div>
              }
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
            />
        {/* Modal for report content */}
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
          </Col>
        </Row>

      </div>
    </div>
  );
};

export default Reports;
