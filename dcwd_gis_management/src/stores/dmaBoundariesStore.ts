import { makeAutoObservable } from "mobx";

class DMABoundariesStore {
  pageSize = 10;
  search = '';

  constructor() {
    makeAutoObservable(this);
  }

  setPageSize(val: number) { this.pageSize = val; }
  setSearch(val: string) { this.search = val; }
}

export const dmaBoundariesStore = new DMABoundariesStore();
