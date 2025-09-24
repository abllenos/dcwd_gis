import { makeAutoObservable } from "mobx";

class PressureMonitoringSystemStore {
  search = '';
  pageSize = 10;
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
  }
  setModalOpen(val: boolean) {
    this.modalOpen = val;
  }
}

export const pressureMonitoringSystemStore = new PressureMonitoringSystemStore();
