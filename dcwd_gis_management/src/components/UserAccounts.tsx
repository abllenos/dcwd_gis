import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, Input, InputNumber, Select, Table, Typography, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { userAccountsStore, type UserAccountRecord } from '../stores/userAccountsStore';
import Footer from './layout/Footer';

const { Title, Text } = Typography;

const UserAccounts: React.FC = observer(() => {
	const store = userAccountsStore;

	useEffect(() => {
		// fetch latest accounts on mount (live API)
		store.refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const columns: ColumnsType<UserAccountRecord> = [
		{ title: 'ID', dataIndex: 'id', key: 'id', width: 60, sorter: (a, b) => a.id - b.id },
		{ title: 'Employee ID', dataIndex: 'employeeId', key: 'employeeId', width: 110, sorter: (a, b) => a.employeeId.localeCompare(b.employeeId) },
		{ title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
		{ title: 'Department', dataIndex: 'department', key: 'department', sorter: (a, b) => a.department.localeCompare(b.department) },
		{ title: 'AccessLevel', dataIndex: 'accessLevel', key: 'accessLevel' },
		{ title: 'Role', dataIndex: 'role', key: 'role', width: 120, sorter: (a, b) => a.role.localeCompare(b.role) }
	];

	const total = store.totalCount;
	const totalPages = store.totalPages;
	const windowSize = 2;
	const maxVisiblePages = 5;
	const pages: Array<number | '…'> = [];
	if (totalPages <= maxVisiblePages) {
		for (let p = 1; p <= totalPages; p++) pages.push(p);
	} else {
		const start = Math.max(1, store.currentPage - windowSize);
		const end = Math.min(totalPages, store.currentPage + windowSize);
		if (start > 1) pages.push(1);
		if (start > 2) pages.push('…');
		for (let p = start; p <= end; p++) pages.push(p);
		if (end < totalPages - 1) pages.push('…');
		if (end < totalPages) pages.push(totalPages);
	}
	const showingStart = total > 0 ? (store.currentPage - 1) * store.pageSize + 1 : 0;
	const showingEnd = total > 0 ? Math.min(store.currentPage * store.pageSize, total) : 0;
	const disableJump = totalPages <= 1 || total === 0;

		return (
			<div style={{ maxWidth: '100%', margin: '0 auto' }}>
				<Card
					style={{ boxShadow: '0 4px 18px rgba(0,0,0,0.06)', borderRadius: 12 }}
					styles={{ body: { padding: 20 } }}
				>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
						<Title level={5} style={{ margin: 0, color: 'var(--text-primary)' }}>User Accounts - Maintenance</Title>
					</div>

					<div style={{ background: 'var(--bg-tertiary, #f5f7fb)', padding: '8px 12px', borderRadius: 8, marginBottom: 18 }}>
						<Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Instructions:</Text>
						<Text style={{ fontSize: 12 }}>View-only mode. Use the search and pagination controls to navigate.</Text>
					</div>

					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
						<div className="license-display-controls">
							<span className="license-control-text">Display</span>
							<Select
								size="small"
								value={store.pageSize}
								style={{ width: 80 }}
								onChange={(v) => store.setPageSize(v)}
								options={[10,20,30,40,50].map(n => ({ label: n, value: n }))}
							/>
							<span className="license-control-text">records per page</span>
						</div>
						<div className="license-search-controls">
							<span className="license-control-text">Search:</span>
							<Input.Search
								size="small"
								allowClear
								placeholder=""
								value={store.search}
								onChange={e => store.setSearch(e.target.value)}
								enterButton
								style={{ width: 200 }}
							/>
						</div>
					</div>

					<Table
						size="small"
						rowKey="id"
						dataSource={store.paged}
						columns={columns}
						pagination={false}
						loading={store.loading}
						style={{ marginBottom: 16 }}
						scroll={{ x: 1100 }}
					/>

					<div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8 }}>
						<Text style={{ fontSize: 12 }}>Showing {showingStart} to {showingEnd} of {total} entries</Text>
						<Space>
							<Button size="small" disabled={store.currentPage === 1 || total === 0} onClick={() => store.setCurrentPage(store.currentPage - 1)}>Previous</Button>
							{pages.map((pageNum, idx) => (
								pageNum === '…'
									? <Button key={`ellipsis-${idx}`} size="small" disabled>...</Button>
									: (
										<Button
											key={pageNum}
											size="small"
											type={pageNum === store.currentPage ? 'primary' : 'default'}
											onClick={() => store.setCurrentPage(pageNum)}
										>
											{pageNum}
										</Button>
									)
							))}
							<Button size="small" disabled={store.currentPage >= totalPages || total === 0} onClick={() => store.setCurrentPage(store.currentPage + 1)}>Next</Button>
							<span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
								<Text style={{ fontSize: 12 }}>Jump to</Text>
								<InputNumber
									size="small"
									min={1}
									max={totalPages}
									value={store.pageJumpInput}
									onChange={(value) => store.setPageJumpInput(value)}
									onPressEnter={() => store.jumpToPage()}
									disabled={disableJump}
								/>
								<Button size="small" type="default" onClick={() => store.jumpToPage()} disabled={disableJump}>Go</Button>
							</span>
						</Space>
					</div>
				</Card>

				{/* Spacer to prevent content from going under fixed footer */}
				<div style={{ height: '80px' }} />
				<Footer />
			</div>
		);
});

export default UserAccounts;
