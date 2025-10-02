import React, { useEffect } from "react";

import { Table, Input, Spin, Alert, Card, Typography, Button, Space } from "antd";
const { Title, Text } = Typography;
import FireHydrantDetailsModal from './modal/FireHydrantDetailsModal';
import FireHydrantEditModal from './modal/FireHydrantEditModal';
import { observer } from 'mobx-react-lite';
import { fireHydrantListStore } from '../stores/fireHydrantListStore';
import type { FireHydrant } from '../stores/fireHydrantListStore';

import { HomeOutlined } from "@ant-design/icons";   
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import Footer from './layout/Footer';


const { Search } = Input;




const FireHydrantList: React.FC = observer(() => {
    const { searchText, filteredData, loading, error, currentPage, pageSize, setSearchText, setCurrentPage, setPageSize } = fireHydrantListStore;

    useEffect(() => {
        fireHydrantListStore.fetchData();
    }, []);

    const handlePageChange = (page: number) => {
        fireHydrantListStore.setCurrentPage(page);
    };

    // Simple pagination logic
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedUsers = filteredData.slice(startIndex, endIndex);

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }
        return pages;
    };

    const columns: ColumnsType<FireHydrant> = [
        {
            title: "#",
            key: "index",
            render: (_text, _record, index) => (currentPage - 1) * pageSize + index + 1,
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
            align: 'center' as const,
            render: (_: any, record: FireHydrant) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button
                        className="license-table-action-button"
                        onClick={() => {
                            fireHydrantListStore.setSelectedRecord(record);
                            fireHydrantListStore.setDetailsModalVisible(true);
                        }}
                        title="View Details"
                    >
                    </button>
                </div>
            ),
        },
    ];


    if (loading) return <Spin size="large"/>;
    if (error)
        return <Alert message="Error" description={error.message || String(error)} type="error" showIcon />;



        return (
            <>
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

                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16, gap: 8 }}>
                            <span>Search:</span>
                            <Input.Search
                                placeholder="Search..."
                                size="small"
                                allowClear
                                enterButton
                                value={searchText}
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                    setCurrentPage(1);
                                }}
                                style={{ width: 200 }}
                            />
                        </div>

                        <Table
                            key={`page-${currentPage}`}
                            dataSource={paginatedUsers}
                            columns={columns}
                            rowKey={(record, index) => record.assetid || `fire-hydrant-${index}`}
                            pagination={false}
                            onRow={(record) => ({
                                onDoubleClick: () => {
                                    fireHydrantListStore.setSelectedRecord(record);
                                    fireHydrantListStore.setEditModalVisible(true);
                                },
                            })}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8, marginTop: 16 }}>
                            <span style={{ fontSize: 12 }}>
                                Showing {totalItems > 0 ? startIndex + 1 : 0} to {totalItems > 0 ? endIndex : 0} of {totalItems} entries
                            </span>
                            <Space>
                                <Button size="small" disabled={currentPage === 1 || totalItems === 0} onClick={() => handlePageChange(currentPage - 1)}>Previous</Button>
                                {totalItems > 0 ? getPageNumbers().map(pageNum => (
                                    <Button 
                                        key={pageNum} 
                                        size="small" 
                                        type={pageNum === currentPage ? 'primary' : 'default'} 
                                        onClick={() => handlePageChange(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                )) : (
                                    <Button size="small" disabled>1</Button>
                                )}
                                <Button size="small" disabled={currentPage === totalPages || totalPages === 0 || totalItems === 0} onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
                            </Space>
                        </div>
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
                <Footer />
            </>
        );
});

export default FireHydrantList;