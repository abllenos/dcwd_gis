

import React, { useMemo } from "react";
import { Table, Input, Spin, Alert, Card, Typography, Space, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import { apiGis } from "./endpoints/Interceptor";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import IsolationValveDetailsModal from './modal/IsolationValveDetailsModal';
import IsolationValveEditModal from './modal/IsolationValveEditModal';
import type { IsolationValve } from './types/isolationValve';
import { observer } from 'mobx-react-lite';
import { isolationValveStore } from '../stores/isolationValveStore';

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

    const pagination: TablePaginationConfig = {
        current: 1,
        pageSize: isolationValveStore.pageSize,
    };

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

    // State for modals and selected record now in MobX store

    const columns: ColumnsType<IsolationValve> = [
        {
            title: "ID",
            key: "index",
            render: (_text, _record, index) =>
                ((pagination.current || 1) - 1) * (pagination.pageSize || 10) + index + 1,
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
            <div style={{ padding: 24, background: 'var(--bg-secondary, #f7f9fc)', minHeight: '100vh' }}>
                <div style={{ background: '#e9edfa', borderRadius: '12px 12px 0 0', padding: '18px 32px 12px 32px', marginBottom: 0 }}>
                    <span style={{ color: '#3a5fc8', fontWeight: 600, fontSize: 22, letterSpacing: 0.2 }}>Isolation Valve - Maintenance</span>
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
                                placeholder="Search Isolation Valve"
                                value={isolationValveStore.search}
                                onChange={(e) => {
                                    isolationValveStore.setSearch(e.target.value);
                                }}
                                style={{ width: 300 }}
                            />
                        </Space>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        pagination={pagination}
                        rowKey={(record) => record.gvnumber + record.wonumber}
                        onRow={(record) => ({
                            onDoubleClick: () => {
                                isolationValveStore.setSelected(record);
                                isolationValveStore.setEditModalVisible(true);
                            }
                        })}
                    />
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
        );
});

export default IsolationValveList;
