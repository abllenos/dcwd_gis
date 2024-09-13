import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Table, Select, Input, Typography } from 'antd';

const { Option } = Select;
const { Title } = Typography;

const RTAList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10); // Define page size here

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: 'array' });

      setSheets(wb.SheetNames);
      setSelectedSheet(wb.SheetNames[0]); 
      setWorkbook(wb);

      const firstSheet = wb.Sheets[wb.SheetNames[0]];
      const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
      const headers = sheetData[0].map((header: string) => ({
        title: header,
        dataIndex: header,
        key: header,
        width: 150
      }));

      setColumns(headers);
      setData(sheetData.slice(1).map((row, index) => {
        const rowData: { [key: string]: any } = {};
        headers.forEach((header, i) => {
          rowData[header.dataIndex] = row[i];
        });
        return rowData;
      }));
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSheetChange = (value: string) => {
    setSelectedSheet(value);

    if (workbook) {
      const sheet = workbook.Sheets[value];
      const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      const headers = sheetData[0].map((header: string) => ({
        title: header,
        dataIndex: header,
        key: header,
        width: 150
      }));

      setColumns(headers);
      setData(sheetData.slice(1).map((row, index) => {
        const rowData: { [key: string]: any } = {};
        headers.forEach((header, i) => {
          rowData[header.dataIndex] = row[i];
        });
        return rowData;
      }));
    }
  };

  return (
    <div>
      <Title level={2}>Upload Excel File</Title>
      <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} style={{ width: 300 }}/>

      {sheets.length > 0 && (
        <>
          <Title level={3}>Select Sheet</Title>
          <Select value={selectedSheet} onChange={handleSheetChange} style={{ width: 200 }}>
            {sheets.map((sheet, index) => (
              <Option key={index} value={sheet}>
                {sheet}
              </Option>
            ))}
          </Select>
        </>
      )}

      {data.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <Table 
            dataSource={data} 
            columns={columns} 
            pagination={{
              current: currentPage,
              pageSize,
              total: data.length,
              onChange: (page) => setCurrentPage(page),
            }}
            bordered
            scroll={{ x: 'max-content', y: 700 }}
            className="custom-table" 
          />
        </div>
      )}
    </div>
  );
};

export default RTAList;
