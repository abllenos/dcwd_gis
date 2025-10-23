import { makeAutoObservable } from "mobx";
import { licenseStore } from "./licenseStore";
import type { RegisteredUser } from "./licenseStore";

export type MapLayerType = 'googleMaps' | 'googleSatellite' | 'googleHybrid' | 'googleTerrain';

// Constants
const DEFAULTS = {
  PAGE_SIZE: 10,
  CURRENT_PAGE: 1,
  ZOOM_LEVEL: 14,
  FOCUS_ZOOM: 16,
  COORDINATE_RADIUS: 0.05, // 5km radius
  MAX_VISIBLE_PAGES: 3,
};


const DAVAO_CENTER: [number, number] = [7.0731, 125.6128];
// Davao City bounding box (approximate)
export const DAVAO_CITY_BOUNDS: { sw: [number, number]; ne: [number, number] } = {
  sw: [6.9600, 125.4800], // Southwest corner
  ne: [7.2000, 125.7000]  // Northeast corner
};

const STATUS_OPTIONS: Array<'online' | 'offline' | 'unknown'> = ['online', 'online', 'online', 'offline', 'unknown'];

export interface VTSUser {
  key: number;
  id: number;
  software: string;
  deviceName: string;
  department: string;
  userId: string;
  installationDate: string;
  // VTS specific properties
  coordinates?: [number, number]; // lat, lng for map positioning
  lastSeen?: string;
  status?: 'online' | 'offline' | 'unknown';
  isActive?: boolean; // Separate boolean for active/inactive state
}

export interface MapState {
  center: [number, number];
  zoom: number;
  currentLayer: MapLayerType;
  initialized: boolean;
  selectedUserId: number | null;
}

class VTSStore {
  // User management
  users: VTSUser[] = [];
  filteredUsers: VTSUser[] = [];
  selectedUser: VTSUser | null = null;
  
  // Search and filters
  searchText = '';
  
  // Pagination
  pageSize = DEFAULTS.PAGE_SIZE;
  currentPage = DEFAULTS.CURRENT_PAGE;
  
  // UI State - Employee Selection
  selectedEmployeeId: number | null = null;
  selectedEmployee: any | null = null;
  
  // Map layer selection
  mapLayer: MapLayerType = 'googleMaps';
  
  // Map state
  mapState: MapState = {
    center: DAVAO_CENTER,
    zoom: DEFAULTS.ZOOM_LEVEL,
    currentLayer: 'googleMaps',
    initialized: false,
    selectedUserId: null
  };
  
