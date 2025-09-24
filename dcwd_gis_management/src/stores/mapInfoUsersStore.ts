import { makeAutoObservable } from "mobx";

class MapInfoUsersStore {
  software = '';
  deviceName = '';
  department = '';
  userId = '';
  installDate: Date | null = null;
  search = '';
  pageSize = 10;

  constructor() {
    makeAutoObservable(this);
  }

  setSoftware(val: string) { this.software = val; }
  setDeviceName(val: string) { this.deviceName = val; }
  setDepartment(val: string) { this.department = val; }
  setUserId(val: string) { this.userId = val; }
  setInstallDate(val: Date | null) { this.installDate = val; }
  setSearch(val: string) { this.search = val; }
  setPageSize(val: number) { this.pageSize = val; }
}

export const mapInfoUsersStore = new MapInfoUsersStore();
