import { makeAutoObservable, runInAction } from 'mobx';
import { apiGis } from '../components/endpoints/Interceptor';

export interface LayerRecord {
  id: number;
  description: string;
  statusFlag: number; // 1 active, 0 inactive
  dateInserted: string; // ISO
}

interface NetworkDiagnostics {
  lastUrl: string | null;
  lastStatus: number | null;
  lastFetchedAt: string | null;
  lastError: string | null;
}

class LayerStore {
  records: LayerRecord[] = [];
  pageSize = 10;
  currentPage = 1;
  search = '';
  pageJumpInput = 1;

  addModalVisible = false;
  editing: LayerRecord | null = null;
  draft: Partial<LayerRecord> = {};

  loading = false;
  diagnostics: NetworkDiagnostics = { lastUrl: null, lastStatus: null, lastFetchedAt: null, lastError: null };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.fetchAll();
  }

  async fetchAll() {
    this.loading = true;
    const isDev = import.meta.env.DEV;
    const urlPath = isDev ? '/api/layers' : 'web/dcwdgis/ajax/query/getAllLayer.php';
    runInAction(() => {
      this.diagnostics.lastUrl = urlPath + '?mode=active';
      this.diagnostics.lastStatus = null;
      this.diagnostics.lastError = null;
    });
    try {
      const resp = await apiGis.get(urlPath, { params: { mode: 'active' }, useLocalProxy: isDev, skipAuth: true, headers: { Accept: 'application/json, text/plain;q=0.9' } } as any);
      const raw = resp.data;
      let parsed: unknown = raw;
      if (typeof raw === 'string') { try { parsed = JSON.parse(raw); } catch { /* keep string */ } }
      let working: unknown = parsed;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && (parsed as any).data) {
        working = (parsed as any).data;
      }
      const list: LayerRecord[] = Array.isArray(working) ? (working as any[]).map((item: any, idx: number): LayerRecord | null => {
        if (Array.isArray(item)) {
          // Tuple guess: [id, description, statusFlag, ...]
          const [idRaw, descRaw, statusRaw] = item;
          return {
            id: Number(idRaw) || idx + 1,
            description: String(descRaw ?? '').trim(),
            statusFlag: Number(statusRaw) === 0 ? 0 : 1,
            dateInserted: new Date().toISOString(),
          };
        }
        if (item && typeof item === 'object') {
          const id = Number(item.id ?? idx + 1);
          const description = String(item.description || item.desc || item.name || '').trim();
          const statusFlag = Number((item.statusFlag ?? item.status_flag ?? 1)) === 0 ? 0 : 1;
          const dateInserted = String(item.dateInserted || item.created_at || new Date().toISOString());
          if (!description) return null;
          return { id, description, statusFlag, dateInserted };
        }
        return null;
      }).filter(Boolean) as LayerRecord[] : [];
      runInAction(() => {
        this.records = list;
        const validPage = this.clampPage(this.currentPage);
        this.currentPage = validPage;
        this.pageJumpInput = validPage;
        this.diagnostics.lastStatus = 200;
        this.diagnostics.lastFetchedAt = new Date().toISOString();
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

  openAdd() { this.editing = null; this.draft = { description: '', statusFlag: 1 }; this.addModalVisible = true; }
  openEdit(r: LayerRecord) { this.editing = r; this.draft = { ...r }; this.addModalVisible = true; }
  closeModal() { this.addModalVisible = false; }
  updateDraft(field: keyof LayerRecord, value: string | number) {
    if (field === 'description') this.draft.description = String(value);
    if (field === 'statusFlag') this.draft.statusFlag = typeof value === 'number' ? value : parseInt(String(value), 10) || 0;
  }
  saveDraft() {
    if (!this.draft.description) return false;
    if (this.editing) {
      const idx = this.records.findIndex(r => r.id === this.editing!.id);
      if (idx >= 0) this.records[idx] = { ...this.records[idx], description: this.draft.description!, statusFlag: this.draft.statusFlag ?? 1 };
    } else {
      const nextId = this.records.length ? Math.max(...this.records.map(r => r.id)) + 1 : 1;
      this.records.push({ id: nextId, description: this.draft.description!, statusFlag: this.draft.statusFlag ?? 1, dateInserted: new Date().toISOString() });
    }
    this.closeModal();
    return true;
  }

  async refresh() { await this.fetchAll(); }
}

export const layerStore = new LayerStore();
