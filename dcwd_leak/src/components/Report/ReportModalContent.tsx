import React, { useState, useEffect } from "react";
import { Select, Input, Button, Row, Col } from "antd";
import axios from "axios";

interface Props {
  reportType: string;
}

const { Option } = Select;

const ReportModalContent: React.FC<Props> = ({ reportType }) => {
  const [caretakers, setCaretakers] = useState<{ id: string; name: string }[]>([]);
  const [selectedCaretaker, setSelectedCaretaker] = useState("0");
  const [dateReport, setDateReport] = useState(new Date().toISOString().slice(0, 10));
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [site, setSite] = useState("0");
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().slice(0, 10));
  const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10));

//   useEffect(() => {
//     if (reportType === "dailyrepairs") {
//       axios
//         .get("/api/caretakers") 
//         .then((res) => {
//           setCaretakers(res.data);
//         });
//     }
//   }, [reportType]);

  const randomString = (length: number) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  const handleDailyRepair = () => {
    if (selectedCaretaker == "0") {
      const rString = randomString(164);
      const url = `./rpt_DailyAccomplishmentReport?exp=${rString}&dateReport=${dateReport}&ctgroup=${selectedCaretaker}&exp2=${rString}`;
    //   window.open(url);
    } else {
      console.log("Select a caretaker");
    }
  };

  const handleMonthlyReport = () => {
    if (site !== "0") {
      const rString = randomString(164);
      const url = `ajax/reports/rpt_monthly_all_leak_reports.php?exp=${rString}&xt3fd=${month}&3ref4=${year}&kfg4f=${site}&exp2=${rString}`;
      window.open(url);
    } else {
      console.log("Select a site");
    }
  };

  const handlePeriodReport = (urlEndpoint: string) => {
    const rString = randomString(164);
    const url = `ajax/reports/${urlEndpoint}?exp=${rString}&xt3fd=${dateFrom}&3ref4=${dateTo}&exp2=${rString}`;
    window.open(url);
  };

  switch (reportType) {
    case "dailyrepairs":
      return (
        <>
          <Row gutter={16}>
            <Col span={24}>
              <label>Caretaker Group</label>
              <Select
                style={{ width: "100%" }}
                value={selectedCaretaker}
                onChange={setSelectedCaretaker}
              >
                <Option value="0">- Select CARETAKER -</Option>
                {caretakers.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={24}>
              <label>Date</label>
              <Input
                type="date"
                value={dateReport}
                onChange={(e) => setDateReport(e.target.value)}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 16 }}>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button type="primary" onClick={handleDailyRepair}>
                Print Preview
              </Button>
            </Col>
          </Row>
        </>
      );

    case "monthly_1":
      return (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <label>Month</label>
              <Select value={month} onChange={setMonth} style={{ width: "100%" }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <Option key={m} value={m}>
                    {new Date(0, m - 1).toLocaleString("default", { month: "long" })}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <label>Year</label>
              <Select value={year} onChange={setYear} style={{ width: "100%" }}>
                {Array.from({ length: year - 2023 + 1 }, (_, i) => 2023 + i).map((y) => (
                  <Option key={y} value={y}>
                    {y}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <label>Location</label>
              <Select value={site} onChange={setSite} style={{ width: "100%" }}>
                <Option value="0">- SELECT -</Option>
                <Option value="1">Matina</Option>
                <Option value="2">Bajada</Option>
                <Option value="3">All</Option>
              </Select>
            </Col>
          </Row>
          <Row style={{ marginTop: 16 }}>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button type="primary" onClick={handleMonthlyReport}>
                Preview Report
              </Button>
            </Col>
          </Row>
        </>
      );

    case "period_ld_pamd":
      return (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <label>Date From</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </Col>
            <Col span={12}>
              <label>Date To</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 16 }}>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button type="primary" onClick={() => handlePeriodReport("rpt_periodic_leakdetection.php")}>
                Preview Report
              </Button>
            </Col>
          </Row>
        </>
      );

    case "period_ld_pamd_stat1":
      return (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <label>Date From</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </Col>
            <Col span={12}>
              <label>Date To</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: 16 }}>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button type="primary" onClick={() => handlePeriodReport("rpt_stat_leakdetection.php")}>
                Preview Report
              </Button>
            </Col>
          </Row>
        </>
      );

    default:
      return <p>No report configuration found.</p>;
  }
};

export default ReportModalContent;
