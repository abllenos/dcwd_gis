import { makeAutoObservable, runInAction } from 'mobx';
import { apiGis } from '../components/endpoints/Interceptor';
import type { AxiosRequestConfig } from 'axios';

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
	pageJumpInput = 1;
	loading = false;
	diagnostics: NetworkDiagnostics = { lastUrl: null, lastStatus: null, lastFetchedAt: null, lastError: null };

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true });
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
		get totalPages() { return Math.max(1, Math.ceil(this.totalCount / this.pageSize)); }

	// Actions
		setSearch(v: string) {
			this.search = v;
			this.currentPage = 1;
			this.pageJumpInput = 1;
		}
		setPageSize(v: number) {
			this.pageSize = v;
			this.currentPage = 1;
			this.pageJumpInput = 1;
		}
		setCurrentPage(p: number) {
			const target = this.clampPage(p);
			this.currentPage = target;
			this.pageJumpInput = target;
		}
		setPageJumpInput(value: number | null) {
			if (typeof value !== 'number' || Number.isNaN(value)) {
				this.pageJumpInput = 1;
				return;
			}
			this.pageJumpInput = this.clampPage(value);
		}
		jumpToPage() {
			this.setCurrentPage(this.pageJumpInput);
		}
		private clampPage(value: number) {
			if (!Number.isFinite(value)) return 1;
			const total = this.totalPages;
			const v = Math.floor(value);
			if (total <= 0) return 1;
			if (v < 1) return 1;
			if (v > total) return total;
			return v;
		}

	async refresh() {
		this.loading = true;
		const url = import.meta.env.DEV
			? '/web/dcwdgis/ajax/views/getAccounts.php'
			: 'https://gis.davao-water.gov.ph/web/dcwdgis/ajax/views/getAccounts.php';
		try {
			this.diagnostics.lastUrl = url;
			this.diagnostics.lastError = null;
			// Public endpoint (no auth) – use shared client; dev can proxy if needed
			const cfg = ({
				skipAuth: true,
				headers: { Accept: 'text/plain, application/json;q=0.9, */*;q=0.8' },
				...(import.meta.env.DEV ? { useLocalProxy: true } : {})
			} as unknown) as AxiosRequestConfig;
			const res = await apiGis.get(url, cfg);
			let payload: unknown = res.data as unknown;
			if (typeof payload === 'string') {
				const s = payload.trim();
				if (s.startsWith('{') || s.startsWith('[')) {
					try { payload = JSON.parse(s); } catch { /* swallow parse error; handle below */ }
				}
			}
			const data = (payload && (payload as any).data) as unknown;

			// Normalization BEGIN: handle tuple arrays [id, employeeId, name, department, accessLevel, role]
			const normalized: UserAccountRecord[] = Array.isArray(data)
				? (data as unknown[]).map((row, idx) => {
						if (Array.isArray(row)) {
							const [id, emp, name, dept, access, role] = row as unknown[];
							return {
								id: Number(id) || idx + 1,
								employeeId: String(emp ?? ''),
								name: String(name ?? ''),
								department: String(dept ?? ''),
								accessLevel: String(access ?? ''),
								role: String(role ?? ''),
								dateInserted: new Date().toISOString(),
							};
						}
						// Object fallback
						const obj = row as Record<string, unknown>;
						return {
							id: Number(obj.id) || idx + 1,
							employeeId: String(obj.employeeId ?? obj.empId ?? ''),
							name: String(obj.name ?? ''),
							department: String(obj.department ?? ''),
							accessLevel: String(obj.accessLevel ?? ''),
							role: String(obj.role ?? ''),
							dateInserted: new Date().toISOString(),
						};
					})
				: [];
			// Normalization END

			runInAction(() => {
				this.records = normalized;
				this.currentPage = 1;
						this.pageJumpInput = 1;
				this.diagnostics.lastStatus = res.status ?? 200;
				this.diagnostics.lastFetchedAt = new Date().toISOString();
				this.loading = false;
			});
		} catch (err: unknown) {
			runInAction(() => {
				this.loading = false;
				this.diagnostics.lastStatus = null;
				this.diagnostics.lastFetchedAt = new Date().toISOString();
				this.diagnostics.lastError = err instanceof Error ? err.message : 'Unknown error';
				this.records = [];
			});
		}
	}
}

export const userAccountsStore = new UserAccountsStore();
