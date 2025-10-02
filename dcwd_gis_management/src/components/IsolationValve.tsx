import React, { useState, useMemo } from "react";
import { Table, Input, Spin, Alert, Card, Typography, Space } from "antd";

import { useQuery } from "@tanstack/react-query";
import { apiGis } from "./endpoints/Interceptor";
import type { ColumnsType } from "antd/es/table";
import IsolationValveDetailsModal from './modal/IsolationValveDetailsModal';
import IsolationValveEditModal from './modal/IsolationValveEditModal';
import type { IsolationValve } from './types/isolationValve';
import { observer } from 'mobx-react-lite';
import { isolationValveStore } from '../stores/isolationValveStore';
import Footer from './layout/Footer';

const { Title, Text } = Typography;

const fetchIsolationValve = async (): Promise<IsolationValve[]> => {
    const res = await apiGis.get("helpers/gis/mgtsys/getLayers/getIsolation.php");
    const arr = Array.isArray(res.data.data) ? res.data.data : [];
    // Map to IsolationValve interface shape
    return arr.map((item: any) => ({
        gvnumber: item.gvnumber || item.gv_number || item.gv_no || '',
        wonumber: item.wonumber || item.wo_number || item.wo_no || '',
        location: item.location || '',
        size: item.size || 0,
        noofturns: item.noofturns || item.no_of_turns || 0,
        depth: item.depth || 0,
        brand: item.brand || '',
        valve: item.valve || '',
        project_title: item.project_title || '',
        barangay: item.barangay || '',
    }));
};

