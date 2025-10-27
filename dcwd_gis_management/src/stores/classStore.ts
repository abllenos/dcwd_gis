import { makeAutoObservable, runInAction } from 'mobx';
import { apiGis } from '../components/endpoints/Interceptor';

export interface ClassRecord {
  id: number;
  description: string;
  dateInserted: string; // ISO string or formatted date
}

interface NetworkDiagnostics {
  lastUrl: string | null;
  lastStatus: number | null;
  lastFetchedAt: string | null;
  lastError: string | null;
}

class ClassStore {
  records: ClassRecord[] = [];
  pageSize = 10;
  currentPage = 1;
  search = '';
  pageJumpInput = 1;

  addModalVisible = false;
  editing: ClassRecord | null = null;
  draft: Partial<ClassRecord> = {};

  loading = false;
  diagnostics: NetworkDiagnostics = {
    lastUrl: null,
    lastStatus: null,
    lastFetchedAt: null,
    lastError: null,
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.fetchAll();
  }

  async fetchAll() {
    this.loading = true;
    const isDev = import.meta.env.DEV;
    const urlPath = isDev ? '/api/classes' : 'web/dcwdgis/ajax/query/getAllClass.php';
    runInAction(() => {
      this.diagnostics.lastUrl = urlPath + '?mode=active';
      this.diagnostics.lastStatus = null;
      this.diagnostics.lastError = null;
    });
    try {
      const start = performance.now();
      // Public endpoint; skip auth
      const response = await apiGis.get(urlPath, { params: { mode: 'active' }, useLocalProxy: isDev, skipAuth: true, headers: { Accept: 'application/json, text/plain;q=0.9' } } as any);
      const raw = response.data;
      let parsed: unknown = raw;
      if (typeof raw === 'string') {
        try { parsed = JSON.parse(raw); } catch { /* leave as string */ }
      }
      // Expect shape { data: [ [id, description, date?, ...] ] } similar to classification, but verify
      let working: unknown = parsed;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && (parsed as any).data) {
        working = (parsed as any).data;
      }
      const list: ClassRecord[] = Array.isArray(working) ? (working as any[]).map((item: any, idx: number): ClassRecord | null => {
        if (Array.isArray(item)) {
          // Tuple form: [id, description, maybeStatusFlag/unused, ...]
            const [idRaw, descRaw] = item;
          return {
            id: Number(idRaw) || idx + 1,
            description: String(descRaw ?? '').trim(),
            dateInserted: new Date().toISOString(),
          };
        }
        if (item && typeof item === 'object') {
          const id = Number(item.id ?? idx + 1);
          const description = String(item.description || item.desc || item.name || '').trim();
          const dateInserted = String(item.dateInserted || item.created_at || new Date().toISOString());
          if (!description) return null;
          return { id, description, dateInserted };
        }
        return null;
      }).filter(Boolean) as ClassRecord[] : [];
      runInAction(() => {
        this.records = list;
        this.diagnostics.lastStatus = 200;
        this.diagnostics.lastFetchedAt = new Date().toISOString();
        const validPage = this.clampPage(this.currentPage);
        this.currentPage = validPage;
        this.pageJumpInput = validPage;
      });
    } catch (err: unknown) {
      runInAction(() => {
        this.diagnostics.lastStatus = (err as any)?.response?.status ?? 0;
        this.diagnostics.lastError = err instanceof Error ? err.message : 'Unknown error';
        this.records = [];
      });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }

  // Computed
  get filtered() {
    if (!this.search.trim()) return this.records;
    const q = this.search.toLowerCase();
    return this.records.filter(r => r.description.toLowerCase().includes(q));
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

  openAdd() { this.editing = null; this.draft = { description: '', dateInserted: new Date().toISOString() }; this.addModalVisible = true; }
  openEdit(r: ClassRecord) { this.editing = r; this.draft = { ...r }; this.addModalVisible = true; }
  closeModal() { this.addModalVisible = false; }
  updateDraft(field: keyof ClassRecord, value: string) {
    if (field === 'description') this.draft.description = value;
  }
  saveDraft() {
    if (!this.draft.description) return false;
    if (this.editing) {
      const idx = this.records.findIndex(r => r.id === this.editing!.id);
      if (idx >= 0) this.records[idx] = { ...this.records[idx], description: this.draft.description! };
    } else {
      const nextId = this.records.length ? Math.max(...this.records.map(r => r.id)) + 1 : 1;
      this.records.push({ id: nextId, description: this.draft.description!, dateInserted: new Date().toISOString() });
    }
    this.closeModal();
    return true;
  }

  async refresh() { await this.fetchAll(); }
}

export const classStore = new ClassStore();
