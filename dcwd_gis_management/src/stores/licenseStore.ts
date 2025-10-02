import { makeAutoObservable } from "mobx";
import { licenseApiService } from "../services/licenseApiService";
import type { LicenseApiResponse } from "../services/licenseApiService";

// Types and Interfaces
export interface RegisteredUser {
  key: number;
  id: number;
  software: string;
  deviceName: string;
  department: string;
  userId: string;
  installationDate: string;
  status?: boolean;
}

export interface InstallationLog {
  key: number;
  id: number;
  date: string;
  action: string;
  status: string;
  notes?: string;
}

// Constants
const DEFAULTS = {
  PAGE_SIZE: 10,
  CURRENT_PAGE: 1,
};

const FIELD_MAPPINGS = {
  software: ['software', 'license_type', 'licenseType', 'Software'],
  deviceName: ['deviceName', 'device_name', 'pc_name', 'computerName', 'ComputerName', 'DeviceName'],
  department: ['department', 'Department', 'dept'],
  userId: ['userId', 'user_id', 'username', 'userName', 'UserName', 'id', 'ID'],
  installationDate: ['installationDate', 'installation_date', 'dateInstalled', 'created_at']
};

/**
 * LicenseStore - Clean and organized MobX store for license management
 * Handles user registration, pagination, search, and API operations
 */
class LicenseStore {
  // Core state
  registeredUsers: RegisteredUser[] = [];
  selectedUser: RegisteredUser | null = null;
  searchText = '';
  userStatus = true;
  loading = false;

  // Modal state
  modalVisible = false;
  renewModalVisible = false;

  // Pagination state
  pageSize = DEFAULTS.PAGE_SIZE;
  currentPage = DEFAULTS.CURRENT_PAGE;

  // Installation logs (mock data)
  installationLogs: InstallationLog[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Pagination actions
  setPageSize = (size: number) => {
    this.pageSize = size;
  };

  setCurrentPage = (page: number) => {
    this.currentPage = page;
  };

  // User management actions
  addUser = (userData: Omit<RegisteredUser, 'key' | 'id'>) => {
    const newUser: RegisteredUser = {
      key: Date.now() + Math.random(), // More unique key
      id: this.registeredUsers.length + 1,
      status: true,
      ...userData
    };
    
    // Check for duplicates based on userId and deviceName combination
    const isDuplicate = this.registeredUsers.some(existingUser => 
      existingUser.userId === newUser.userId && 
      existingUser.deviceName === newUser.deviceName
    );
    
    if (!isDuplicate) {
      this.registeredUsers.push(newUser);
    }
  };

  clearUsers = () => {
    this.registeredUsers = [];
  };

  removeUser = (userId: number) => {
    this.registeredUsers = this.registeredUsers.filter(user => user.id !== userId);
  };

  updateUser = (userId: number, updates: Partial<RegisteredUser>) => {
    const userIndex = this.registeredUsers.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      this.registeredUsers[userIndex] = { ...this.registeredUsers[userIndex], ...updates };
    }
  };

  // Selection and search actions
  setSelectedUser = (user: RegisteredUser | null) => {
    this.selectedUser = user;
    if (user) {
      this.userStatus = user.status ?? true;
    }
  };

  setSearchText = (text: string) => {
    this.searchText = text;
  };

  setUserStatus = (status: boolean) => {
    this.userStatus = status;
    if (this.selectedUser) {
      this.updateUser(this.selectedUser.id, { status });
    }
  };

  // Modal actions
  setModalVisible = (visible: boolean) => {
    this.modalVisible = visible;
  };

  setRenewModalVisible = (visible: boolean) => {
    this.renewModalVisible = visible;
  };

  // Loading state actions
  setLoading = (loading: boolean) => {
    this.loading = loading;
  };

  // Computed values
  get filteredUsers() {
    if (!this.searchText) return this.registeredUsers;
    
    const searchLower = this.searchText.toLowerCase();
    return this.registeredUsers.filter(user => 
      user.deviceName?.toLowerCase().includes(searchLower) ||
      user.department?.toLowerCase().includes(searchLower)
    );
  }

