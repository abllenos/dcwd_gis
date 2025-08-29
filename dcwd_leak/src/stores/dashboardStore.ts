import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

export interface Report {
  id: number;
  date_time_reported: string;
  leak_type: string;
  ref_meter: string;
  address?: string;
  status: string;
  dispatchStat?: number; 
}

class DashboardStore {
  reports: Report[] = [];
  loading = false;

  page = 1;
  pageSize = 5;
  total = 0; 

  summary: {
    total: number;
    dispatched: number;
    pending: number;
    byStatus: Record<string, number>;
  } = { total: 0, dispatched: 0, pending: 0, byStatus: {} };

  allReports: Report[] = [];
  allReportsLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  private getStatusText(stat: number): string {
    switch (stat) {
      case 1: return "Un-Dispatch";
      case 2: return "Dispatched";
      case 3: return "Repaired";
      case 4: return "For Schedule";
      case 5: return "For Turn over";
      case 6: return "After The Meter Leak";
      default: return "Unknown";
    }
  }

  private getLeakType(typeid?: number): string {
    switch (typeid) {
        case 1: return "Un-Identified";
        case 2: return "ServiceLine";
        case 3: return "Mainline";
        case 4: return "Others";
        default: return "N/A";
    }
  }

  private mapRawReports(raw: any[]): Report[] {
        return raw.map((item: any) => ({
            id: item.spool_ID,
            date_time_reported: item.dT_Reported ? new Date(item.dT_Reported).toLocaleString() : "",
            leak_type: this.getLeakType(Number(item.typeid)), 
            ref_meter: item.nearestMeter || item.refAccNo || "N/A",
            address: item.address || "N/A",
            status: this.getStatusText(item.dispatchStat),
            dispatchStat: item.dispatchStat,
        }));
        }

  private computeSummary(source: Report[], totalFromApi?: number) {
    const byStatus = source.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});

    const dispatched = source.filter(r => r.dispatchStat === 2).length;
    const pending = source.filter(r => r.dispatchStat === 1).length;

    const total = totalFromApi ?? source.length;

    return { total, dispatched, pending, byStatus };
  }

  async fetchInitial() {
    this.loading = true;
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/LeakReports/GetLeakReports",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            PageIndex: this.page,
            PageSize: this.pageSize,
          },
        }
      );

      const raw = res?.data?.data?.data || [];
      const totalCount = res?.data?.data?.totalCount ?? res?.data?.data?.count ?? 0;

      const mapped = this.mapRawReports(raw);

      const tempSummary = this.computeSummary(mapped, totalCount);

      runInAction(() => {
        this.reports = mapped;
        this.total = totalCount;
        this.summary = tempSummary;
        this.loading = false;
      });
      this.fetchAllReports(true);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchReportsPage() {
    this.loading = true;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/LeakReports/GetLeakReports",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            PageIndex: this.page,
            PageSize: this.pageSize,
          },
        }
      );

      const raw = res?.data?.data?.data || [];
      const totalCount = res?.data?.data?.totalCount ?? res?.data?.data?.count ?? 0;
      const mapped = this.mapRawReports(raw);

      runInAction(() => {
        this.reports = mapped;
        this.total = totalCount;
        this.loading = false;
      });
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchAllReports(recomputeAfter = false) {
    if (this.allReportsLoaded) {
      if (recomputeAfter) {
        runInAction(() => {
          this.summary = this.computeSummary(this.allReports);
          this.total = this.allReports.length;
        });
      }
      return;
    }

    this.loading = true;

    try {
      const token = localStorage.getItem("token");
      let page = 1;
      let all: Report[] = [];
      let totalCountFromApi = 0;

      while (true) {
        const res = await axios.get(
          "https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/LeakReports/GetLeakReports",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              PageIndex: page,
              PageSize: this.pageSize, 
            },
          }
        );

        const raw = res?.data?.data?.data || [];
        totalCountFromApi = res?.data?.data?.totalCount ?? res?.data?.data?.count ?? totalCountFromApi;

        all = all.concat(this.mapRawReports(raw));

        if (page * this.pageSize >= totalCountFromApi) break;
        page++;
      }

      runInAction(() => {
        this.allReports = all;
        this.allReportsLoaded = true;

        if (recomputeAfter) {
          this.summary = this.computeSummary(this.allReports);
          this.total = this.allReports.length; 
        }
      });
    } catch (err) {
      console.error("Failed to fetch all reports:", err);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  get monthlyReports() {
    const grouped: Record<string, number> = {};
    const source = this.allReportsLoaded ? this.allReports : this.reports;

    source.forEach((r) => {
      if (!r.date_time_reported) return;
      const date = new Date(r.date_time_reported);
      if (isNaN(date.getTime())) return;
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;
      grouped[key] = (grouped[key] || 0) + 1;
    });

    const today = new Date();
    const months: { year: number; month: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth() });
    }

    return months.map(({ year, month }) => {
      const key = `${year}-${month}`;
      const date = new Date(year, month);
      return {
        name: `${date.toLocaleString("default", { month: "short" })} ${year}`,
        reports: grouped[key] || 0,
      };
    });
  }

  setPage(page: number, pageSize?: number) {
    this.page = page;
    if (pageSize) this.pageSize = pageSize;
    this.fetchReportsPage();
  }
}

export const dashboardStore = new DashboardStore();
