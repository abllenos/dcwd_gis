import { makeAutoObservable } from "mobx";

class PressureMonitoringSystemStore {
  search = '';
  pageSize = 10;
  currentPage = 1;
  modalOpen = false;
  // Add other state as needed

  constructor() {
    makeAutoObservable(this);
  }

  setSearch(val: string) {
    this.search = val;
  }
  setPageSize(val: number) {
    this.pageSize = val;
    this.currentPage = 1;
  }
  setCurrentPage(page: number) {
    if (page >= 1) {
      this.currentPage = page;
    }
  }
  setModalOpen(val: boolean) {
    this.modalOpen = val;
  }
}

export const pressureMonitoringSystemStore = new PressureMonitoringSystemStore();
