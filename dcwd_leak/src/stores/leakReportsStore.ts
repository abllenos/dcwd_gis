import { makeAutoObservable, runInAction } from "mobx";
import type { LeakData } from "../types/Leakdata";
import { devApi } from "../components/Endpoints/Interceptor";

const tabFilters: Record<string, { dispatchStat: number; flgLeakDetection?: number } | null> = {
  all: null, // null means fetch all statuses
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
          if (key === "all") {
            const res = await devApi.get("/dcwd-gis/api/v1/admin/LeakReports/GetLeakReports", { 
              params: { PageIndex: 1, PageSize: 1 }
            });
            counts[key] = res.data.data.totalCount || res.data.data.count || 0;
          } else if (filter) {
            const params: Record<string, number> = {
              dispatchStat: filter.dispatchStat,
              pageIndex: 1,
              pageSize: 1,
            };
            if (filter.flgLeakDetection !== undefined) {
              params.flgLeakDetection = filter.flgLeakDetection;
            }
            
            try {
              const res = await devApi.get("/dcwd-gis/api/v1/admin/LeakReports/GetLeakReportsFiltered", { params });
              counts[key] = res.data.data.totalCount || res.data.data.count || 0;
              
              if (key === "leakdetection" && counts[key] === 0) {
                const fallbackRes = await devApi.get("/dcwd-gis/api/v1/admin/LeakReports/GetLeakReports", { 
                  params: { PageIndex: 1, PageSize: 100 }
                });
                
                if (fallbackRes?.data?.data?.data) {
                  const allData = fallbackRes.data.data.data;
                  const leakDetectionCount = allData.filter((item: any) => 
                    item.dispatchStat === 1 && item.flgLeakDetection === 1
                  ).length;
                  
                  if (leakDetectionCount === 0) {
                    const alternativeCount = allData.filter((item: any) => item.flgLeakDetection === 1).length;
                    counts[key] = alternativeCount;
                  } else {
                    counts[key] = leakDetectionCount;
                  }
                }
              }
            } catch (apiError) {
              counts[key] = 0;
            }
          }
        } catch (err) {
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
      let res;
      
      if (this.activeTab === "all") {
        res = await devApi.get("/dcwd-gis/api/v1/admin/LeakReports/GetLeakReports", {
          params: {
            PageIndex: this.pageIndex,
            PageSize: this.pageSize,
          }
        });
      } else {
        const filter = tabFilters[this.activeTab];
        if (filter) {
          const params: Record<string, number> = {
            dispatchStat: filter.dispatchStat,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
          };
          if (filter.flgLeakDetection !== undefined) {
            params.flgLeakDetection = filter.flgLeakDetection;
          }
          
          
          res = await devApi.get("/dcwd-gis/api/v1/admin/LeakReports/GetLeakReportsFiltered", {params});
          
          
          if (this.activeTab === "leakdetection" && (!res?.data?.data?.data || res.data.data.data.length === 0)) {
            
            const fallbackRes = await devApi.get("/dcwd-gis/api/v1/admin/LeakReports/GetLeakReports", {
              params: { PageIndex: 1, PageSize: 100 }
            });
            
            if (fallbackRes?.data?.data?.data) {
              const allData = fallbackRes.data.data.data;
              
              const filteredData = allData.filter((item: any) => 
                item.dispatchStat === 1 && item.flgLeakDetection === 1
              );
              
              
              if (filteredData.length > 0) {
                res = {
                  data: {
                    data: {
                      data: filteredData,
                      totalCount: filteredData.length,
                      count: filteredData.length
                    }
                  }
                };
              } else {
                const flgValues = [...new Set(allData.map((item: any) => item.flgLeakDetection))];
                const dispatchValues = [...new Set(allData.map((item: any) => item.dispatchStat))];
                
                const alternativeFiltered = allData.filter((item: any) => item.flgLeakDetection === 1);
                
                if (alternativeFiltered.length > 0) {
                  res = {
                    data: {
                      data: {
                        data: alternativeFiltered,
                        totalCount: alternativeFiltered.length,
                        count: alternativeFiltered.length
                      }
                    }
                  };
                  console.log("Using alternative filtering (only flgLeakDetection=1)");
                }
              }
            }
          }
        }
      }

      const apiData = res?.data?.data;
      if (apiData) {
        runInAction(() => {
          this.total = apiData.totalCount || apiData.count;
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
            status: this.getStatusFromDispatchStat(item.dispatchStat, item.flgLeakDetection),
          }));
        });
      }
    } catch (error) {
      console.error("Error fetching leak reports", error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  }

  getStatusFromDispatchStat(dispatchStat: number, flgLeakDetection: number): string {
    switch (dispatchStat) {
      case 1: return "Undispatched";
      case 2: return "Dispatched";
      case 3: return "Repaired";
      case 4: return "For Schedule";
      case 5: return "For Turnover";
      case 6: return "After the meter link";
      default: return "Unknown";
    }
  }
}

export const leakReportsStore = new LeakReportsStore();
