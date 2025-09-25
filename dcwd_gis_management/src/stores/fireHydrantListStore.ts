import { makeAutoObservable } from "mobx";
import type { TablePaginationConfig } from "antd/es/table";

class FireHydrantListStore {
  searchText = "";
  pagination: TablePaginationConfig = { current: 1, pageSize: 10 };

  constructor() {
    makeAutoObservable(this);
  }

  setSearchText(val: string) {
    this.searchText = val;
  }
  setPagination(val: TablePaginationConfig) {
    this.pagination = val;
  }
}

export const fireHydrantListStore = new FireHydrantListStore();
