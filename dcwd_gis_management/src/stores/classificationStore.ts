import { makeAutoObservable, runInAction } from 'mobx';

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
}

class ClassificationStore {
  // Data
  records: ClassificationRecord[] = [];

  // UI state (kept here instead of useState in component)
  pageSize = 10;
  currentPage = 1;
  search = '';

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
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.seedFakeData();
  }

  // Seed with 123 fake records to match screenshot density
  private seedFakeData() {
    const base: Omit<ClassificationRecord, 'id'>[] = [
      { description: 'HWMONLINE', statusFlag: 1, layerName: 'DCWD_PMS', className: 'PMS BRAND' },
      { description: 'RADCOM', statusFlag: 1, layerName: 'DCWD_PMS', className: 'PMS BRAND' },
      { description: 'PRIMAYER', statusFlag: 1, layerName: 'DCWD_PMS', className: 'PMS BRAND' },
      { description: 'PVC', statusFlag: 1, layerName: 'UNIVERSAL', className: 'PIPE TYPE' },
      { description: 'CMLECSP', statusFlag: 1, layerName: 'UNIVERSAL', className: 'PIPE TYPE' },
      { description: 'MLCSP', statusFlag: 1, layerName: 'UNIVERSAL', className: 'PIPE TYPE' },
      { description: 'Air Release Valve', statusFlag: 1, layerName: 'DCWD_VALVE_AV', className: 'VALVE TYPE' },
      { description: 'BERMAD', statusFlag: 1, layerName: 'DCWD_VALVE_AV', className: 'VALVE BRAND' },
      { description: 'CLAVAL', statusFlag: 1, layerName: 'DCWD_VALVE_AV', className: 'VALVE BRAND' },
      { description: 'AVK', statusFlag: 1, layerName: 'DCWD_VALVE_AV', className: 'VALVE BRAND' },
    ];
    const list: ClassificationRecord[] = [];
    let id = 1;
    // Repeat base list until we reach ~123 items (as screenshot shows 123 entries)
    while (list.length < 123) {
      for (const item of base) {
        list.push({ id: id++, ...item });
        if (list.length >= 123) break;
      }
    }
    this.records = list;
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

  // Actions
  setSearch(value: string) { this.search = value; this.currentPage = 1; }
  setPageSize(value: number) { this.pageSize = value; this.currentPage = 1; }
  setCurrentPage(page: number) { this.currentPage = page; }

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

  // Placeholder for future API fetch
  async refreshFromServer(fakeDelayMs = 600) {
    this.loading = true;
    runInAction(() => {
      this.diagnostics.lastUrl = '/maintenance/classification';
      this.diagnostics.lastStatus = 200; // fake
      this.diagnostics.lastError = null;
    });
    await new Promise(r => setTimeout(r, fakeDelayMs));
    runInAction(() => { this.diagnostics.lastFetchedAt = new Date().toISOString(); this.loading = false; });
  }
}

export const classificationStore = new ClassificationStore();
