import { makeAutoObservable } from "mobx";
import axios from "axios";

class BlowOffValveStore {
  search = '';
  pageSize = 10;
  modalOpen = false;
  selectedRow: any | null = null;
  data: any[] = [];
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
      console.log('BlowOffValve API response:', apiData);
      let valves: any[] = Array.isArray(apiData.data) ? apiData.data : [];
      runInAction(() => {
        this.data = valves.map((item: any) => ({
          bovnumber: item.bovnumber || '',
          wonumber: item.wonumber || '',
          dategeocoded: item.dategeocoded || '',
          size: item.size || '',
          status_remarks: item.status_remarks || '',
          date_commissioned: item.date_commissioned || '',
          location: item.location || '',
          brgycode: item.brgycode || '',
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
