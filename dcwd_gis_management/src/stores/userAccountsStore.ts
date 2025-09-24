import { makeAutoObservable, runInAction } from 'mobx';

export interface UserAccountRecord {
	id: number;
	employeeId: string;
	name: string; // "Last, First M." format
	department: string;
	accessLevel: string; // semicolon separated for now
	role: string; // Administrator | Viewer | Editor etc
	dateInserted: string; // ISO string
}

interface NetworkDiagnostics {
	lastUrl: string | null;
	lastStatus: number | null;
	lastFetchedAt: string | null;
	lastError: string | null;
}

class UserAccountsStore {
	records: UserAccountRecord[] = [];
	pageSize = 10;
	currentPage = 1;
	search = '';

	addModalVisible = false;
	editing: UserAccountRecord | null = null;
	draft: Partial<UserAccountRecord> = {};

	loading = false;
	diagnostics: NetworkDiagnostics = { lastUrl: null, lastStatus: null, lastFetchedAt: null, lastError: null };

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true });
		this.seed();
	}

	private seed() {
		const seedData: Array<Omit<UserAccountRecord, 'dateInserted'>> = [
			{ id: 1, employeeId: '001786', name: 'Viray, Alexander John B.', department: 'Information and Communication Technology Department', accessLevel: 'A0001;R0001;R0003;', role: 'Administrator' },
			{ id: 2, employeeId: '000747', name: 'Basio, Alexis L.', department: 'Information and Communication Technology Department', accessLevel: 'R0003;A0006;', role: 'Viewer' },
			{ id: 3, employeeId: '001746', name: 'Cafe, Merry Joy V.', department: 'Information and Communication Technology Department', accessLevel: 'R0003;A0006;', role: 'Viewer' },
			{ id: 4, employeeId: '001780', name: 'Escueta, Cyrelle Jan B.', department: 'Information and Communication Technology Department', accessLevel: 'R0003;A0006;', role: 'Viewer' },
			{ id: 5, employeeId: '001779', name: 'Culata, Rommel P.', department: 'Information and Communication Technology Department', accessLevel: 'R0003;A0006;', role: 'Viewer' },
			{ id: 6, employeeId: '001346', name: 'Medrano, Kim V.', department: 'Corporate Planning Department', accessLevel: 'A0002;A0006;R0001;', role: 'Viewer' },
			{ id: 7, employeeId: '002481', name: 'Llenos, Alvin B.', department: 'Information and Communication Technology Department', accessLevel: 'A0001;R0001;R0003;', role: 'Administrator' },
			{ id: 8, employeeId: '002482', name: 'Anderson, Jamie T.', department: 'Information and Communication Technology Department', accessLevel: 'A0001;R0001;R0003;', role: 'Administrator' },
			{ id: 9, employeeId: '003210', name: 'Lopez, Maria C.', department: 'Corporate Planning Department', accessLevel: 'R0003;A0006;', role: 'Editor' },
			{ id: 10, employeeId: '004011', name: 'Garcia, Rafael D.', department: 'Corporate Planning Department', accessLevel: 'R0003;A0006;', role: 'Viewer' },
			{ id: 11, employeeId: '000001', name: 'VAPT, DCWD .', department: 'Information and Communication Technology Department', accessLevel: 'R0003;A0006;', role: 'Editor' },
		];
		const now = Date.now();
		this.records = seedData.map((r, idx) => ({ ...r, dateInserted: new Date(now - idx * 60000).toISOString() }));
	}

	// Computed
	get filtered() {
		if (!this.search.trim()) return this.records;
		const q = this.search.toLowerCase();
		return this.records.filter(r =>
			r.employeeId.toLowerCase().includes(q) ||
			r.name.toLowerCase().includes(q) ||
			r.department.toLowerCase().includes(q) ||
			r.role.toLowerCase().includes(q)
		);
	}
	get totalCount() { return this.filtered.length; }
	get paged() { const start = (this.currentPage - 1) * this.pageSize; return this.filtered.slice(start, start + this.pageSize); }

	// Actions
	setSearch(v: string) { this.search = v; this.currentPage = 1; }
	setPageSize(v: number) { this.pageSize = v; this.currentPage = 1; }
	setCurrentPage(p: number) { this.currentPage = p; }

	openAdd() { this.editing = null; this.draft = { employeeId: '', name: '', department: '', accessLevel: '', role: 'Viewer' }; this.addModalVisible = true; }
	openEdit(r: UserAccountRecord) { this.editing = r; this.draft = { ...r }; this.addModalVisible = true; }
	closeModal() { this.addModalVisible = false; }
		updateDraft<K extends keyof UserAccountRecord>(field: K, value: UserAccountRecord[K]) {
			// Narrow safely
			(this.draft as Partial<UserAccountRecord>)[field] = value;
		}

	saveDraft() {
		if (!this.draft.employeeId || !this.draft.name) return false;
		if (this.editing) {
			const idx = this.records.findIndex(r => r.id === this.editing!.id);
			if (idx >= 0) this.records[idx] = { ...this.records[idx], ...this.draft } as UserAccountRecord;
		} else {
			const nextId = this.records.length ? Math.max(...this.records.map(r => r.id)) + 1 : 1;
			this.records.push({
				id: nextId,
				employeeId: this.draft.employeeId!,
				name: this.draft.name!,
				department: this.draft.department || '',
				accessLevel: this.draft.accessLevel || '',
				role: this.draft.role || 'Viewer',
				dateInserted: new Date().toISOString()
			});
		}
		this.closeModal();
		return true;
	}

	async refresh(fakeDelay = 400) {
		this.loading = true;
		runInAction(() => { this.diagnostics.lastUrl = '/maintenance/user-accounts'; this.diagnostics.lastStatus = 200; this.diagnostics.lastError = null; });
		await new Promise(r => setTimeout(r, fakeDelay));
		runInAction(() => { this.diagnostics.lastFetchedAt = new Date().toISOString(); this.loading = false; });
	}
}

export const userAccountsStore = new UserAccountsStore();
