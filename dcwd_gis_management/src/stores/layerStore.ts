import { makeAutoObservable, runInAction } from 'mobx';

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

  addModalVisible = false;
  editing: LayerRecord | null = null;
  draft: Partial<LayerRecord> = {};

  loading = false;
  diagnostics: NetworkDiagnostics = { lastUrl: null, lastStatus: null, lastFetchedAt: null, lastError: null };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.seed();
  }

  private seed() {
    const base = [
      'DCWD_PMS','UNIVERSAL','DCWD_VALVE_AV','FIREHYDRANT','ISOLATIONVALVE','BOV','PRV','PSV','REDUCER','CUSTOMER','TRANSMISSION','DISTRIBUTION','PRESSURE_ZONE','DMA_POLYGON','EASEMENT','SERVICE_CONNECTION','WATER_SOURCE','TREATMENT_PLANT','RESERVOIR','PUMP_STATION','PIPE_REHAB','METERING_POINT','SENSOR_LAYER'
    ];
    const now = Date.now();
    this.records = base.map((d, i) => ({
      id: i + 1,
      description: d,
      statusFlag: 1,
      dateInserted: new Date(now - i * 7000).toISOString()
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

  async refresh(fakeDelay = 400) {
    this.loading = true;
    runInAction(() => { this.diagnostics.lastUrl = '/maintenance/layer'; this.diagnostics.lastStatus = 200; this.diagnostics.lastError = null; });
    await new Promise(r => setTimeout(r, fakeDelay));
    runInAction(() => { this.diagnostics.lastFetchedAt = new Date().toISOString(); this.loading = false; });
  }
}

export const layerStore = new LayerStore();
