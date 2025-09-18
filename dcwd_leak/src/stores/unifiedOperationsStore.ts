import { makeAutoObservable } from "mobx";
import { leakReportsStore } from "./leakReportsStore";
import { supplyComplaintsStore } from "./supplyComplaintsStore";
import { qualityComplaintsStore } from "./qualityComplaintsStore";
import type { LeakData } from "../types/Leakdata";
import type { ComplaintData as SupplyComplaintData } from "./supplyComplaintsStore";
import type { QualityComplaintData } from "./qualityComplaintsStore";

// Operation Types
export enum OperationType {
  LEAK_REPORTS = "leak-reports",
  SUPPLY_COMPLAINTS = "supply-complaints", 
  QUALITY_COMPLAINTS = "quality-complaints"
}

// Status configurations for each operation type
export const operationConfigs = {
  [OperationType.LEAK_REPORTS]: {
    title: "Leak Reports",
    statuses: {
      customer: "Customer Reports",
      leakdetection: "Leak Detection", 
      dispatched: "Dispatched",
      repaired: "Repaired Leaks",
      scheduled: "Repair Scheduled",
      turnover: "Repair Turn-over",
      after: "Leak After the Meter",
      notfound: "Leak Not Found",
      all: "All Reports"
    }
  },
  [OperationType.SUPPLY_COMPLAINTS]: {
    title: "Supply Complaints",
    statuses: {
      reports: "New Reports",
      onprocess: "On-Process", 
      completed: "Completed"
    }
  },
  [OperationType.QUALITY_COMPLAINTS]: {
    title: "Quality Complaints",
    statuses: {
      reports: "New Reports",
      onprocess: "On-Process",
      completed: "Completed"
    }
  }
};

// Union type for all data types
export type UnifiedData = LeakData | SupplyComplaintData | QualityComplaintData;

class UnifiedOperationsStore {
  activeOperation: OperationType = OperationType.LEAK_REPORTS;
  activeStatus: string = "customer";
  searchText: string = "";
  complaintModalVisible: boolean = false;
  selectedComplaint: SupplyComplaintData | QualityComplaintData | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Computed getters
  get currentConfig() {
    return operationConfigs[this.activeOperation];
  }

  get currentStore() {
    switch (this.activeOperation) {
      case OperationType.LEAK_REPORTS:
        return leakReportsStore;
      case OperationType.SUPPLY_COMPLAINTS:
        return supplyComplaintsStore;
      case OperationType.QUALITY_COMPLAINTS:
        return qualityComplaintsStore;
      default:
        return leakReportsStore;
    }
  }

  get data(): UnifiedData[] {
    return this.currentStore.data;
  }

  get loading(): boolean {
    return this.currentStore.loading;
  }

  get statusCounts() {
    return this.currentStore.tabCounts;
  }

  get pagination() {
    const store = this.currentStore;
    return {
      current: store.pageIndex,
      pageSize: store.pageSize,
      total: store.total
    };
  }

  // Actions
  setActiveOperation = (operation: OperationType) => {
    this.activeOperation = operation;
    // Reset to first status when changing operations
    const firstStatus = Object.keys(this.currentConfig.statuses)[0];
    this.setActiveStatus(firstStatus);
    
    // Fetch data for the new operation
    this.fetchData();
  };

  setActiveStatus = (status: string) => {
    this.activeStatus = status;
    this.currentStore.setActiveTab(status);
  };

  setSearchText = (text: string) => {
    this.searchText = text;
  };

  setComplaintModal = (visible: boolean, complaint?: SupplyComplaintData | QualityComplaintData | null) => {
    this.complaintModalVisible = visible;
    this.selectedComplaint = complaint || null;
  };

  setPagination = (page: number, size?: number) => {
    this.currentStore.setPagination(page, size || this.currentStore.pageSize);
  };

  fetchData = () => {
    const store = this.currentStore;
    store.fetchCounts();
    store.fetchData();
  };

  // Initialize the store
  initialize = () => {
    this.fetchData();
  };
}

export const unifiedOperationsStore = new UnifiedOperationsStore();