import { makeAutoObservable } from "mobx";

export interface ReportFile {
  id: number;
  fileName: string;
  displayName: string;
  description: string;
  fileSize: string;
  uploadDate: string;
  category: ReportCategory;
  filePath: string; // Path to the actual file
}

export type ReportCategory = 
  | 'Infrastructure' 
  | 'Customer' 
  | 'Performance' 
  | 'Maintenance' 
  | 'GIS Analysis' 
  | 'System Reports';

export type ReportFilter = 'all' | 'infrastructure' | 'customer' | 'performance' | 'maintenance' | 'gis' | 'system';

export interface ReportStats {
  total: number;
  byCategory: Record<ReportCategory, number>;
  totalFileSize: string;
  latestUploadDate: string;
}

class ReportsStore {
  // Available reports data - populated from actual files in public/reports folder
  localReports: ReportFile[] = [];

  // Filter state
  selectedCategory: ReportFilter = 'all';

  // UI state
  loading = false;
  error: string | null = null;
  downloadingReportId: number | null = null;

  constructor() {
    makeAutoObservable(this);
    // Load local reports on initialization
    this.loadLocalReports();
  }

  // Computed property to get reports from local files only
  get reports(): ReportFile[] {
    return this.localReports;
  }

  // Method to load reports from the actual public/reports folder
  private async loadLocalReports(): Promise<void> {
    try {
      // Define the known files from the public/reports folder
      const knownFiles = [
        {
          fileName: 'CPDPipelineCostAnalysis_2025-09-23.csv',
          displayName: 'CPD Pipeline Cost Analysis',
          description: 'Comprehensive cost analysis of pipeline infrastructure for September 2025',
          category: 'Infrastructure' as ReportCategory,
          uploadDate: '2025-09-23'
        },
        {
          fileName: 'CustomerListing_Zone01_2025-09-23.csv',
          displayName: 'Customer Listing - Zone 01',
          description: 'Complete customer listing for Zone 01 as of September 2025',
          category: 'Customer' as ReportCategory,
          uploadDate: '2025-09-23'
        },
        {
          fileName: 'report_1_sample.txt',
          displayName: 'Sample Report 1',
          description: 'Sample text report for testing purposes',
          category: 'System Reports' as ReportCategory,
          uploadDate: '2025-09-24'
        },
        {
          fileName: 'report_2_sample.txt',
          displayName: 'Sample Report 2', 
          description: 'Second sample text report for testing purposes',
          category: 'System Reports' as ReportCategory,
          uploadDate: '2025-09-24'
        }
      ];

      // Convert known files to ReportFile objects
      this.localReports = knownFiles.map((file, index) => ({
        id: index + 1,
        fileName: file.fileName,
        displayName: file.displayName,
        description: file.description,
        fileSize: '0.5 MB', // Default size since we can't get actual file size from public folder
        uploadDate: file.uploadDate,
        category: file.category,
        filePath: `/reports/${file.fileName}`
      }));

    } catch (error) {
      console.error('Error loading local reports:', error);
      this.setError('Failed to load local reports');
    }
  }

  // Actions for filtering
  setSelectedCategory = (category: ReportFilter) => {
    this.selectedCategory = category;
  };

  // Actions for local report management
  addLocalReport = (reportData: Omit<ReportFile, 'id'>) => {
    const newReport: ReportFile = {
      id: Math.max(...this.localReports.map(r => r.id), 0) + 1,
      ...reportData
    };
    this.localReports.push(newReport);
  };

  removeLocalReport = (reportId: number) => {
    this.localReports = this.localReports.filter(report => report.id !== reportId);
  };

  updateLocalReport = (reportId: number, updates: Partial<ReportFile>) => {
    const reportIndex = this.localReports.findIndex(report => report.id === reportId);
    if (reportIndex !== -1) {
      this.localReports[reportIndex] = { ...this.localReports[reportIndex], ...updates };
    }
  };

  // Actions for download operations
  downloadReport = async (report: ReportFile) => {
    this.downloadingReportId = report.id;
    this.error = null;

    try {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = report.filePath;
      link.download = report.fileName;
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log(`Downloading: ${report.displayName} (${report.fileName})`);
      
      // Simulate download delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      this.error = `Failed to download ${report.displayName}`;
      console.error('Download error:', error);
    } finally {
      this.downloadingReportId = null;
    }
  };