  get userStats() {
    const total = this.registeredUsers.length;
    const active = this.registeredUsers.filter(user => user.status).length;
    const inactive = total - active;
    
    return {
      total,
      active,
      inactive
    };
  }

  get departmentStats() {
    const stats: Record<string, number> = {};
    this.registeredUsers.forEach(user => {
      stats[user.department] = (stats[user.department] || 0) + 1;
    });
    return stats;
  }

  get softwareStats() {
    const stats: Record<string, number> = {};
    this.registeredUsers.forEach(user => {
      stats[user.software] = (stats[user.software] || 0) + 1;
    });
    return stats;
  }

  // Modal workflow helpers
  openInstallationDetails = (user: RegisteredUser) => {
    this.setSelectedUser(user);
    this.setModalVisible(true);
  };

  openRenewModal = () => {
    this.setModalVisible(false);
    this.setRenewModalVisible(true);
  };

  closeModals = () => {
    this.setModalVisible(false);
    this.setRenewModalVisible(false);
    this.setSelectedUser(null);
  };

  // Helper methods for data processing
  private getFieldValue = (user: any, fieldMappings: string[]): string => {
    return fieldMappings.find(field => user[field]) || 'N/A';
  };

  private createUserFromApiData = (user: any): Omit<RegisteredUser, 'key' | 'id'> => {
    if (Array.isArray(user)) {
      return {
        software: user[1] || 'N/A',
        deviceName: user[3] || 'N/A', 
        department: user[2] || 'N/A',
        userId: user[0] || 'N/A',
        installationDate: new Date().toLocaleDateString('en-GB'),
      };
    }
    
    return {
      software: this.getFieldValue(user, FIELD_MAPPINGS.software),
      deviceName: this.getFieldValue(user, FIELD_MAPPINGS.deviceName),
      department: this.getFieldValue(user, FIELD_MAPPINGS.department),
      userId: this.getFieldValue(user, FIELD_MAPPINGS.userId),
      installationDate: this.getFieldValue(user, FIELD_MAPPINGS.installationDate) || new Date().toLocaleDateString('en-GB'),
    };
  };

  private processApiResponse = (data: any[]): LicenseApiResponse => {
    this.clearUsers();
    
    data.forEach((user: any) => {
      const userData = this.createUserFromApiData(user);
      this.addUser(userData);
    });

    return {
      success: true,
      count: data.length,
      message: `Successfully loaded ${data.length} registered users`
    };
  };

  // Unified API method
  private fetchUsers = async (
    apiCall: () => Promise<LicenseApiResponse>,
    errorPrefix: string
  ): Promise<LicenseApiResponse> => {
    try {
      this.setLoading(true);
      const response = await apiCall();
      
      if (response.success && response.data) {
        return this.processApiResponse(response.data);
      }
      
      return response;
    } catch (error: any) {
      console.error(`${errorPrefix}:`, error);
      return {
        success: false,
        error: `${errorPrefix}`,
        count: 0
      };
    } finally {
      this.setLoading(false);
    }
  };

  // API methods
  fetchRegisteredUsers = () => this.fetchUsers(
    () => licenseApiService.getActiveUsers(),
    'Error fetching registered users'
  );

  fetchAllUsers = () => this.fetchUsers(
    () => licenseApiService.getUsersByStatus('all'),
    'Error fetching all users'
  );

  fetchUsersByStatus = (status: 'active' | 'inactive' | 'all') => this.fetchUsers(
    () => licenseApiService.getUsersByStatus(status),
    `Error fetching ${status} users`
  );

  testApiConnection = async (): Promise<{ success: boolean; message: string }> => {
    try {
      return await licenseApiService.testConnection();
    } catch (error: any) {
      return {
        success: false,
        message: `API connection test failed: ${error.message}`
      };
    }
  };
}

export const licenseStore = new LicenseStore();