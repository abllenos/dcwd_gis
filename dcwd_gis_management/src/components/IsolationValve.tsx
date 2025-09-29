

import React, { useState, useMemo } from "react";
import { Table, Input, Spin, Alert, Card, Typography, Space } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { apiGis } from "./endpoints/Interceptor";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import IsolationValveDetailsModal from './modal/IsolationValveDetailsModal';
import IsolationValveEditModal from './modal/IsolationValveEditModal';
import type { IsolationValve } from './types/isolationValve';

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

const IsolationValveList: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });

    const { data, isLoading, error } = useQuery<IsolationValve[]>({
        queryKey: ["isolationValveData"],
        queryFn: fetchIsolationValve,
    });

    const filteredData = useMemo(() => {
        if (!data) return [];
        const lowerValue = searchText.toLowerCase();
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
    }, [data, searchText]);

    // State for modals
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<IsolationValve | null>(null);

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
            render: (_: any, record: IsolationValve) => (
                <button
                    style={{ background: '#22c55e', border: 'none', borderRadius: 4, color: '#fff', padding: '4px 12px', cursor: 'pointer', fontWeight: 500 }}
                    onClick={() => {
                        setSelectedRecord(record);
                        setDetailsModalVisible(true);
                    }}
                >
                    View
                </button>
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
                    rowKey={(_record) => _record.gvnumber + _record.wonumber}
                    pagination={{
                        ...pagination,
                        total: filteredData.length,
                        onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                    }}
                    onRow={(record) => ({
                        onDoubleClick: () => {
                            setSelectedRecord(record);
                            setEditModalVisible(true);
                        },
                    })}
                />
                <IsolationValveDetailsModal
                    visible={detailsModalVisible}
                    record={selectedRecord}
                    onCancel={() => setDetailsModalVisible(false)}
                />
                <IsolationValveEditModal
                    visible={editModalVisible}
                    record={selectedRecord}
                    onCancel={() => setEditModalVisible(false)}
                    onUpdate={() => {
                        // handle update logic here
                        setEditModalVisible(false);
                    }}
                />
            </Card>
        </div>
    );
};

export default IsolationValveList;
