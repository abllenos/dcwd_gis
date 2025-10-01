import { makeAutoObservable } from "mobx";

class IsolationValveStore {
  pageSize = 10;
  currentPage = 1;
  setCurrentPage(page: number) { this.currentPage = page; }
  setPageSize(size: number) { this.pageSize = size; this.currentPage = 1; }
  search = '';
  modalVisible = false;
  editModalVisible = false;
  selected: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  setSearch(val: string) { this.search = val; }
  setModalVisible(val: boolean) { this.modalVisible = val; }
  setEditModalVisible(val: boolean) { this.editModalVisible = val; }
  setSelected(val: any) { this.selected = val; }
}

export const isolationValveStore = new IsolationValveStore();
