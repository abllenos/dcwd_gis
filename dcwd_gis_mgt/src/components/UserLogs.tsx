import React, { useEffect, useState } from 'react';
import { Table, Breadcrumb, Spin, Alert, Select, Input, Modal } from 'antd'; 
import { ColumnsType } from 'antd/es/table';
import { HomeOutlined } from '@ant-design/icons';
import { fetchLogs } from './endpoints/Logs';
import { fetchGeometry } from './endpoints/Logs';
import MapComponent from './mapView';


interface Log {
  ID: string;
  layerid: number;
  assetid: string;
  modified_by: string;
  access_flg: string;
  transaction_datetime: string;
  description: string | null;
}

interface LayerOption {
  value: number;
  label: string;
}

type SearchField = keyof Log;

const UserLogs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLayerID, setSelectedLayerID] = useState<string | null>(null);
  const [layerOptions, setLayerOptions] = useState<LayerOption[]>([]);
  const [searchField, setSearchField] = useState<SearchField>('ID');
  const [searchValue, setSearchValue] = useState<string>('');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [geometry, setGeometryData] = useState<any>(null);
  const [isLoadingGeometry, setIsLoadingGeometry] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lng: number; lat: number } | null>(null);

  useEffect(() => {
    const fetchLayerOptions = async () => {
      const options: LayerOption[] = [
        { value: 1, label: 'PMS' },
        { value: 2, label: 'UNIVERSAL' },
        { value: 3, label: 'AIR RELEASE VALVE' },
        { value: 4, label: 'FIRE HYDRANT' },
        { value: 5, label: 'ISOLATION VALVE' },
        { value: 6, label: 'BLOW-OFF VALVE' },
        { value: 7, label: 'PRESSURE RELEASE VALVE' },
        { value: 8, label: 'PRESSURE SETTING VALVE' },
        { value: 9, label: 'REDUCER' },
        { value: 10, label: 'CUSTOMER' },
        { value: 11, label: 'BRGY BOUNDARY' },
        { value: 12, label: 'PARCEL' },
        { value: 13, label: 'ROAD' },
        { value: 14, label: 'STREET' },
        { value: 15, label: 'SUBDIVISION' },
        { value: 16, label: 'SUBDIVISION BLOCK' },
        { value: 17, label: 'SUBDIVISION BOUNDARY' },
        { value: 18, label: 'BUILDING FOOTPRINT' },
        { value: 19, label: 'CARETAKER BOUNDARY' },
        { value: 20, label: 'PIPE SYSTEM' },
        { value: 21, label: 'LOGGER NOISE' },
        { value: 22, label: 'DMA BOUNDARY' },
        { value: 23, label: 'CSR PROJECT' },
        { value: 24, label: 'CSR SCHOOL' },
        { value: 25, label: 'DATA PMS MAINTENANCE' },
        { value: 26, label: 'WSS BOUNDARY' },
        { value: 27, label: 'PRODUCTION WELLS' },
        { value: 28, label: 'PIPE BRIDGE CROSSING' },
        { value: 29, label: 'MOD ZONING' },
        { value: 30, label: 'SERVICE LINE' },
      ];
      setLayerOptions(options);
    };

    fetchLayerOptions();
  }, []);

  useEffect(() => {
    const fetchLogsData = async () => {
      if (!selectedLayerID) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetchLogs(selectedLayerID);
        console.log('API response:', response);

        if (response && response.success) {
          const sortedLogs = response.data.sort((a: Log, b: Log) =>
            new Date(b.transaction_datetime).getTime() - new Date(a.transaction_datetime).getTime()
          );
          setLogs(sortedLogs);
          setFilteredLogs(sortedLogs);
        } else {
          const errorMsg = response ? response.message || 'Unknown error' : 'No response received';
          setError('Failed to fetch data: ' + errorMsg);
        }
      } catch (err) {
        console.error('Fetching error:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchLogsData();
  }, [selectedLayerID]);

  useEffect(() => {
    const filtered = logs.filter(log => {
      const value = log[searchField] as unknown as string;
      return value.toLowerCase().includes(searchValue.toLowerCase());
    });
    setFilteredLogs(filtered);
  }, [searchField, searchValue, logs]);

  const handleRowClick = async (record: Log) => {
    setSelectedLog(record);
    setIsModalVisible(true);
    setIsLoadingGeometry(true);
  
    try {
      const geometryResponse = await fetchGeometry(record.ID, record.layerid, record.assetid);
      console.log('Geometry Response:', geometryResponse);
  
      if (geometryResponse && geometryResponse.success) {
        if (geometryResponse.coordinates && geometryResponse.coordinates.length > 0) {
          let formattedCoordinates: { lng: number; lat: number }[] = [];
  
          if (geometryResponse.coordinates.length === 2) {
            const [lng, lat] = geometryResponse.coordinates;
            formattedCoordinates.push({ lng, lat });
          } else if (Array.isArray(geometryResponse.coordinates[0][0])) {
            formattedCoordinates = geometryResponse.coordinates.flatMap((coordSet: number[][]) =>
              coordSet.map((coord: number[]) => ({
                lng: coord[0],
                lat: coord[1],
              }))
            );
          } else if (Array.isArray(geometryResponse.coordinates[0])) {
            formattedCoordinates = geometryResponse.coordinates.map((coord: number[]) => ({
              lng: coord[0],
              lat: coord[1],
            }));
          }
  
          setGeometryData({ coordinates: formattedCoordinates });
  
          if (
            formattedCoordinates.length > 0 &&
            !isNaN(formattedCoordinates[0].lat) &&
            !isNaN(formattedCoordinates[0].lng)
          ) {
            setMapCenter(formattedCoordinates[0]);
          } else {
            setMapCenter({ lat: 7.0819, lng: 125.5105 }); 
          }
        } else {
          setGeometryData(null);
          console.warn('No coordinates found in the geometry response.');
        }
      } else {
        setGeometryData(null);
        console.error('Error fetching geometry:', geometryResponse.message || 'Data not found');
      }
    } catch (error) {
      setGeometryData(null);
      console.error('Error fetching geometry:', error);
    } finally {
      setIsLoadingGeometry(false);
    }
  };
  
    const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedLog(null);
    setGeometryData(null); 
  };

  const columns: ColumnsType<Log> = [
    { title: 'ID', dataIndex: 'ID', key: 'ID' },
    { title: 'Layer ID', dataIndex: 'layerid', key: 'layerid' },
    { title: 'Asset ID', dataIndex: 'assetid', key: 'assetid' },
    { title: 'Modified By', dataIndex: 'modified_by', key: 'modified_by' },
    { title: 'Transaction Type', dataIndex: 'access_flg', key: 'access_flg', render: (value: string) => (value === '1' ? 'Geometry Alteration' : value === '2' ? 'Data Alteration' : value) },
    { title: 'Transaction DateTime', dataIndex: 'transaction_datetime', key: 'transaction_datetime' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
  ];

  return (
    <div>
      <Breadcrumb style={{ margin: '20px 20px 20px 40px' }}>
        <Breadcrumb.Item href="/Dashboard">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span>Management</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Logs</Breadcrumb.Item>
      </Breadcrumb>

      <Select
        style={{ width: 200, margin: '20px' }}
        placeholder="Select a Layer ID"
        onChange={setSelectedLayerID}
        options={layerOptions}
      />

      <Select
        style={{ width: 200, margin: '20px' }}
        placeholder="Select Search Field"
        value={searchField}
        onChange={setSearchField}
        options={[
          { value: 'ID', label: 'ID' },
          { value: 'assetid', label: 'Asset ID' },
          { value: 'modified_by', label: 'Modified By' },
          { value: 'access_flg', label: 'Access Flag' },
        ]}
      />

      <Input
        style={{ width: 300, margin: '20px' }}
        placeholder={`Search by ${searchField}`}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      {loading ? (
        <Spin size="large" style={{ margin: '20px 20px 20px 20px' }} />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon style={{ margin: '20px 20px 20px 20px' }} />
      ) : (
        <Table
          style={{ margin: '20px 20px 20px 20px' }}
          columns={columns}
          dataSource={filteredLogs}
          rowKey="ID"
          pagination={{
            pageSize: 15,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} items`,
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      )}

      <Modal
        title="Log Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        {selectedLog && (
          <div>
            <p><strong>ID:</strong> {selectedLog.ID}</p>
            <p><strong>Layer ID:</strong> {selectedLog.layerid}</p>
            <p><strong>Asset ID:</strong> {selectedLog.assetid}</p>
            <p><strong>Modified By:</strong> {selectedLog.modified_by}</p>
            <p><strong>Transaction Type:</strong> {selectedLog.access_flg}</p>
            <p><strong>Transaction DateTime:</strong> {selectedLog.transaction_datetime}</p>
            <p><strong>Description:</strong> {selectedLog.description}</p>

            {geometry && geometry.coordinates && geometry.coordinates.length > 0 && mapCenter && !isNaN(mapCenter.lat) && !isNaN(mapCenter.lng) && (
              <MapComponent geometry={geometry} center={mapCenter} />
            )}
           
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserLogs;
