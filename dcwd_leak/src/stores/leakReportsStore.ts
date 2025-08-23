import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import type { LeakData } from "../types/Leakdata";

const tabFilters: Record<string, { dispatchStat: number; flgLeakDetection?: number }> = {
  customer: { dispatchStat: 1, flgLeakDetection: 0 },
  leakdetection: { dispatchStat: 1, flgLeakDetection: 1 },
  dispatched: { dispatchStat: 2 },
  repaired: { dispatchStat: 3 },
  scheduled: { dispatchStat: 4 },
  turnover: { dispatchStat: 5 },
  after: { dispatchStat: 6 },
  notfound: { dispatchStat: 7 },
};

export class LeakReportsStore {
  data: LeakData[] = [];
  loading = false;
  activeTab = "customer";
  searchText = "";
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  tabCounts: Record<string, number> = {};
  modalVisible = false;
  modalTitle = "";
  selectedRecord: LeakData | null = null;
  formValues: Partial<LeakData> = {};
  imageModalVisible = false;
  imageUrls: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.fetchData();
  }

  setSearchText(text: string) {
    this.searchText = text;
  }

  setPagination(page: number, size: number) {
    this.pageIndex = page;
    this.pageSize = size;
    this.fetchData();
  }

  showModal(title: string, record?: LeakData) {
    this.modalTitle = title;
    this.selectedRecord = record ?? null;
    if (title === "Update Report" && record) {
      this.formValues = { ...record, id: String(record.id) };
    }
    this.modalVisible = true;
  }

  hideModal() {
    this.modalVisible = false;
    this.formValues = {};
    this.selectedRecord = null;
  }

  setFormValue<K extends keyof LeakData>(field: K, value: LeakData[K]) {
  this.formValues[field] = value;
}

  setImageModal(visible: boolean, urls: string[] = []) {
    this.imageModalVisible = visible;
    this.imageUrls = urls;
  }

  async fetchCounts() {
    const counts: Record<string, number> = {};
    await Promise.all(
      Object.entries(tabFilters).map(async ([key, filter]) => {
        try {
          const params: Record<string, number> = {
            dispatchStat: filter.dispatchStat,
            pageIndex: 1,
            pageSize: 1,
          };
          if (filter.flgLeakDetection !== undefined) {
            params.flgLeakDetection = filter.flgLeakDetection;
          }
          const res = await axios.get(
            "https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/LeakReports/GetLeakReportsFiltered",
            { params }
          );
          counts[key] = res.data.data.count || 0;
        } catch (err) {
          console.error(`Error fetching count for ${key}`, err);
          counts[key] = 0;
        }
      })
    );
    runInAction(() => {
      this.tabCounts = counts;
    });
  }

  async fetchData() {
    this.loading = true;
    try {
      const filter = tabFilters[this.activeTab];
      const params: Record<string, number> = {
        dispatchStat: filter.dispatchStat,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      };
      if (filter.flgLeakDetection !== undefined) {
        params.flgLeakDetection = filter.flgLeakDetection;
      }

      const res = await axios.get(
        "https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/LeakReports/GetLeakReportsFiltered",
        { params }
      );

      const apiData = res.data.data;
      runInAction(() => {
        this.total = apiData.count;
        this.data = apiData.data.map((item: any) => ({
          id: String(item.spool_ID),
          leakType: item.typeid,
          location: item.address,
          landmark: item.landmark,
          referenceMeter: item.nearestMtrAccNo || item.nearestMeter,
          contactNo: item.mobileNo,
          dateReported: item.dT_Reported,
          referenceNo: item.refAccNo,
          dispatchStat: item.dispatchStat,
          flgLeakDetection: item.flgLeakDetection,
        }));
      });
    } catch (error) {
      console.error("Error fetching leak reports", error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  }
}

export const leakReportsStore = new LeakReportsStore();
