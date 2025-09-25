import { makeAutoObservable } from 'mobx';

export interface AirValveRecord {
  id: number;
  arv_number: string;
  location: string;
  status: string;
  wonumber: string;
  barangay: string;
  geom: string;
  lon: number;
  lat: number;
  date_installed?: string;
  water_source?: string;
  arv_serial_no?: string;
  type?: string;
  size?: string;
  brand?: string;
  gate_serial_no?: string;
  gate_valve_size?: string;
  gate_valve_brand?: string;
  no_of_turns?: string;
  depth?: string;
  remarks?: string;
  project_title?: string;
  hotlink?: string;
}

class AirValveStore {
  pageSize = 10;
  search = '';
  modalVisible = false;
  selectedRecord: AirValveRecord | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setPageSize = (val: number) => { this.pageSize = val; };
  setSearch = (val: string) => { this.search = val; };
  setModalVisible = (val: boolean) => { this.modalVisible = val; };
  setSelectedRecord = (val: AirValveRecord | null) => { this.selectedRecord = val; };
}

export const airValveStore = new AirValveStore();
