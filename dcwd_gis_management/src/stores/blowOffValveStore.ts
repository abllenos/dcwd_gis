import { makeAutoObservable } from "mobx";

class BlowOffValveStore {
  search = '';
  pageSize = 10;
  modalOpen = false;
  selectedRow: any | null = null;

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
  setSelectedRow(val: any | null) {
    this.selectedRow = val;
  }
}

export const blowOffValveStore = new BlowOffValveStore();
