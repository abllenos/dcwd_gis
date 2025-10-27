import { makeAutoObservable, runInAction } from 'mobx';
import { apiGis } from '../components/endpoints/Interceptor';

// Shape of a classification record
export interface ClassificationRecord {
  id: number;
  description: string;
  statusFlag: number; // 1 active, 0 inactive
  layerName: string;
  className: string;
}

// Diagnostics aligned to emerging NetworkDiagnostics convention
interface NetworkDiagnostics {
  lastUrl: string | null;
  lastStatus: number | null;
  lastFetchedAt: string | null; // ISO string
  lastError: string | null;
  lastRawCount?: number | null;
  lastParseNote?: string | null;
}

class ClassificationStore {
  // Data
  records: ClassificationRecord[] = [];

  // UI state (kept here instead of useState in component)
  pageSize = 10;
  currentPage = 1;
  search = '';
  pageJumpInput = 1;

  // Modal / edit state
  addModalVisible = false;
  editingRecord: ClassificationRecord | null = null;
  formDraft: Partial<ClassificationRecord> = {};

  // Loading flag (future real API)
  loading = false;

  // Diagnostics
  diagnostics: NetworkDiagnostics = {
    lastUrl: null,
    lastStatus: null,
    lastFetchedAt: null,
    lastError: null,
    lastRawCount: null,
    lastParseNote: null,
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    // Initial fetch
    this.fetchAllClassifications();
  }

  // Fetch real data from public endpoint
  async fetchAllClassifications() {
    this.loading = true;
  // Path selection:
  // DEV: use local Vite proxy (/api/classifications) as a TEMPORARY CORS workaround until backend adds headers or
  // a server-side pass-through is implemented. PROD: call remote relative path directly.
  const isDev = import.meta.env.DEV;
  const urlPath = isDev ? '/api/classifications' : 'web/dcwdgis/ajax/query/getAllClassification.php';
    runInAction(() => {
      this.diagnostics.lastUrl = urlPath + '?mode=active';
      this.diagnostics.lastStatus = null;
      this.diagnostics.lastError = null;
    });
    try {
      // Public endpoint: do not send Authorization header; mark skipAuth to be explicit
  const response = await apiGis.get(urlPath, { params: { mode: 'active' }, useLocalProxy: isDev, skipAuth: true, headers: { Accept: 'application/json, text/plain;q=0.9' } } as any);
      const raw = response.data;
      // Some endpoints might respond as text; defensively parse if string
      let data: unknown;
      if (typeof raw === 'string') {
        try { data = JSON.parse(raw); } catch { data = raw; }
      } else { data = raw; }

      let working = data;
      let parseNote: string | null = null;
      // If not an array, attempt to find array inside an object wrapper
      if (!Array.isArray(working) && working && typeof working === 'object') {
        const obj = working as Record<string, unknown>;
        // Common keys to try first
        const preferredKeys = ['data', 'rows', 'result', 'items', 'classifications'];
        let candidate: unknown = null;
        for (const k of preferredKeys) {
          if (Array.isArray(obj[k])) { candidate = obj[k]; parseNote = `wrapped:${k}`; break; }
        }
        if (!candidate) {
          // Fallback: first array property
            for (const k of Object.keys(obj)) {
              if (Array.isArray(obj[k])) { candidate = obj[k]; parseNote = `wrapped:firstArray:${k}`; break; }
            }
        }
        if (!candidate) {
          // Maybe it's an object keyed by id -> convert values
          const values = Object.values(obj);
          if (values.length && values.every(v => v && typeof v === 'object')) {
            candidate = values;
            parseNote = 'objectValues';
          }
        }
        if (candidate) working = candidate;
      }

      const arr: ClassificationRecord[] = Array.isArray(working) ? (working as any[]).map((item: any, idx: number) => {
        // Two possible shapes:
        // 1. Object form { id, description, statusFlag, layerName, className }
        // 2. Tuple form [id, description, statusFlag, layerName, className]
        if (Array.isArray(item)) {
          const [idRaw, descRaw, statusRaw, layerRaw, classRaw] = item as unknown[];
          const id = Number(idRaw) || idx + 1;
          const description = String(descRaw ?? '').trim();
          const statusFlag = Number(statusRaw) === 0 ? 0 : 1; // treat non-zero as 1
          const layerName = String(layerRaw ?? '').trim();
          const className = String(classRaw ?? '').trim();
          return { id, description, statusFlag, layerName, className };
        }
        // Object normalization fallback
        const description = String(item.description || item.desc || item.classification || '').trim();
        const layerName = String(item.layerName || item.layer || item.layer_name || '').trim();
        const className = String(item.className || item.class_name || item.class || '').trim();
        const statusFlag = typeof item.statusFlag === 'number' ? item.statusFlag : (item.status_flag ? Number(item.status_flag) : 1);
        const idVal = Number(item.id ?? item.classificationId ?? (idx + 1));
        return { id: Number.isFinite(idVal) ? idVal : idx + 1, description, layerName, className, statusFlag };
      }).filter(r => r.description || r.layerName || r.className) : [];

      runInAction(() => {
        this.records = arr;
        const validPage = this.clampPage(this.currentPage);
        this.currentPage = validPage;
        this.pageJumpInput = validPage;
        this.diagnostics.lastStatus = 200;
        this.diagnostics.lastFetchedAt = new Date().toISOString();
        this.diagnostics.lastRawCount = Array.isArray(working) ? (working as any[]).length : null;
        this.diagnostics.lastParseNote = parseNote;
      });
    } catch (err: unknown) {
      runInAction(() => {
        this.diagnostics.lastStatus = (err as any)?.response?.status ?? 0;
        this.diagnostics.lastError = err instanceof Error ? err.message : 'Unknown error';
        this.diagnostics.lastRawCount = null;
        this.diagnostics.lastParseNote = null;
      });
    } finally {
      runInAction(() => { this.loading = false; });
    }
  }

