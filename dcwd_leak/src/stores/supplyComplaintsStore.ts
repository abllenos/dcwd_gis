import { makeAutoObservable } from "mobx";

export interface ComplaintData {
  key: string;
  id: string;
  accountNumber?: string;
  location: string;
  remarks: string;
  referenceMeter: string;
  contactNo: string;
  dateTimeReported: string;
  status?: string;
}

export class SupplyComplaintsStore {
  data: ComplaintData[] = [];
  loading = false;
  activeTab = "reports";
  searchText = "";
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  tabCounts: Record<string, number> = {};

  constructor() {
    makeAutoObservable(this);
    this.initializeMockData();
  }

  initializeMockData() {
    // Mock data for supply complaints
    const reportData: ComplaintData[] = [
      {
        key: '1',
        id: '20124',
        location: 'Zone 1 - Barangay A',
        remarks: 'Low pressure in area',
        referenceMeter: 'RM-123456',
        contactNo: '09171234567',
        dateTimeReported: 'Jul 28, 2025 09:00 AM',
        status: 'reports'
      },
      {
        key: '2',
        id: '20125',
        location: 'Zone 2 - Barangay B',
        remarks: 'No water supply since yesterday',
        referenceMeter: 'RM-123457',
        contactNo: '09171234568',
        dateTimeReported: 'Jul 28, 2025 10:30 AM',
        status: 'reports'
      }
    ];

    const onProcessData: ComplaintData[] = [
      {
        key: '3',
        id: '20142',
        location: 'Zone 3 - Barangay B',
        remarks: 'No water since last night',
        referenceMeter: 'RM-654321',
        contactNo: '09981234567',
        dateTimeReported: 'Jul 28, 2025 10:30 AM',
        status: 'onprocess'
      }
    ];

    const completedData: ComplaintData[] = [
      {
        key: '4',
        id: '20167',
        location: 'Zone 4 - Barangay C',
        remarks: 'Resolved pressure issue',
        referenceMeter: 'RM-789123',
        contactNo: '09081234567',
        dateTimeReported: 'Jul 28, 2025 08:15 AM',
        status: 'completed'
      }
    ];

    this.data = [...reportData, ...onProcessData, ...completedData];
    this.total = this.data.length;
    this.tabCounts = {
      reports: reportData.length,
      onprocess: onProcessData.length,
      completed: completedData.length
    };
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

  fetchData() {
    this.loading = true;
    
    // Simulate API call
    setTimeout(() => {
      let filteredData = this.data;
      
      // Filter by active tab
      if (this.activeTab !== 'all') {
        filteredData = this.data.filter(item => item.status === this.activeTab);
      }
      
      // Apply search filter
      if (this.searchText) {
        filteredData = filteredData.filter(item => 
          item.location.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.remarks.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.id.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }
      
      this.data = filteredData;
      this.total = filteredData.length;
      this.loading = false;
    }, 500);
  }

  fetchCounts() {
    // Counts are already set in initializeMockData
  }
}

export const supplyComplaintsStore = new SupplyComplaintsStore();
