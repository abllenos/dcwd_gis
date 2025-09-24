import { makeAutoObservable } from "mobx";

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




  // computeSummary removed (unused) to satisfy strict unused checks


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

}

export const dashboardStore = new DashboardStore();
