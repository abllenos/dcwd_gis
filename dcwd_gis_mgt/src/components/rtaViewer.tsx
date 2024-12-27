import React, { useEffect, useState } from 'react';
import { Select, Table, Spin, Alert } from 'antd';

interface TableData {
  [key: string]: any;
}

const TableList: React.FC = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loadingTables, setLoadingTables] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTables = async () => {
    setLoadingTables(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8012/web/dcwdgismgt/home/ajax/query/getTables.php');
      const data = await response.json();

      if (response.ok) {
        if (Array.isArray(data)) {
          setTables(data);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('Unexpected API response format.');
        }
      } else {
        setError(`API Error: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError('Failed to fetch tables.');
    } finally {
      setLoadingTables(false);
    }
  };

  const fetchTableData = async (tableName: string) => {
    setLoadingData(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8012/web/dcwdgismgt/home/ajax/query/getTableData.php?table=${tableName}`);
      const data = await response.json();

      if (response.ok) {
        if (Array.isArray(data)) {
          setTableData(data);
          setColumns(
            Object.keys(data[0]).map((key) => ({
              title: key,
              dataIndex: key,
              key,
              ellipsis: true, 
            }))
          );
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('Unexpected API response format.');
        }
      } else {
        setError(`API Error: ${response.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching table data:', err);
      setError('Failed to fetch table data.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleTableSelect = (value: string) => {
    setSelectedTable(value);
    fetchTableData(value);
  };

  return (
    <div>
      <h2>Database Tables</h2>
      {loadingTables ? (
        <Spin />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <Select
          style={{ width: 300, marginBottom: 20 }}
          placeholder="Select a Table"
          onChange={handleTableSelect}
          options={tables.map((table) => ({ value: table, label: table }))}
        />
      )}

      {selectedTable && (
        <div>
          <h3>Table: {selectedTable}</h3>
          {loadingData ? (
            <Spin />
          ) : error ? (
            <Alert message="Error" description={error} type="error" showIcon />
          ) : (
            <Table
              dataSource={tableData}
              columns={columns}
              rowKey={(record) => Object.values(record).join('-')}
              pagination={{ pageSize: 15 }}
              scroll={{ x: 'max-content' }} 
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TableList;
