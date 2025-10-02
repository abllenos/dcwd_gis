import { makeAutoObservable } from "mobx";

class DMAInletStore {
  search = '';
  pageSize = 10;
  currentPage = 1;
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
  setSelectedAssetId(val: number | string) {
    this.selectedAssetId = val;
  }
}

export const dmaInletStore = new DMAInletStore();
