import React, { useMemo } from "react";
import { Table, Input, Spin, Alert, Card, Typography } from "antd";
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

    const { currentPage, pageSize, setCurrentPage } = isolationValveStore;

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

        // Manual pagination logic
        const totalItems = filteredData.length;
        const pageCount = Math.ceil(totalItems / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalItems);
        const paginatedData = filteredData.slice(startIndex, endIndex);

        const getPageNumbers = () => {
            const pages = [];
            const maxVisiblePages = 5;
            if (pageCount <= maxVisiblePages) {
                for (let i = 1; i <= pageCount; i++) pages.push(i);
            } else {
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);
                if (endPage - startPage < maxVisiblePages - 1) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }
                for (let i = startPage; i <= endPage; i++) pages.push(i);
            }
            return pages;
        };

    // State for modals and selected record now in MobX store

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
                    <div style={{ background: '#e9edfa', borderRadius: '12px 12px 0 0', padding: '18px 32px 12px 32px', marginBottom: 0 }}>
                        <span style={{ color: '#3a5fc8', fontWeight: 600, fontSize: 22, letterSpacing: 0.2 }}>Isolation Valve - Maintenance</span>
                    </div>
                    <Card style={{ borderRadius: '0 0 12px 12px', marginTop: 0 }}>
                        <div style={{ marginBottom: 4 }}>
                            <Title level={5} style={{ color: '#666', marginBottom: 8 }}>
                                Instructions:
                            </Title>
                            <Text style={{ color: '#999' }}>Instruction: Double Click row to edit Details.</Text>
                        </div>
                        {/* Search bar aligned right with matching icon */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{ marginRight: 8 }}>Search:</Text>
                            <Input.Search
                                placeholder="Search "
                                value={isolationValveStore.search}
                                onChange={(e) => {
                                    isolationValveStore.setSearch(e.target.value);
                                }}
                                style={{ width: 200 }}
                                size="small"
                                enterButton
                            />
                        </div>
                                                <Table
                                                        columns={columns}
                                                        dataSource={paginatedData}
                                                        pagination={false}
                                                        rowKey={(record) => record.gvnumber + record.wonumber}
                                                        onRow={(record) => ({
                                                                onDoubleClick: () => {
                                                                        isolationValveStore.setSelected(record);
                                                                        isolationValveStore.setEditModalVisible(true);
                                                                }
                                                        })}
                                                />
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, flexWrap: 'wrap', rowGap: 8 }}>
                                                    <span style={{ fontSize: 12 }}>
                                                        Showing {totalItems > 0 ? startIndex + 1 : 0} to {totalItems > 0 ? endIndex : 0} of {totalItems} entries
                                                    </span>
                                                    <div style={{ display: 'flex', gap: 4 }}>
                                                        <button
                                                            disabled={currentPage === 1}
                                                            style={{ padding: '2px 8px', borderRadius: 4, border: '1px solid #d9d9d9', background: currentPage === 1 ? '#f5f5f5' : '#fff', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                                                            onClick={() => setCurrentPage(currentPage - 1)}
                                                        >Previous</button>
                                                        {getPageNumbers().map(pageNum => (
                                                            <button
                                                                key={pageNum}
                                                                style={{ padding: '2px 8px', borderRadius: 4, border: '1px solid #d9d9d9', background: pageNum === currentPage ? '#2563eb' : '#fff', color: pageNum === currentPage ? '#fff' : '#222', fontWeight: pageNum === currentPage ? 600 : 400, cursor: 'pointer' }}
                                                                onClick={() => setCurrentPage(pageNum)}
                                                            >{pageNum}</button>
                                                        ))}
                                                        <button
                                                            disabled={currentPage === pageCount || pageCount === 0}
                                                            style={{ padding: '2px 8px', borderRadius: 4, border: '1px solid #d9d9d9', background: currentPage === pageCount || pageCount === 0 ? '#f5f5f5' : '#fff', cursor: currentPage === pageCount || pageCount === 0 ? 'not-allowed' : 'pointer' }}
                                                            onClick={() => setCurrentPage(currentPage + 1)}
                                                        >Next</button>
                                                    </div>
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
                        onUpdate={(values) => {
                            // handle update logic here
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
