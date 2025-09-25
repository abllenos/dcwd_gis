
import React, { useEffect } from "react";
import { Table, Input, Spin, Alert, Breadcrumb } from "antd";
import { observer } from 'mobx-react-lite';
import { fireHydrantListStore } from '../stores/fireHydrantListStore';
import type { FireHydrant } from '../stores/fireHydrantListStore';
import { HomeOutlined } from "@ant-design/icons";
import Footer from './layout/Footer';
import { useQuery } from "@tanstack/react-query";
import { apiGis } from "./endpoints/Interceptor";
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
    ];


    if (loading) return <Spin size="large"/>;
    if (error)
        return <Alert message="Error" description={error.message || String(error)} type="error" showIcon />;

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item href="/">
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>Fire Hydrant</Breadcrumb.Item>
            </Breadcrumb>
            <Search
                placeholder="Search Fire Hydrant"
                value={searchText}
                onChange={(e) => {
                    setSearchText(e.target.value);
                    setPagination({ ...pagination, current: 1});
                }}
                style={{ width: 300, marginBottom: 20, marginTop: 20 }}
            />
                        <Table
                                dataSource={filteredData}
                                columns={columns}
                                rowKey="assetid"
                                pagination={{
                                    ...pagination,
                                    total: filteredData.length,
                                    onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                                }}
                        />
        </div>
    );
});

export default FireHydrantList;
