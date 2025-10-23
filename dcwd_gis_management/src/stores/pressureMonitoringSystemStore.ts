import { makeAutoObservable } from "mobx";

class PressureMonitoringSystemStore {
  // Maintenance Modal State
  pageSize = 10;
  search = '';
  currentPage = 1;
  modalOpen = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Pagination
  setPageSize(val: number) {
    this.pageSize = val;
    this.currentPage = 1;
  }

  setCurrentPage(page: number) {
    if (page >= 1) {
      this.currentPage = page;
    }
  }

  // Search
  setSearch(val: string) {
    this.search = val;
  }

  // Modal
  setModalOpen(val: boolean) {
    this.modalOpen = val;
  }

  // Loading
  setIsLoading(value: boolean) {
    this.isLoading = value;
  }

  // Utilities
  clearSearch() {
    this.search = "";
  }

  get hasSearch() {
    return this.search.length > 0;
  }
}

export const pressureMonitoringSystemStore = new PressureMonitoringSystemStore();