  // Computed filtered set
  get filteredRecords(): ClassificationRecord[] {
    if (!this.search.trim()) return this.records;
    const q = this.search.toLowerCase();
    return this.records.filter(r =>
      r.description.toLowerCase().includes(q) ||
      r.layerName.toLowerCase().includes(q) ||
      r.className.toLowerCase().includes(q)
    );
  }

  get totalCount() { return this.filteredRecords.length; }
  get pagedRecords(): ClassificationRecord[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRecords.slice(start, start + this.pageSize);
  }
  get totalPages() { return Math.max(1, Math.ceil(this.totalCount / this.pageSize)); }

  // Actions
  setSearch(value: string) {
    this.search = value;
    this.currentPage = 1;
    this.pageJumpInput = 1;
  }
  setPageSize(value: number) {
    this.pageSize = value;
    this.currentPage = 1;
    this.pageJumpInput = 1;
  }
  setCurrentPage(page: number) {
    const target = this.clampPage(page);
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

  openAddModal() {
    this.editingRecord = null;
    this.formDraft = { description: '', statusFlag: 1, layerName: '', className: '' };
    this.addModalVisible = true;
  }
  openEdit(record: ClassificationRecord) {
    this.editingRecord = record;
    this.formDraft = { ...record };
    this.addModalVisible = true;
  }
  closeModal() { this.addModalVisible = false; }
  updateDraft(field: keyof ClassificationRecord, value: string | number) {
    // Narrow allowed fields: description, layerName, className expect string; statusFlag expects number
    if (field === 'statusFlag') {
      this.formDraft.statusFlag = typeof value === 'number' ? value : parseInt(String(value), 10) || 0;
    } else if (field === 'description' || field === 'layerName' || field === 'className') {
      (this.formDraft as any)[field] = String(value);
    }
  }

  saveDraft() {
    const draft = this.formDraft;
    if (!draft.description || !draft.layerName || !draft.className) return false;
    if (this.editingRecord) {
      // Update existing
      const idx = this.records.findIndex(r => r.id === this.editingRecord!.id);
      if (idx >= 0) {
    this.records[idx] = { ...(this.records[idx]), ...(draft as ClassificationRecord) };
      }
    } else {
      const nextId = this.records.length ? Math.max(...this.records.map(r => r.id)) + 1 : 1;
      this.records.push({
        id: nextId,
        description: draft.description!,
        statusFlag: draft.statusFlag ?? 1,
        layerName: draft.layerName!,
        className: draft.className!,
      });
    }
    this.closeModal();
    return true;
  }

  // Manual refresh
  async refreshFromServer() { await this.fetchAllClassifications(); }
}

export const classificationStore = new ClassificationStore();
