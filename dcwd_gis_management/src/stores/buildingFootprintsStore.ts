import { makeAutoObservable } from "mobx";

class BuildingFootprintsStore {
  month = '';
  year = '';

  constructor() {
    makeAutoObservable(this);
  }

  setMonth(val: string) { this.month = val; }
  setYear(val: string) { this.year = val; }
}

export const buildingFootprintsStore = new BuildingFootprintsStore();
