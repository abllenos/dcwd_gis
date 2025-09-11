import { makeAutoObservable } from "mobx";

export interface QualityComplaintData {
  key: string;
  id: string;
  accountNumber: string;
  location: string;
  remarks: string;
  referenceMeter: string;
  contactNo: string;
  dateTimeReported: string;
  status?: string;
}

export class QualityComplaintsStore {
  data: QualityComplaintData[] = [];
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
    // Mock data for quality complaints
    const reportData: QualityComplaintData[] = [
      {
        key: '1',
        id: '30124',
        accountNumber: '1231-0011-112351',
        location: 'Zone 2 - Barangay D',
        remarks: 'Water has unusual odor',
        referenceMeter: 'RM-543210',
        contactNo: '09180001111',
        dateTimeReported: 'Jul 29, 2025 08:45 AM',
        status: 'reports'
      },
      {
        key: '2',
        id: '30125',
        accountNumber: '1231-0011-112352',
        location: 'Zone 3 - Barangay E',
        remarks: 'Water tastes salty',
        referenceMeter: 'RM-543211',
        contactNo: '09180001112',
        dateTimeReported: 'Jul 29, 2025 09:15 AM',
        status: 'reports'
      }
    ];

    const onProcessData: QualityComplaintData[] = [
      {
        key: '3',
        id: '30125',
        accountNumber: '3221-51321-71523',
        location: 'Zone 5 - Barangay E',
        remarks: 'Discoloration in tap water',
        referenceMeter: 'RM-678901',
        contactNo: '09990002222',
        dateTimeReported: 'Jul 29, 2025 11:20 AM',
        status: 'onprocess'
      }
    ];

    const completedData: QualityComplaintData[] = [
      {
        key: '4',
        id: '30135',
        accountNumber: '5551-31311-61511',
        location: 'Zone 6 - Barangay F',
        remarks: 'Resolved chlorine taste issue',
        referenceMeter: 'RM-901234',
        contactNo: '09770003333',
        dateTimeReported: 'Jul 29, 2025 07:30 AM',
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
          item.id.toLowerCase().includes(this.searchText.toLowerCase()) ||
          item.accountNumber.toLowerCase().includes(this.searchText.toLowerCase())
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

export const qualityComplaintsStore = new QualityComplaintsStore();
