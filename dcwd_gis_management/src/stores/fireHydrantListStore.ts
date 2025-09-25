
import { makeAutoObservable } from "mobx";
import type { TablePaginationConfig } from "antd/es/table";
import { apiGis } from "../components/endpoints/Interceptor";

export interface FireHydrant {
  assetid: string;
  location: string;
  barangay: string;
  size: string;
  type_description: string;
  remarks: string;
}

class FireHydrantListStore {
  data: FireHydrant[] = [];
  loading = false;
  error: any = null;
  searchText = "";
  pagination: TablePaginationConfig = { current: 1, pageSize: 10 };

  constructor() {
    makeAutoObservable(this);
  }

  setSearchText(val: string) {
    this.searchText = val;
  }
  setPagination(val: TablePaginationConfig) {
    this.pagination = val;
  }

  setData(data: FireHydrant[]) {
    this.data = data;
  }
  setLoading(loading: boolean) {
    this.loading = loading;
  }
  setError(error: any) {
    this.error = error;
  }

  async fetchData() {
    this.setLoading(true);
    this.setError(null);
    try {
      // Use leading slash for Vite proxy
      const res = await apiGis.get("/helpers/gis/mgtsys/getLayers/getFirehydrant.php");
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      this.setData(data);
    } catch (err) {
      this.setError(err);
    } finally {
      this.setLoading(false);
    }
  }

  get filteredData() {
    const lowerValue = this.searchText.toLowerCase();
    return this.data.filter((firehydrant) =>
      (firehydrant.assetid?.toLowerCase() ?? "").includes(lowerValue) ||
      (firehydrant.location?.toLowerCase() ?? "").includes(lowerValue) ||
      (firehydrant.barangay?.toLowerCase() ?? "").includes(lowerValue) ||
      (firehydrant.size?.toString() ?? "").includes(lowerValue) ||
      (firehydrant.type_description?.toLowerCase() ?? "").includes(lowerValue) ||
      (firehydrant.remarks?.toLowerCase() ?? "").includes(lowerValue)
    );
  }
}

export const fireHydrantListStore = new FireHydrantListStore();
