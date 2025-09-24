import { makeAutoObservable } from "mobx";

class FireHydrantStore {
  pageSize = 10;
  search = '';
  modalVisible = false;
  selected: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPageSize(val: number) { this.pageSize = val; }
  setSearch(val: string) { this.search = val; }
  setModalVisible(val: boolean) { this.modalVisible = val; }
  setSelected(val: any) { this.selected = val; }
}

export const fireHydrantStore = new FireHydrantStore();
