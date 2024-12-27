import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Table, Select, Input, Typography, Button, message } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { Title } = Typography;

const RTAList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

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
        width: 150,
      }));
  
      setColumns(headers);
      setData(sheetData.slice(1).map((row, rowIndex) => {
        const rowData: { [key: string]: any } = {};
        headers.forEach((header, i) => {
          rowData[header.dataIndex] = row[i];
        });
        rowData.key = `row-${rowIndex}`; 
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
        width: 150,
      }));

      setColumns(headers);
      setData(sheetData.slice(1).map((row) => {
        const rowData: { [key: string]: any } = {};
        headers.forEach((header, i) => {
          rowData[header.dataIndex] = row[i];
        });
        return rowData;
      }));
    }
  };

  const handleUploadToDB = async () => {
    if (!selectedSheet || data.length === 0) {
      message.error('Please select a sheet and ensure data is loaded.');
      return;
    }
  
    const tableName = selectedSheet; 
    const columnNames = columns.map((col) => col.dataIndex);
    const rowData = data.map((row) => columnNames.map((col) => row[col]));
  
    try {
      const response = await axios.post('http://localhost:8012/web/dcwdgismgt/home/ajax/query/uploadRta.php', {
        sheetName: tableName, 
        headers: columnNames, 
        data: rowData, 
      });
  
      if (response.data.status === 'success') {
        message.success('Data uploaded successfully!');
      } else {
        message.error(response.data.message || 'Failed to upload data.');
      }
    } catch (error) {
      message.error('Error uploading data to the database.');
      console.error(error);
    }
  };

  return (
    <div>
      <Title level={2}>Upload Excel File</Title>
      <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} style={{ width: 300 }} />

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
          <Button type="primary" onClick={handleUploadToDB} style={{ marginTop: 20 }}>
            Upload to Database
          </Button>
        </div>
      )}
    </div>
  );
};

export default RTAList;
