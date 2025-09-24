import { makeAutoObservable } from "mobx";

class AirValveMaintenanceStore {
  pageSize = 10;
  search = '';
  modalVisible = false;
  selectedRecord: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPageSize(val: number) { this.pageSize = val; }
  setSearch(val: string) { this.search = val; }
  setModalVisible(val: boolean) { this.modalVisible = val; }
  setSelectedRecord(val: any) { this.selectedRecord = val; }
}

export const airValveMaintenanceStore = new AirValveMaintenanceStore();
