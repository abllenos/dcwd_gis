import { makeAutoObservable } from 'mobx';

export interface PSVRecord {
  psv_number: string;
  accountnumber: string;
  location: string;
  meter_number: string;
  size: number;
  brand_name: string;
  pressure_setting: string;
  remarks: string;
}

class PsvStore {
  data: PSVRecord[] = [];
  isLoading = false;
  error: any = null;
  pageSize = 10;
  currentPage = 1;
  search = '';
  modalVisible = false;
  selected: PSVRecord | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPageSize(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
  }
  setCurrentPage(page: number) {
    if (page >= 1) {
      this.currentPage = page;
    }
  }

  setSearch(value: string) {
    this.search = value;
  }

  setModalVisible(visible: boolean) {
    this.modalVisible = visible;
  }

  setSelected(record: PSVRecord | null) {
    this.selected = record;
  }

  setData(data: PSVRecord[]) {
    this.data = [...data]; // Create new array to avoid reference issues
  }

  clearData() {
    this.data = [];
    this.currentPage = 1;
    this.search = '';
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
      (r.psv_number?.toLowerCase() ?? '').includes(q) ||
      (r.accountnumber?.toLowerCase() ?? '').includes(q) ||
      (r.location?.toLowerCase() ?? '').includes(q) ||
      (r.meter_number?.toLowerCase() ?? '').includes(q) ||
      (r.size?.toString() ?? '').includes(q) ||
      (r.brand_name?.toLowerCase() ?? '').includes(q) ||
      (r.pressure_setting?.toLowerCase() ?? '').includes(q) ||
      (r.remarks?.toLowerCase() ?? '').includes(q)
    );
  }
}

export const psvStore = new PsvStore();
