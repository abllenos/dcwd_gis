import { makeAutoObservable, runInAction } from 'mobx';

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
    this.seed();
  }

  private seed() {
    const baseDescriptions = [
      'VALVE BRAND','PIPE TYPE','STATUS','VALVE TYPE','PMS BRAND','HYDRANT CLASSIFICATION','VALVE STATUS','PSV BRAND','REDUCER TYPE','PIPE MATERIAL','PIPE COATING','GAUGE TYPE','HYDRANT TYPE','MATERIAL TYPE','METER TYPE','SERVICE TYPE','AREA CLASS','PRESSURE ZONE','DMA GROUP','LEAK CATEGORY','INSPECTION TYPE','MAINTENANCE TYPE'
    ];
    // Provide 22 entries like screenshot (1..22)
    const now = new Date();
    this.records = baseDescriptions.map((d, idx) => ({
      id: idx + 1,
      description: d,
      dateInserted: new Date(now.getTime() - idx * 5000).toISOString()
    }));
  }

  // Computed
  get filtered() {
    if (!this.search.trim()) return this.records;
    const q = this.search.toLowerCase();
    return this.records.filter(r => r.description.toLowerCase().includes(q));
  }
  get totalCount() { return this.filtered.length; }
  get paged() { const start = (this.currentPage - 1) * this.pageSize; return this.filtered.slice(start, start + this.pageSize); }

  // Actions
  setSearch(v: string) { this.search = v; this.currentPage = 1; }
  setPageSize(v: number) { this.pageSize = v; this.currentPage = 1; }
  setCurrentPage(p: number) { this.currentPage = p; }

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

  async refresh(fakeDelay = 400) {
    this.loading = true;
    runInAction(() => { this.diagnostics.lastUrl = '/maintenance/class'; this.diagnostics.lastStatus = 200; this.diagnostics.lastError = null; });
    await new Promise(r => setTimeout(r, fakeDelay));
    runInAction(() => { this.diagnostics.lastFetchedAt = new Date().toISOString(); this.loading = false; });
  }
}

export const classStore = new ClassStore();
