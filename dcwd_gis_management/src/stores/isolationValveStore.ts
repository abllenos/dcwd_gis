import { makeAutoObservable } from "mobx";

class IsolationValveStore {
  pageSize = 10;
  search = '';
  modalVisible = false;
  editModalVisible = false;
  selected: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPageSize(val: number) { this.pageSize = val; }
  setSearch(val: string) { this.search = val; }
  setModalVisible(val: boolean) { this.modalVisible = val; }
  setEditModalVisible(val: boolean) { this.editModalVisible = val; }
  setSelected(val: any) { this.selected = val; }
}

export const isolationValveStore = new IsolationValveStore();
