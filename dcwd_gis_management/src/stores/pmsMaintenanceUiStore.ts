import { makeAutoObservable } from "mobx";

class PmsMaintenanceUiStore {
  pageSize: number = 10;
  search: string = "";
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setPageSize(size: number) {
    this.pageSize = size;
  }

  setSearch(searchText: string) {
    this.search = searchText;
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }

  clearSearch() {
    this.search = "";
  }

  get hasSearch() {
    return this.search.length > 0;
  }
}

export const pmsMaintenanceUiStore = new PmsMaintenanceUiStore();
