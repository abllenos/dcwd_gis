import { makeAutoObservable } from "mobx";
import { licenseApiService } from "../services/licenseApiService";
import type { LicenseUser, LicenseApiResponse } from "../services/licenseApiService";

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

class LicenseStore {
  registeredUsers: RegisteredUser[] = [];
  selectedUser: RegisteredUser | null = null;
  searchText = '';
  userStatus = true;
  modalVisible = false;
  renewModalVisible = false;
  loading = false;

  // MobX state for pagination
  pageSize = 10;
  currentPage = 1;

  // Mock installation logs data
  installationLogs: InstallationLog[] = [
    {
      key: 1,
      id: 1,
      date: '2024-01-15',
      action: 'Initial Installation',
      status: 'Completed',
      notes: 'MapInfo Professional 19 installed successfully'
    },
    {
      key: 2,
      id: 2,
      date: '2024-01-16',
      action: 'License Activation',
      status: 'Active',
      notes: 'Trial license activated for 30 days'
    }
  ];

  constructor() {
    makeAutoObservable(this);
  }

  setPageSize = (size: number) => {
    this.pageSize = size;
  };

  setCurrentPage = (page: number) => {
    this.currentPage = page;
  };

  // Actions
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

  setModalVisible = (visible: boolean) => {
    this.modalVisible = visible;
  };

  setRenewModalVisible = (visible: boolean) => {
    this.renewModalVisible = visible;
  };

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

  // Methods for modal workflows
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

  // API methods
  fetchRegisteredUsers = async (): Promise<LicenseApiResponse> => {
    try {
      this.setLoading(true);
      const response = await licenseApiService.getActiveUsers();
      
      console.log('License API Response:', response);
      
      if (response.success && response.data) {
        // Clear existing users and add API data
        this.clearUsers();
        
        console.log(`Processing ${response.data.length} users from API`);
        
        response.data.forEach((user: any) => {
          // Handle both object and array formats
          let userData;
          if (Array.isArray(user)) {
            // API returns array format: [id, software, department, deviceName]
            userData = {
              software: user[1] || 'N/A',      // Second element is software/license type
              deviceName: user[3] || 'N/A',    // Fourth element is device/computer name
              department: user[2] || 'N/A',    // Third element is department
              userId: user[0] || 'N/A',        // First element is ID/user identifier
              installationDate: new Date().toLocaleDateString('en-GB'),
            };
          } else {
            // Fallback for object format
            userData = {
              software: user.software || user.license_type || user.licenseType || user.Software || 'N/A',
              deviceName: user.deviceName || user.device_name || user.pc_name || user.computerName || user.ComputerName || user.DeviceName || 'N/A',
              department: user.department || user.Department || user.dept || 'N/A',
              userId: user.userId || user.user_id || user.username || user.userName || user.UserName || user.id || user.ID || 'N/A',
              installationDate: user.installationDate || user.installation_date || user.dateInstalled || user.created_at || new Date().toLocaleDateString('en-GB'),
            };
          }
          
          this.addUser(userData);
        });
        
        return {
          success: true,
          count: response.data.length,
          message: response.message || `Successfully loaded ${response.data.length} registered users`
        };
      } else {
        return {
          success: true,
          count: 0,
          message: response.message || 'No registered users found in API response'
        };
      }
    } catch (error: any) {
      console.error('Error fetching registered users:', error);
      return {
        success: false,
        error: 'Failed to load registered users from API',
        count: 0
      };
    } finally {
      this.setLoading(false);
    }
  };

  // Additional API methods for enhanced functionality
  fetchAllUsers = async (): Promise<LicenseApiResponse> => {
    try {
      this.setLoading(true);
      const response = await licenseApiService.getAllUsers();
      
      if (response.success && response.data) {
        this.clearUsers();
        
        response.data.forEach((user: LicenseUser) => {
          this.addUser({
            software: user.software || user.license_type || 'N/A',
            deviceName: user.deviceName || user.device_name || user.pc_name || 'N/A',
            department: user.department || 'N/A',
            userId: user.userId || user.user_id || user.username || user.id || 'N/A',
            installationDate: user.installationDate || user.installation_date || new Date().toLocaleDateString('en-GB'),
          });
        });
        
        return response;
      }
      
      return response;
    } catch (error: any) {
      console.error('Error fetching all users:', error);
      return {
        success: false,
        error: 'Failed to load all users from API',
        count: 0
      };
    } finally {
      this.setLoading(false);
    }
  };

  fetchUsersByStatus = async (status: 'active' | 'inactive' | 'all'): Promise<LicenseApiResponse> => {
    try {
      this.setLoading(true);
      const response = await licenseApiService.getUsersByStatus(status);
      
      if (response.success && response.data) {
        this.clearUsers();
        
        response.data.forEach((user: LicenseUser) => {
          this.addUser({
            software: user.software || user.license_type || 'N/A',
            deviceName: user.deviceName || user.device_name || user.pc_name || 'N/A',
            department: user.department || 'N/A',
            userId: user.userId || user.user_id || user.username || user.id || 'N/A',
            installationDate: user.installationDate || user.installation_date || new Date().toLocaleDateString('en-GB'),
          });
        });
        
        return response;
      }
      
      return response;
    } catch (error: any) {
      console.error(`Error fetching ${status} users:`, error);
      return {
        success: false,
        error: `Failed to load ${status} users from API`,
        count: 0
      };
    } finally {
      this.setLoading(false);
    }
  };

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