import { makeAutoObservable } from 'mobx';

export interface PressureReleaseValveRecord {
  key: string;
  id: number;
  prvNumber: string;
  location: string;
  status: string;
  // Add other fields as needed from API
}

class PrvStore {
  data: PressureReleaseValveRecord[] = [];
  isLoading = false;
  error: any = null;
  pageSize = 10;
  search = '';
  modalVisible = false;
  selectedRecord: PressureReleaseValveRecord | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPageSize(size: number) {
    this.pageSize = size;
  }

  setSearch(value: string) {
    this.search = value;
  }

  setModalVisible(visible: boolean) {
    this.modalVisible = visible;
  }

  setSelectedRecord(record: PressureReleaseValveRecord | null) {
    this.selectedRecord = record;
  }

  setData(data: PressureReleaseValveRecord[]) {
    this.data = data;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: any) {
    this.error = error;
  }

  get filteredData() {
    const q = this.search.trim().toLowerCase();
    return this.data.filter((r) =>
      String(r.id).includes(q) ||
      r.prvNumber.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    );
  }
}

export const prvStore = new PrvStore();