  viewReport = (report: ReportFile) => {
    try {
      window.open(report.filePath, '_blank');
      console.log(`Viewing: ${report.displayName} (${report.fileName})`);
    } catch (error) {
      this.error = `Failed to open ${report.displayName}`;
      console.error('View error:', error);
    }
  };

  // Utility methods
  getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'csv':
        return '📊';
      case 'pdf':
        return '📄';
      case 'xlsx':
      case 'xls':
        return '📈';
      case 'docx':
      case 'doc':
        return '📝';
      case 'txt':
        return '📄';
      default:
        return '📋';
    }
  };

  // UI state actions
  setLoading = (loading: boolean) => {
    this.loading = loading;
  };

  setError = (error: string | null) => {
    this.error = error;
  };

  clearError = () => {
    this.error = null;
  };

  // Computed values
  get filteredReports() {
    if (this.selectedCategory === 'all') {
      return this.reports;
    }
    
    return this.reports.filter(report => 
      report.category.toLowerCase() === this.selectedCategory.toLowerCase()
    );
  }

  get reportStats(): ReportStats {
    const byCategory: Record<ReportCategory, number> = {
      'Infrastructure': 0,
      'Customer': 0,
      'Performance': 0,
      'Maintenance': 0,
      'GIS Analysis': 0,
      'System Reports': 0
    };

    this.reports.forEach(report => {
      byCategory[report.category]++;
    });

    const totalFileSize = this.calculateTotalFileSize();
    const latestUploadDate = this.getLatestUploadDate();

    return {
      total: this.reports.length,
      byCategory,
      totalFileSize,
      latestUploadDate
    };
  }

  get availableCategories(): Array<{ value: ReportFilter; label: string }> {
    return [
      { value: 'all', label: 'All Categories' },
      { value: 'infrastructure', label: 'Infrastructure' },
      { value: 'customer', label: 'Customer Reports' },
      { value: 'performance', label: 'Performance' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'gis', label: 'GIS Analysis' },
      { value: 'system', label: 'System Reports' }
    ];
  }

  get filteredReportsCount() {
    return this.filteredReports.length;
  }

  get isDownloading() {
    return this.downloadingReportId !== null;
  }

  // Helper methods for computed values
  private calculateTotalFileSize = (): string => {
    // Simple calculation - in real app you'd parse the actual file sizes
    const totalMB = this.reports.reduce((total, report) => {
      const sizeMatch = report.fileSize.match(/(\d+\.?\d*)/);
      const size = sizeMatch ? parseFloat(sizeMatch[1]) : 0;
      return total + size;
    }, 0);

    return `${totalMB.toFixed(1)} MB`;
  };

  private getLatestUploadDate = (): string => {
    if (this.reports.length === 0) return '';
    
    const latestDate = this.reports.reduce((latest, report) => {
      return new Date(report.uploadDate) > new Date(latest) ? report.uploadDate : latest;
    }, this.reports[0].uploadDate);

    return latestDate;
  };

  // Load reports from local files
  fetchReports = async () => {
    this.setLoading(true);
    this.setError(null);
    
    try {
      await this.loadLocalReports();
      console.log(`Loaded ${this.localReports.length} local reports`);
    } catch (error: any) {
      this.setError('Failed to load local reports');
      console.error('Error fetching reports:', error);
    } finally {
      this.setLoading(false);
    }
  };

  refreshReports = async () => {
    await this.fetchReports();
  };

  uploadReport = async (file: File, metadata: Omit<ReportFile, 'id' | 'fileName' | 'fileSize' | 'filePath'>) => {
    this.setLoading(true);
    this.setError(null);
    
    try {
      // TODO: Implement API call to upload report
      // const uploadedReport = await reportsApiService.uploadReport(file, metadata);
      
      // For now, simulate upload by adding to local reports
      const newReport: ReportFile = {
        id: Math.max(...this.localReports.map(r => r.id), 0) + 1,
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        filePath: `/reports/${file.name}`,
        ...metadata
      };
      
      this.localReports.push(newReport);
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
      
    } catch (error) {
      this.setError('Failed to upload report');
      console.error('Error uploading report:', error);
    } finally {
      this.setLoading(false);
    }
  };
}

// Create and export singleton instance
export const reportsStore = new ReportsStore();