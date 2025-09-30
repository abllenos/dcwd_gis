import { Button } from 'antd';
import React, { useEffect } from "react";

import { Table, Input, Spin, Alert, Card, Typography, Space } from "antd";
const { Title, Text } = Typography;
import FireHydrantDetailsModal from './modal/FireHydrantDetailsModal';
import FireHydrantEditModal from './modal/FireHydrantEditModal';
import { observer } from 'mobx-react-lite';
import { fireHydrantListStore } from '../stores/fireHydrantListStore';
import type { FireHydrant } from '../stores/fireHydrantListStore';
import { HomeOutlined } from "@ant-design/icons";   
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";


const { Search } = Input;



const FireHydrantList: React.FC = observer(() => {
    const { searchText, pagination, setSearchText, setPagination, filteredData, loading, error } = fireHydrantListStore;

    useEffect(() => {
        fireHydrantListStore.fetchData();
    }, []);


    const columns: ColumnsType<FireHydrant> = [
        {
            title: "#",
            key: "index",
            render: (_text, _record, index) =>
            ((pagination.current || 1) - 1) * (pagination.pageSize || 10) + index + 1,
            width: 60,
        },
        { title: "Asset ID", dataIndex: "assetid", key: "assetid" },
        { title: "Location", dataIndex: "location", key: "location" },
        { title: "Barangay", dataIndex: "barangay", key: "barangay" },
        { title: "Size", dataIndex: "size", key: "size" },
        { title: "Type Description", dataIndex: "type_description", key: "type_description" },
        { title: "Remarks", dataIndex: "remarks", key: "remarks" },
        {
            title: '',
            key: 'actions',
            width: 80,
            render: (_: any, record: FireHydrant) => (
                <Button
                    style={{
                        background: '#18c964',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 24px',
                        fontWeight: 500,
                        boxShadow: '0 2px 8px rgba(24,201,100,0.08)',
                        display: 'block',
                        margin: '0 auto',
                    }}
                    onClick={() => {
                        fireHydrantListStore.setSelectedRecord(record);
                        fireHydrantListStore.setDetailsModalVisible(true);
                    }}
                >
                    View
                </Button>
            ),
        },
    ];


    if (loading) return <Spin size="large"/>;
    if (error)
        return <Alert message="Error" description={error.message || String(error)} type="error" showIcon />;

    return (
        <div style={{ padding: 24, background: 'var(--bg-secondary, #f7f9fc)', minHeight: '100vh' }}>
            <div style={{ background: '#e9edfa', borderRadius: '12px 12px 0 0', padding: '18px 32px 12px 32px', marginBottom: 0 }}>
                <span style={{ color: '#3a5fc8', fontWeight: 600, fontSize: 22, letterSpacing: 0.2 }}>Fire Hydrant - Maintenance</span>
            </div>
            <Card style={{ borderRadius: '0 0 12px 12px', marginTop: 0 }}>
                <div style={{ marginBottom: 24 }}>
                    <Title level={5} style={{ color: '#666', marginBottom: 8 }}>
                        Instructions:
                    </Title>
                    <Text style={{ color: '#999' }}>Instruction: Double Click row to edit Details.</Text>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Space>
                        <Text>Search:</Text>
                        <Input.Search
                            placeholder="Search Fire Hydrant"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setPagination({ ...pagination, current: 1 });
                            }}
                            style={{ width: 300 }}
                        />
                    </Space>
                </div>

                <Table
                    dataSource={filteredData}
                    columns={columns}
                    rowKey="assetid"
                    pagination={{
                        ...pagination,
                        total: filteredData.length,
                        onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                    }}
                    onRow={(record) => ({
                        onDoubleClick: () => {
                            fireHydrantListStore.setSelectedRecord(record);
                            fireHydrantListStore.setEditModalVisible(true);
                        },
                    })}
                />
                <FireHydrantDetailsModal
                    visible={fireHydrantListStore.detailsModalVisible}
                    record={fireHydrantListStore.selectedRecord}
                    onCancel={() => fireHydrantListStore.setDetailsModalVisible(false)}
                />
                <FireHydrantEditModal
                    visible={fireHydrantListStore.editModalVisible}
                    record={fireHydrantListStore.selectedRecord}
                    onCancel={() => fireHydrantListStore.setEditModalVisible(false)}
                    onUpdate={(updated) => {
                        fireHydrantListStore.updateRecord(updated);
                        fireHydrantListStore.setEditModalVisible(false);
                    }}
                />
            </Card>
        </div>
    );
});

export default FireHydrantList;