const IsolationValveList: React.FC = observer(() => {
    const { data, isLoading, error } = useQuery<IsolationValve[]>({
        queryKey: ["isolationValveData"],
        queryFn: fetchIsolationValve,
    });

    const { currentPage, pageSize } = isolationValveStore;

        const filteredData = useMemo(() => {
                if (!data) return [];
                const lowerValue = isolationValveStore.search.toLowerCase();
                return data.filter((isolation) =>
                        (isolation.gvnumber?.toLowerCase() ?? "").includes(lowerValue) ||
                        (isolation.wonumber?.toLowerCase() ?? "").includes(lowerValue) ||
                        (isolation.location?.toLowerCase() ?? "").includes(lowerValue) ||
                        (isolation.size?.toString() ?? "").includes(lowerValue) ||
                        (isolation.noofturns?.toString() ?? "").includes(lowerValue) ||
                        (isolation.depth?.toString() ?? "").includes(lowerValue) ||
                        (isolation.brand?.toLowerCase() ?? "").includes(lowerValue) ||
                        (isolation.valve?.toLowerCase() ?? "").includes(lowerValue) ||
                        (isolation.project_title?.toLowerCase() ?? "").includes(lowerValue) ||
                        (isolation.barangay?.toLowerCase() ?? "").includes(lowerValue)
                );
        }, [data, isolationValveStore.search]);

    // Pagination helpers (License.tsx style)
    const handlePageSizeChange = (value: string) => {
        const newPageSize = parseInt(value);
        const newTotalPages = Math.ceil(filteredData.length / newPageSize);
        isolationValveStore.setPageSize(newPageSize);
        // Adjust current page if it would be out of bounds with the new page size
        if (currentPage > newTotalPages && newTotalPages > 0) {
            isolationValveStore.setCurrentPage(newTotalPages);
        } else if (newTotalPages === 0) {
            isolationValveStore.setCurrentPage(1);
        }
    };

    const handlePageChange = (page: number) => {
        const totalPages = Math.ceil(filteredData.length / isolationValveStore.pageSize);
        // Ensure page is within valid bounds
        if (page >= 1 && page <= totalPages) {
            isolationValveStore.setCurrentPage(page);
        }
    };

    const handleSearch = (value: string) => {
        isolationValveStore.setSearch(value);
        isolationValveStore.setCurrentPage(1); // Reset to first page when searching
    };

    // Simple pagination logic (License.tsx style)
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / isolationValveStore.pageSize);
    const startIndex = (isolationValveStore.currentPage - 1) * isolationValveStore.pageSize;
    const endIndex = Math.min(startIndex + isolationValveStore.pageSize, totalItems);
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Generate page numbers for pagination (License.tsx style)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        const currentPage = isolationValveStore.currentPage;
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
    };    // State for modals and selected record now in MobX store

    const columns: ColumnsType<IsolationValve> = [
        {
            title: "ID",
            key: "index",
            render: (_text, _record, index) => (currentPage - 1) * pageSize + index + 1,
            width: 60,
        },
        { title: "GV Number", dataIndex: "gvnumber", key: "gvnumber" },
        { title: "Type", dataIndex: "valve", key: "valve" },
        { title: "Status", dataIndex: "brand", key: "brand" },
        { title: "Location", dataIndex: "location", key: "location" },
        {
            title: '',
            key: 'actions',
            width: 80,
            align: 'center' as const,
            render: (_text, record) => (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button
                        className="license-table-action-button"
                        onClick={() => {
                            isolationValveStore.setSelected(record);
                            isolationValveStore.setModalVisible(true);
                        }}
                        title="View Details"
                    >
                    </button>
                </div>
            ),
        },
    ];

    if (isLoading) return <Spin size="large"/>;
    if (error instanceof Error) return <Alert message="Error" description={error.message} type="error" showIcon/>;

        return (
                <>
                    <div style={{ padding: 24, background: 'var(--bg-secondary, #f7f9fc)', minHeight: '100vh' }}>
                        <Card style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
                            <div style={{ background: '#e9edfa', borderRadius: 8, padding: '18px 32px 12px 32px', marginBottom: 24 }}>
                                <span style={{ color: '#3a5fc8', fontWeight: 600, fontSize: 22, letterSpacing: 0.2 }}>Isolation Valve - Maintenance</span>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <Text strong>Instructions:</Text>
                                <div style={{ marginLeft: 12, marginTop: 2 }}>
                                    <Text>Instruction: Double Click row to edit Details.</Text>
                                </div>
                            </div>
                            <div className="license-controls-container">
                                <div className="license-display-controls">
                                    <Text className="license-control-text">Display</Text>
                                    <Select
                                        value={isolationValveStore.pageSize.toString()}
                                        onChange={handlePageSizeChange}
                                        size="small"
                                        style={{ width: 80 }}
                                        options={[
                                            { value: '10', label: '10' },
                                            { value: '25', label: '25' },
                                            { value: '50', label: '50' },
                                            { value: '100', label: '100' }
                                        ]}
                                    />
                                    <Text className="license-control-text">records per page</Text>
                                </div>
                                <div className="license-search-controls">
                                    <Text className="license-control-text">Search:</Text>
                                    <Input.Search
                                        size="small"
                                        placeholder=""
                                        style={{ width: 200 }}
                                        enterButton
                                        onSearch={handleSearch}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Table
                                key={`isolation-table-page-${isolationValveStore.currentPage}-size-${isolationValveStore.pageSize}`}
                                bordered
                                rowKey={record => `isolation-${record.gvnumber}-${record.wonumber}-${record.location}`}
                                columns={columns}
                                dataSource={paginatedData}
                                pagination={false}
                                style={{ background: '#fff', borderRadius: 8 }}
                                onRow={record => ({
                                    onDoubleClick: () => {
                                        isolationValveStore.setSelected(record);
                                        isolationValveStore.setEditModalVisible(true);
                                    }
                                })}
                            />
                            {/* Pagination (License.tsx style) */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8, marginTop: 16 }}>
                                <Text style={{ fontSize: 12 }}>
                                    Showing {totalItems > 0 ? startIndex + 1 : 0} to {totalItems > 0 ? endIndex : 0} of {totalItems} entries
                                    {isolationValveStore.search && ` (filtered from ${data?.length || 0} total entries)`}
                                </Text>
                                <Space>
                                    <Button size="small" disabled={isolationValveStore.currentPage === 1 || totalItems === 0} onClick={() => handlePageChange(isolationValveStore.currentPage - 1)}>Previous</Button>
                                    {totalItems > 0 ? getPageNumbers().map(pageNum => (
                                        <Button 
                                            key={pageNum} 
                                            size="small" 
                                            type={pageNum === isolationValveStore.currentPage ? 'primary' : 'default'} 
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </Button>
                                    )) : (
                                        <Button size="small" disabled>1</Button>
                                    )}
                                    <Button size="small" disabled={isolationValveStore.currentPage === totalPages || totalPages === 0 || totalItems === 0} onClick={() => handlePageChange(isolationValveStore.currentPage + 1)}>Next</Button>
                                </Space>
                            </div>
                        </Card>
                        {/* Modals */}
                        <IsolationValveDetailsModal
                            visible={isolationValveStore.modalVisible}
                            record={isolationValveStore.selected}
                            onCancel={() => isolationValveStore.setModalVisible(false)}
                        />
                        <IsolationValveEditModal
                            visible={isolationValveStore.editModalVisible}
                            record={isolationValveStore.selected}
                            onCancel={() => isolationValveStore.setEditModalVisible(false)}
                            onUpdate={values => {
                                isolationValveStore.setSelected({ ...isolationValveStore.selected, ...values });
                                isolationValveStore.setEditModalVisible(false);
                            }}
                        />
                    </div>
                    <Footer />
                </>
        );
});

export default IsolationValveList;
