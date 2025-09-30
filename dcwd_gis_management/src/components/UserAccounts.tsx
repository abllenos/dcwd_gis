import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, Input, Modal, Select, Table, Typography, Space, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { userAccountsStore } from '../stores/userAccountsStore';
import type { UserAccountRecord } from '../stores/userAccountsStore';
import Footer from './layout/Footer';

const { Title, Text } = Typography;

const UserAccounts: React.FC = observer(() => {
	const store = userAccountsStore;

	const columns = [
		{ title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
		{ title: 'Employee ID', dataIndex: 'employeeId', key: 'employeeId', width: 110 },
		{ title: 'Name', dataIndex: 'name', key: 'name' },
		{ title: 'Department', dataIndex: 'department', key: 'department' },
		{ title: 'AccessLevel', dataIndex: 'accessLevel', key: 'accessLevel' },
		{ title: 'Role', dataIndex: 'role', key: 'role', width: 120 },
		{ title: ' ', key: 'actions', width: 80, align: 'center' as const, render: (_: unknown, record: UserAccountRecord) => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button
          className="license-table-action-button"
          onClick={() => store.openEdit(record)}
          title="View Details"
        >
        </button>
      </div>
    ) }
	];

	return (
		<div style={{ maxWidth: '100%', margin: '0 auto' }}>
			<Card
        style={{ boxShadow: '0 4px 18px rgba(0,0,0,0.06)', borderRadius: 12 }}
        styles={{ body: { padding: 20 } }}
      >
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
					<Title level={5} style={{ margin: 0, color: 'var(--text-primary)' }}>User Accounts - Maintenance</Title>
					<Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => store.openAdd()}>
						Add User
					</Button>
				</div>

				<div style={{ background: 'var(--bg-tertiary, #f5f7fb)', padding: '8px 12px', borderRadius: 8, marginBottom: 18 }}>
					<Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Instructions:</Text>
					<Text style={{ fontSize: 12 }}>Instruction: Double Click row to edit Account Details.</Text>
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
					columns={columns as any}
					pagination={false}
					loading={store.loading}
					onRow={(record) => ({ onDoubleClick: () => store.openEdit(record) })}
					style={{ marginBottom: 16 }}
					scroll={{ x: 1100 }}
				/>

				<div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 8 }}>
					<Text style={{ fontSize: 12 }}>Showing {(store.currentPage - 1) * store.pageSize + 1} to {Math.min(store.currentPage * store.pageSize, store.totalCount)} of {store.totalCount} entries</Text>
					<Space>
						<Button size="small" disabled={store.currentPage === 1} onClick={() => store.setCurrentPage(store.currentPage - 1)}>Previous</Button>
						{Array.from({ length: Math.ceil(store.totalCount / store.pageSize) }).slice(0,5).map((_, i) => {
							const page = i + 1;
							return <Button key={page} size="small" type={page === store.currentPage ? 'primary' : 'default'} onClick={() => store.setCurrentPage(page)}>{page}</Button>;
						})}
						{Math.ceil(store.totalCount / store.pageSize) > 5 && <Button size="small" disabled>...</Button>}
						{Math.ceil(store.totalCount / store.pageSize) > 5 && (
							<Button size="small" type={store.currentPage === Math.ceil(store.totalCount / store.pageSize) ? 'primary' : 'default'} onClick={() => store.setCurrentPage(Math.ceil(store.totalCount / store.pageSize))}>{Math.ceil(store.totalCount / store.pageSize)}</Button>
						)}
						<Button size="small" disabled={store.currentPage >= Math.ceil(store.totalCount / store.pageSize)} onClick={() => store.setCurrentPage(store.currentPage + 1)}>Next</Button>
					</Space>
				</div>

				{import.meta.env.DEV && (
					<div style={{ marginTop: 18, fontSize: 11, opacity: 0.7 }}>
						<Text type="secondary">Diagnostics: url={store.diagnostics.lastUrl} status={store.diagnostics.lastStatus} fetched={store.diagnostics.lastFetchedAt}</Text>
					</div>
				)}
			</Card>

			<Modal
				title={store.editing ? 'Edit User' : 'Add User'}
				open={store.addModalVisible}
				onCancel={() => store.closeModal()}
				onOk={() => store.saveDraft()}
				okText="Save"
				destroyOnClose
				width={600}
			>
				<Form
					layout="vertical"
					initialValues={store.draft}
					onValuesChange={(_, all) => {
						(['employeeId','name','department','accessLevel','role'] as const).forEach(f => {
							if (f in all) store.updateDraft(f, all[f]);
						});
					}}
				>
					<Form.Item label="Employee ID" name="employeeId" required rules={[{ required: true }]}> <Input /> </Form.Item>
					<Form.Item label="Name" name="name" required rules={[{ required: true }]}> <Input /> </Form.Item>
					<Form.Item label="Department" name="department"> <Input /> </Form.Item>
					<Form.Item label="Access Level" name="accessLevel"> <Input placeholder="e.g. A0001;R0001;R0003;" /> </Form.Item>
					<Form.Item label="Role" name="role"> <Select options={[{ label: 'Administrator', value: 'Administrator' }, { label: 'Viewer', value: 'Viewer' }, { label: 'Editor', value: 'Editor' }]} /> </Form.Item>
				</Form>
			</Modal>

			<Footer />
		</div>
	);
});

export default UserAccounts;
