import React, { useState } from 'react';
import {
  Breadcrumb,
  Card,
  Button,
  Modal,
  Select,
  message,
  DatePicker,
} from 'antd';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string | undefined>();

  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [activeReportTitle, setActiveReportTitle] = useState<string | null>(null);

  const [caretakerGroup, setCaretakerGroup] = useState<string | undefined>();
  const [reportDate, setReportDate] = useState<string | null>(null);

  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = useState<string | undefined>();
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const [location, setLocation] = useState<string | undefined>();

  const handleHomeClick = () => navigate('/home');

  const showModal = () => setModalVisible(true);

  const handleModalOk = () => {
    if (!selectedReportType) {
      message.warning('Please select a report category.');
      return;
    }
    message.success(`New report will be added to: ${selectedReportType}`);
    setModalVisible(false);
    setSelectedReportType(undefined);
  };

  const handleReportClick = (reportTitle: string) => {
    setActiveReportTitle(reportTitle);
    setReportModalVisible(true);
  };

  const handleReportModalOk = () => {
    if (activeReportTitle === 'Daily Accomplishment Report (Per Caretaker)') {
      if (!caretakerGroup || !reportDate) {
        message.warning('Please fill out all fields.');
        return;
      }
      message.success(`Daily report submitted for ${caretakerGroup} on ${reportDate}`);
    } else if (activeReportTitle === 'Leak Detection Statistics (PAMD - NRWMD)') {
      if (!dateFrom || !dateTo) {
        message.warning('Please select both From and To dates.');
        return;
      }
      message.success(`Leak statistics submitted from ${dateFrom} to ${dateTo}`);
    } else if (activeReportTitle === 'Monthly Reported Leaks (All Reporters)') {
      if (!selectedMonth || !selectedYear || !location) {
        message.warning('Please select month, year, and location.');
        return;
      }
      message.success(`Monthly report submitted for ${location}, ${selectedMonth} ${selectedYear}`);
    } else {
      message.success(`You submitted a report: ${activeReportTitle}`);
    }

    // Reset all fields
    setReportModalVisible(false);
    setCaretakerGroup(undefined);
    setReportDate(null);
    setDateFrom(null);
    setDateTo(null);
    setSelectedMonth(undefined);
    setSelectedYear(undefined);
    setLocation(undefined);
    setActiveReportTitle(null);
  };

  const renderReportButton = (title: string) => (
    <div
      onClick={() => handleReportClick(title)}
      style={{
        background: '#f0f5ff',
        padding: '16px',
        borderRadius: 8,
        textAlign: 'center',
        color: '#003a8c',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: '1px solid #91d5ff',
        marginBottom: 10,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#e6f7ff')}
      onMouseLeave={(e) => (e.currentTarget.style.background = '#f0f5ff')}
    >
      {title}
    </div>
  );

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const years = Array.from({ length: 10 }, (_, i) => `${2025 - i}`);

  const renderDynamicModalContent = () => {
    if (activeReportTitle === 'Daily Accomplishment Report (Per Caretaker)') {
      return (
        <>
          <p style={{ marginBottom: 6 }}>Caretaker Group</p>
          <Select
            placeholder="Select caretaker group"
            value={caretakerGroup}
            onChange={setCaretakerGroup}
            style={{ width: '100%', marginBottom: 8 }}
          >
            <Option value="Group A">Group A</Option>
            <Option value="Group B">Group B</Option>
            <Option value="Group C">Group C</Option>
          </Select>

          <p style={{ marginBottom: 6 }}>Date</p>
          <DatePicker
            style={{ width: '100%' }}
            onChange={(date, dateString) => setReportDate(dateString as string)}
          />
        </>
      );
    }

    if (activeReportTitle === 'Leak Detection (PAMD - NRWMD)') {
      return (
        <>
          <p style={{ marginBottom: 6 }}>Date From</p>
          <DatePicker
            style={{ width: '100%', marginBottom: 8 }}
            onChange={(date, dateString) => setDateFrom(dateString as string)}
          />

          <p style={{ marginBottom: 6 }}>Date To</p>
          <DatePicker
            style={{ width: '100%' }}
            onChange={(date, dateString) => setDateTo(dateString as string)}
          />
        </>
      );
    }

    if (activeReportTitle === 'Monthly Reported Leaks (All Reporters)') {
      return (
        <>
          <p style={{ marginBottom: 6 }}>Month</p>
          <Select
            placeholder="Select month"
            value={selectedMonth}
            onChange={setSelectedMonth}
            style={{ width: '100%', marginBottom: 8 }}
          >
            {months.map((month) => (
              <Option key={month} value={month}>
                {month}
              </Option>
            ))}
          </Select>

          <p style={{ marginBottom: 6 }}>Year</p>
          <Select
            placeholder="Select year"
            value={selectedYear}
            onChange={setSelectedYear}
            style={{ width: '100%', marginBottom: 8 }}
          >
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>

          <p style={{ marginBottom: 6 }}>Location</p>
          <Select
            placeholder="Select location"
            value={location}
            onChange={setLocation}
            style={{ width: '100%' }}
          >
            <Option value="Zone 1">Zone 1</Option>
            <Option value="Zone 2">Zone 2</Option>
            <Option value="Zone 3">Zone 3</Option>
          </Select>
        </>
      );
    }

    return <p>Details for: {activeReportTitle}</p>;
  };

  return (
    <div style={{ padding: '4px 24px 24px 24px' }}>
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            icon={<HomeOutlined />}
            onClick={handleHomeClick}
            type="text"
            style={{ fontSize: 16, color: '#00008B', margin: 0 }}
            shape="circle"
          />
          <Breadcrumb style={{ fontSize: 16, fontWeight: 500, margin: 0, marginLeft: 8 }}>
            <Breadcrumb.Item>/ Reports</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Add Report
        </Button>
      </div>

      {/* Card section */}
      <Card
        style={{
          marginBottom: 0,
          width: '100%',
          maxWidth: '100%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
        bodyStyle={{ padding: 24 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: 12, textAlign: 'center' }}>Daily Reports</h3>
            {renderReportButton('Daily Accomplishment Report (Per Caretaker)')}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: 12, textAlign: 'center' }}>Statistical Reports</h3>
            {renderReportButton('Leak Detection (PAMD - NRWMD)')}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: 12, textAlign: 'center' }}>Periodical Reports</h3>
            {renderReportButton('Monthly Reported Leaks (All Reporters)')}
            {renderReportButton('Leak Detection (PAMD - NRWMD)')}
          </div>
        </div>
      </Card>

      <Modal
        title="Select Report Category"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalOk}>
            Confirm
          </Button>,
        ]}
      >
        <Select
          placeholder="Choose a report category"
          value={selectedReportType}
          onChange={(value) => setSelectedReportType(value)}
          style={{ width: '100%' }}
        >
          <Option value="Daily Reports">Daily Reports</Option>
          <Option value="Statistical Reports">Statistical Reports</Option>
          <Option value="Periodical Reports">Periodical Reports</Option>
        </Select>
      </Modal>

      <Modal
        title={activeReportTitle}
        open={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        footer={[
          <Button key="ok" type="primary" onClick={handleReportModalOk}>
            Print Review
          </Button>,
        ]}
      >
        {renderDynamicModalContent()}
      </Modal>
    </div>
  );
};

export default Reports;
