import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

interface DispatchRecord {
  dispatch_ID: string;
  C_Address: string;
  Dispatch_Stat: number;
  spool_ID: string;
  DT_Reported: string;
  dispatch_time: string;
  time_started: string;
  time_finished: string;
  LeakType: string;
}

interface LogRecord {
  Trans_datetime: string;
  remarks: string;
}

interface Props {
  caretakerId: string;
  reportDate: string;
}

const DailyAccomplishmentReport: React.FC = () => {
  const [records, setRecords] = useState<DispatchRecord[]>([]);
  const [teamLeader, setTeamLeader] = useState<string>("");
  const [logs, setLogs] = useState<Record<string, LogRecord[]>>({}); 
  const [searchParams] = useSearchParams();

  const caretakerId = searchParams.get("ctgroup") || "";
  const reportDate = searchParams.get("dateReport") || "";
  useEffect(() => {
   
    const spoolIds = records
      .filter((r) => [5, 6, 7].includes(r.Dispatch_Stat))
      .map((r) => r.spool_ID);

    spoolIds.forEach((id) => {
      const transCode = records.find((r) => r.spool_ID === id)?.Dispatch_Stat === 5
        ? "A03"
        : records.find((r) => r.spool_ID === id)?.Dispatch_Stat === 6
        ? "A26"
        : "A27";

      axios.get("/api/logs", { params: { spoolId: id, transCode, limit: 1 } }).then((res) => {
        setLogs((prev) => ({ ...prev, [id]: res.data }));
      });
    });
  }, [records]);

  const formatTime = (datetime: string) => (datetime ? new Date(datetime).toLocaleTimeString("en-US", { hour12: true }) : "-");

  const renderRow = (rec: DispatchRecord, idx: number) => {
    const log = logs[rec.spool_ID]?.[0];

    const getStatusAndRemarks = () => {
      switch (rec.Dispatch_Stat) {
        case 2:
          return { status: "Pending", started: "-", finished: "-", remarks: "-" };
        case 3:
          return { status: "Repaired", started: formatTime(rec.time_started), finished: formatTime(rec.time_finished), remarks: "-" };
        case 4:
          return { status: "Scheduled", started: "-", finished: "-", remarks: "-" };
        case 5:
          return { status: "Turned-over", started: "-", finished: "-", remarks: log ? `${log.remarks} - ${formatTime(log.Trans_datetime)}` : "-" };
        case 6:
          return { status: "After The Meter", started: "-", finished: "-", remarks: log ? `${log.remarks} - ${formatTime(log.Trans_datetime)}` : "-" };
        case 7:
          return { status: "Leak Not Found", started: "-", finished: formatTime(rec.time_finished), remarks: log ? `${log.remarks} - ${formatTime(log.Trans_datetime)}` : "-" };
        default:
          return { status: "-", started: "-", finished: "-", remarks: "-" };
      }
    };

    const { status, started, finished, remarks } = getStatusAndRemarks();

    return (
      <tr key={rec.dispatch_ID}>
        <td>{idx + 1}</td>
        <td>{rec.dispatch_ID}</td>
        <td>{rec.C_Address}</td>
        <td>{rec.LeakType}</td>
        <td>{formatTime(rec.DT_Reported)}</td>
        <td>{formatTime(rec.dispatch_time)}</td>
        <td>{started}</td>
        <td>{finished}</td>
        <td>{status}</td>
        <td>{remarks}</td>
      </tr>
    );
  };

  return (
    <div className="container">
      <div className="header">
        <b>Republic of the Philippines</b>
        <br />
        <b style={{ fontSize: 18 }}>DAVAO CITY WATER DISTRICT</b>
        <br />
        Km. 2.5, MacArthur Highway, Matina, Davao City
        <br />
        Telephone No. (+63)(82) 235-3293 connecting to all departments
        <br />
        Website: www.davao-water.gov.ph
        <br />
      </div>

      <div style={{ textAlign: "center", margin: "20px 0", fontSize: 18 }}>
        <u>DAILY ACCOMPLISHMENT REPORT</u>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr>
            <th rowSpan={2}>No.</th>
            <th rowSpan={2}>JMS Control No.</th>
            <th rowSpan={2}>Particulars</th>
            <th rowSpan={2}>Kind of Complaint</th>
            <th colSpan={4}>Time</th>
            <th rowSpan={2}>Status</th>
            <th rowSpan={2}>Remarks</th>
          </tr>
          <tr>
            <th>Received</th>
            <th>Responded</th>
            <th>Started</th>
            <th>Finished</th>
          </tr>
        </thead>
        <tbody>{records.map(renderRow)}</tbody>
      </table>

      <div className="footer" style={{ marginTop: 30, display: "flex", justifyContent: "space-around" }}>
        <div className="signatories">
          Prepared by:<br />
          <b><u>{teamLeader}</u></b><br />
          Team Leader
        </div>
       
      </div>
    </div>
  );
};

export default DailyAccomplishmentReport;
