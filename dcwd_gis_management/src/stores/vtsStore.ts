import { makeAutoObservable } from "mobx";
import { licenseStore } from "./licenseStore";
import type { RegisteredUser } from "./licenseStore";

export type MapLayerType = 'googleMaps' | 'googleSatellite' | 'googleHybrid' | 'googleTerrain';

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
  pageSize = 10;
  currentPage = 1;
  
  // Map state
  mapState: MapState = {
    center: [7.0731, 125.6128], // Davao City center
    zoom: 14,
    currentLayer: 'googleMaps',
    initialized: false,
    selectedUserId: null
  };
  
  // UI state
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadUsersFromLicenseStore();
    // Attempt to fetch fresh data from API
    this.fetchUsers();
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

  // Generate random coordinates around Davao City
  private generateRandomCoordinates = (): [number, number] => {
    const baseLat = 7.0731;
    const baseLng = 125.6128;
    const radius = 0.05; // Approximately 5km radius
    
    const lat = baseLat + (Math.random() - 0.5) * radius;
    const lng = baseLng + (Math.random() - 0.5) * radius;
    
    return [lat, lng];
  };

  // Generate random status for demo purposes
  private getRandomStatus = (): 'online' | 'offline' | 'unknown' => {
    const statuses: Array<'online' | 'offline' | 'unknown'> = ['online', 'online', 'online', 'offline', 'unknown'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  // Load users from license store
  private loadUsersFromLicenseStore = () => {
    if (licenseStore.registeredUsers.length > 0) {
      this.users = this.convertLicenseUsersToVTSUsers(licenseStore.registeredUsers);
      this.filteredUsers = [...this.users];
    } else {
      // Fallback to sample data if no license users available
      this.initializeSampleUsers();
    }
  };

  // Fallback sample data (kept for when license store is empty)
  private initializeSampleUsers = () => {
    this.users = [
      {
        key: 1,
        id: 1,
        software: 'MapInfo Professional 19',
        deviceName: 'DCWD-WS-001',
        department: 'Engineering and Construction Department',
        userId: 'eng001',
        installationDate: '2025-09-15',
        status: 'online',
        isActive: true,
        coordinates: [7.0731, 125.6128],
        lastSeen: '2025-09-24 10:30:00'
      },
      {
        key: 2,
        id: 2,
        software: 'QGIS',
        deviceName: 'DCWD-WS-002',
        department: 'Production Department',
        userId: 'prod001',
        installationDate: '2025-09-20',
        status: 'online',
        isActive: true,
        coordinates: [7.0800, 125.6200],
        lastSeen: '2025-09-24 11:15:00'
      },
      {
        key: 3,
        id: 3,
        software: 'MapInfo Professional 17',
        deviceName: 'DCWD-WS-003',
        department: 'Information and Communication Technology Department',
        userId: 'ict001',
        installationDate: '2025-09-18',
        status: 'online',
        isActive: true,
        coordinates: [7.0650, 125.6050],
        lastSeen: '2025-09-24 09:45:00'
      }
    ];
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
      this.setMapZoom(16);
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
    const maxVisiblePages = 3;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - 1);
      let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
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

  // API integration methods using license store
  fetchUsers = async () => {
    this.setLoading(true);
    this.setError(null);
    
    try {
      // Fetch users from license store API
      const result = await licenseStore.fetchRegisteredUsers();
      
      if (result.success) {
        // Convert license users to VTS users
        this.users = this.convertLicenseUsersToVTSUsers(licenseStore.registeredUsers);
        this.updateFilteredUsers();
        console.log(`VTS loaded ${this.users.length} users from license API`);
      } else {
        this.setError(result.error || 'Failed to fetch users from license API');
        // Use sample data as fallback
        this.initializeSampleUsers();
      }
      
    } catch (error: any) {
      this.setError('Failed to fetch users from license API');
      console.error('Error fetching VTS users:', error);
      // Use sample data as fallback
      this.initializeSampleUsers();
    } finally {
      this.setLoading(false);
    }
  };

  refreshUsers = async () => {
    await this.fetchUsers();
  };

  // Method to sync with license store data
  syncWithLicenseStore = () => {
    if (licenseStore.registeredUsers.length > 0) {
      this.users = this.convertLicenseUsersToVTSUsers(licenseStore.registeredUsers);
      this.updateFilteredUsers();
      console.log(`VTS synced with ${this.users.length} license users`);
    }
  };

  // Method to force refresh from API
  forceRefreshFromAPI = async () => {
    this.setLoading(true);
    this.setError(null);
    
    try {
      // Clear existing license data to force fresh fetch
      licenseStore.clearUsers();
      
      // Fetch fresh license data
      const result = await licenseStore.fetchRegisteredUsers();
      
      if (result.success) {
        // Convert and update VTS users
        this.users = this.convertLicenseUsersToVTSUsers(licenseStore.registeredUsers);
        this.updateFilteredUsers();
        console.log(`VTS refreshed with ${this.users.length} users from API`);
      } else {
        this.setError(result.error || 'Failed to refresh from API');
      }
      
    } catch (error: any) {
      this.setError('Failed to refresh from API');
      console.error('Error refreshing VTS users:', error);
    } finally {
      this.setLoading(false);
    }
  };
}

// Create and export singleton instance
export const vtsStore = new VTSStore();