  // UI state
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    // Only load our 10 sample users
    this.initializeSampleUsers();
  }

  // Convert license store users to VTS users with additional properties
  private convertLicenseUsersToVTSUsers = (licenseUsers: RegisteredUser[]): VTSUser[] => {
    return licenseUsers.map((user, index) => ({
      key: user.id || index + 1,
      id: user.id || index + 1,
      software: user.software,
      deviceName: user.deviceName || `DCWD-WS-${String(index + 1).padStart(3, '0')}`,
      department: user.department,
      userId: user.userId || `user${String(index + 1).padStart(3, '0')}`,
      installationDate: user.installationDate || new Date().toISOString().split('T')[0],
      // Generate random coordinates around Davao City for mapping
      coordinates: this.generateRandomCoordinates(),
      lastSeen: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: this.getRandomStatus(),
      isActive: true // Default to active for all license users
    }));
  };

  // Utility methods
  private generateRandomCoordinates = (): [number, number] => [
    DAVAO_CENTER[0] + (Math.random() - 0.5) * DEFAULTS.COORDINATE_RADIUS,
    DAVAO_CENTER[1] + (Math.random() - 0.5) * DEFAULTS.COORDINATE_RADIUS
  ];

  private getRandomStatus = () => STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)];



  // Fallback sample data with 10 fake employees with live locations
  private initializeSampleUsers = () => {
    const fakeEmployees = [
      { userId: 'EMP001', coordinates: [7.0731, 125.6128] as [number, number], status: 'online' as const }, // Downtown Poblacion (City Hall area)
      { userId: 'EMP002', coordinates: [7.1056, 125.6289] as [number, number], status: 'online' as const }, // Buhangin (residential area)
      { userId: 'EMP003', coordinates: [7.1689, 125.4889] as [number, number], status: 'offline' as const }, // Calinan (town center)
      { userId: 'EMP004', coordinates: [7.0856, 125.5234] as [number, number], status: 'online' as const }, // Mintal (commercial area)
      { userId: 'EMP005', coordinates: [7.0912, 125.5845] as [number, number], status: 'unknown' as const }, // Tugbok (moved further inland)
      { userId: 'EMP006', coordinates: [7.0445, 125.5912] as [number, number], status: 'online' as const }, // Talomo (moved inland from coast)
      { userId: 'EMP007', coordinates: [7.1267, 125.5823] as [number, number], status: 'offline' as const }, // Marilog (district center)
      { userId: 'EMP008', coordinates: [7.0823, 125.6034] as [number, number], status: 'online' as const }, // Agdao (moved inland)
      { userId: 'EMP009', coordinates: [7.0934, 125.5989] as [number, number], status: 'unknown' as const }, // Ma-a (inland area)
      { userId: 'EMP010', coordinates: [7.1123, 125.6167] as [number, number], status: 'online' as const }  // Panacan (moved inland from coast)
    ];

    this.users = fakeEmployees.map((emp, index) => ({
      key: index + 1,
      id: index + 1,
      software: 'VTS Tracker',
      deviceName: `DCWD-MOBILE-${String(index + 1).padStart(3, '0')}`,
      department: 'Field Operations',
      userId: emp.userId,
      installationDate: new Date().toISOString().split('T')[0],
      status: emp.status,
      isActive: true,
      coordinates: emp.coordinates,
      lastSeen: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }));
    this.filteredUsers = [...this.users];
  };

  // Actions for user management
  addUser = (userData: Omit<VTSUser, 'key' | 'id'>) => {
    const newUser: VTSUser = {
      key: Date.now() + Math.random(),
      id: this.users.length + 1,
      status: 'online',
      isActive: true,
      ...userData
    };
    
    this.users.push(newUser);
    this.updateFilteredUsers();
  };

  removeUser = (userId: number) => {
    this.users = this.users.filter(user => user.id !== userId);
    this.updateFilteredUsers();
  };

  updateUser = (userId: number, updates: Partial<VTSUser>) => {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
      this.updateFilteredUsers();
    }
  };

  setSelectedUser = (user: VTSUser | null) => {
    this.selectedUser = user;
    this.mapState.selectedUserId = user?.id || null;
  };

  // Actions for search and filtering
  setSearchText = (text: string) => {
    this.searchText = text;
    this.updateFilteredUsers();
    this.setCurrentPage(1); // Reset to first page when searching
  };

  private updateFilteredUsers = () => {
    if (!this.searchText.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.deviceName?.toLowerCase().includes(searchLower) ||
        user.department?.toLowerCase().includes(searchLower) ||
        user.userId?.toLowerCase().includes(searchLower) ||
        user.software?.toLowerCase().includes(searchLower) ||
        user.id.toString().includes(searchLower)
      );
    }
  };

  // Actions for pagination
  setPageSize = (size: number) => {
    this.pageSize = size;
    // Adjust current page if it would be out of bounds
    const newTotalPages = Math.ceil(this.filteredUsers.length / size);
    if (this.currentPage > newTotalPages) {
      this.currentPage = Math.max(1, newTotalPages);
    } else {
      this.currentPage = 1; // Reset to first page for better UX
    }
  };

  setCurrentPage = (page: number) => {
    this.currentPage = page;
  };

  // UI State Methods - Employee Selection
  setSelectedEmployeeId = (id: number | null) => {
    this.selectedEmployeeId = id;
  };

  setSelectedEmployee = (employee: any) => {
    this.selectedEmployee = employee;
  };

  // Map Layer Methods
  setMapLayerType = (layer: MapLayerType) => {
    this.mapLayer = layer;
  };

  get isEmployeeSelected() {
    return this.selectedEmployeeId !== null;
  }

  // Actions for map management
  setMapCenter = (center: [number, number]) => {
    this.mapState.center = center;
  };

  setMapZoom = (zoom: number) => {
    this.mapState.zoom = zoom;
  };

  setMapLayer = (layer: MapLayerType) => {
    this.mapState.currentLayer = layer;
  };

  setMapInitialized = (initialized: boolean) => {
    this.mapState.initialized = initialized;
  };

  focusOnUser = (userId: number) => {
    const user = this.users.find(u => u.id === userId);
    if (user && user.coordinates) {
      this.setMapCenter(user.coordinates);
      this.setMapZoom(DEFAULTS.FOCUS_ZOOM);
      this.setSelectedUser(user);
    }
  };

  // Actions for UI state
  setLoading = (loading: boolean) => {
    this.loading = loading;
  };

  setError = (error: string | null) => {
    this.error = error;
  };

  // Computed values
  get totalItems() {
    return this.filteredUsers.length;
  }

  get totalPages() {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  get startIndex() {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex() {
    return Math.min(this.startIndex + this.pageSize, this.filteredUsers.length);
  }

  get paginatedUsers() {
    return this.filteredUsers.slice(this.startIndex, this.endIndex);
  }

  get pageNumbers() {
    const pages = [];
    const maxPages = DEFAULTS.MAX_VISIBLE_PAGES;
    
    if (this.totalPages <= maxPages) {
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    } else {
      const startPage = Math.max(1, Math.min(this.currentPage - 1, this.totalPages - maxPages + 1));
      const endPage = Math.min(this.totalPages, startPage + maxPages - 1);
      
      for (let i = startPage; i <= endPage; i++) pages.push(i);
    }
    
    return pages;
  }

  get userStats() {
    const total = this.users.length;
    const online = this.users.filter(user => user.status === 'online').length;
    const offline = this.users.filter(user => user.status === 'offline').length;
    const unknown = total - online - offline;
    
    return {
      total,
      online,
      offline,
      unknown
    };
  }

  get departmentStats() {
    const stats: Record<string, number> = {};
    this.users.forEach(user => {
      const dept = user.department || 'Unknown';
      stats[dept] = (stats[dept] || 0) + 1;
    });
    return stats;
  }

  get softwareStats() {
    const stats: Record<string, number> = {};
    this.users.forEach(user => {
      const software = user.software || 'Unknown';
      stats[software] = (stats[software] || 0) + 1;
    });
    return stats;
  }

  get dataSource() {
    return {
      isFromAPI: licenseStore.registeredUsers.length > 0 && this.users.length > 0,
      licenseUsersCount: licenseStore.registeredUsers.length,
      vtsUsersCount: this.users.length,
      lastUpdated: new Date().toISOString()
    };
  }

  get isUsingAPIData() {
    return this.dataSource.isFromAPI;
  }

  // Unified API handler
  private handleLicenseApiCall = async (
    apiCall: () => Promise<any>, 
    shouldClearFirst: boolean = false
  ) => {
    this.setLoading(true);
    this.setError(null);
    
    try {
      if (shouldClearFirst) licenseStore.clearUsers();
      
      const result = await apiCall();
      
      if (result.success) {
        this.users = this.convertLicenseUsersToVTSUsers(licenseStore.registeredUsers);
        this.updateFilteredUsers();
      } else {
        this.setError(result.error || 'Failed to fetch from API');
        this.initializeSampleUsers();
      }
      
    } catch (error: any) {
      this.setError('API call failed');
      this.initializeSampleUsers();
    } finally {
      this.setLoading(false);
    }
  };

  // API integration methods
  fetchUsers = () => this.handleLicenseApiCall(() => licenseStore.fetchRegisteredUsers());
  
  refreshUsers = () => this.fetchUsers();
  
  forceRefreshFromAPI = () => this.handleLicenseApiCall(() => licenseStore.fetchRegisteredUsers(), true);

  syncWithLicenseStore = () => {
    if (licenseStore.registeredUsers.length > 0) {
      this.users = this.convertLicenseUsersToVTSUsers(licenseStore.registeredUsers);
      this.updateFilteredUsers();
    }
  };
}

// Create and export singleton instance
export const vtsStore = new VTSStore();