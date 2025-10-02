import axios from 'axios';

// Create a specific axios instance for the license API endpoint
// Using proxy in development, direct URL in production
const licenseApi = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? '/api/license' 
    : 'https://dev-gis.davao-water.gov.ph/web/dcwdgis/ajax/views/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LicenseUser {
  id: string;
  user_id?: string;
  userId?: string;
  username?: string;
  software?: string;
  device_name?: string;
  deviceName?: string;
  department?: string;
  installation_date?: string;
  installationDate?: string;
  status?: string | number;
  license_type?: string;
  expiration_date?: string;
  registered_to?: string;
  pc_name?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow for additional dynamic properties
}

export interface LicenseApiResponse {
  success: boolean;
  data?: LicenseUser[];
  message?: string;
  error?: string;
  count?: number;
}

class LicenseApiService {
  /**
   * Fetch active registered users from the provided remote API
   */
  async getActiveUsers(): Promise<LicenseApiResponse> {
    try {
      const response = await axios.get('/api/license/getRegUsers.php', {
        params: { mode: 'active' }
      });
      // Normalize response shape
      let users: LicenseUser[] = [];
      if (Array.isArray(response.data)) {
        users = response.data;
      } else if (Array.isArray(response.data?.data)) {
        users = response.data.data;
      } else if (Array.isArray(response.data?.users)) {
        users = response.data.users;
      }
      return {
        success: true,
        data: users,
        count: users.length
      };
    } catch (error: any) {
      console.error('Error fetching active users:', error);
      return {
        success: false,
        error: error.message || 'API Error',
        count: 0
      };
    }
  }

  /**
   * Fetch users by status
   */
  async getUsersByStatus(status: 'active' | 'inactive' | 'all'): Promise<LicenseApiResponse> {
    try {
      const response = await licenseApi.get('getRegUsers.php', {
        params: {
          mode: status
        }
      });

      console.log(`License API Response (${status} users):`, response.data);

      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data,
          count: response.data.length,
          message: `Successfully loaded ${response.data.length} ${status} users`
        };
      }

      return {
        success: true,
        data: [],
        count: 0,
        message: `No ${status} users found`
      };

    } catch (error: any) {
      console.error(`Error fetching ${status} users:`, error);
      return {
        success: false,
        error: `Failed to fetch ${status} users: ${error.message}`,
        count: 0
      };
    }
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await licenseApi.get('getRegUsers.php?mode=active');
      return {
        success: true,
        message: 'License API connection successful'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `License API connection failed: ${error.message}`
      };
    }
  }
}

export const licenseApiService = new LicenseApiService();