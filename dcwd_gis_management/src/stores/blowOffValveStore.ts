import { makeAutoObservable } from "mobx";
import axios from "axios";

export interface BlowOffValveRecord {
  id: string;
  bovnumber: string;
  wonumber: string;
  dategeocoded: string;
  size: string;
  status_remarks: string;
  date_commissioned: string;
  location: string;
  brgycode: string;
  geom: string;
  lat: number | null;
  lng: number | null;
  assetTag: string;
}

class BlowOffValveStore {
  search = '';
  pageSize = 10;
  currentPage = 1;
  modalOpen = false;
  selectedRow: any | null = null;
  data: BlowOffValveRecord[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setSearch(val: string) {
    this.search = val;
  }
  setPageSize(val: number) {
    this.pageSize = val;
    this.currentPage = 1;
  }
  setCurrentPage(page: number) {
    if (page >= 1) {
      this.currentPage = page;
    }
  }
  setModalOpen(val: boolean) {
    this.modalOpen = val;
  }
  setSelectedRow(val: any | null) {
    this.selectedRow = val;
  }

  async fetchBlowOffValves() {
    const { runInAction } = await import('mobx');
    runInAction(() => {
      this.loading = true;
      this.error = null;
    });
    try {
      const res = await axios.get('helpers/gis/mgtsys/getLayers/getBov.php');
      const apiData = res.data;
      let valves: any[] = Array.isArray(apiData.data) ? apiData.data : [];
      runInAction(() => {
        this.data = valves.map((item: any) => ({
          id: item.id || '',
          bovnumber: item.bovnumber || '',
          wonumber: item.wonumber || '',
          dategeocoded: item.dategeocoded || '',
          size: item.size || '',
          status_remarks: item.status_remarks || '',
          date_commissioned: item.date_commissioned || '',
          location: item.location || '',
          brgycode: item.brgycode || '',
          // Add geometry fields like Air Valve
          geom: item.geom || '',
          lat: item.lat || item.latitude || null,
          lng: item.lng || item.lon || item.longitude || null,
          // Add other potential fields
          assetTag: item.asset_tag || item.assetTag || '',
        }));
      });
    } catch (err: any) {
      runInAction(() => {
        this.error = err.message || 'Failed to fetch Blow Off Valves';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const blowOffValveStore = new BlowOffValveStore();
