import { makeAutoObservable } from "mobx";

class DMAInletStore {
  search = '';
  pageSize = 10;
  current = 1;
  modalOpen = false;
  selectedAssetId: number | string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setSearch(val: string) {
    this.search = val;
  }
  setPageSize(val: number) {
    this.pageSize = val;
  }
  setCurrent(val: number) {
    this.current = val;
  }
  setModalOpen(val: boolean) {
    this.modalOpen = val;
  }
  setSelectedAssetId(val: number | string) {
    this.selectedAssetId = val;
  }
}

export const dmaInletStore = new DMAInletStore();
