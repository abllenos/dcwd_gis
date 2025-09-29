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
   * Fetch active registered users from the license API
   */
  async getActiveUsers(): Promise<LicenseApiResponse> {
    try {
      console.log('🔄 Making API request to:', licenseApi.defaults.baseURL + '/getRegUsers.php?mode=active');
      
      const response = await licenseApi.get('getRegUsers.php', {
        params: {
          mode: 'active'
        }
      });


      console.log('📡 License API Response Status:', response.status);
      console.log('📡 License API Response Data:', response.data);
      console.log('📡 License API Response Type:', typeof response.data, Array.isArray(response.data));


      // Handle different possible response formats
      if (response.data) {
        // If response.data is an array
        if (Array.isArray(response.data)) {
          return {
            success: true,
            data: response.data,
            count: response.data.length,
            message: `Successfully loaded ${response.data.length} active users`
          };
        }

        // If response.data has a data property that contains the array
        if (response.data.data && Array.isArray(response.data.data)) {
          return {
            success: true,
            data: response.data.data,
            count: response.data.data.length,
            message: response.data.message || `Successfully loaded ${response.data.data.length} active users`
          };
        }

        // If response.data has users property
        if (response.data.users && Array.isArray(response.data.users)) {
          return {
            success: true,
            data: response.data.users,
            count: response.data.users.length,
            message: response.data.message || `Successfully loaded ${response.data.users.length} active users`
          };
        }

        // Try to find the first array property in the object
        for (const key in response.data) {
          if (Array.isArray(response.data[key])) {
            return {
              success: true,
              data: response.data[key],
              count: response.data[key].length,
              message: `Loaded ${response.data[key].length} users from property '${key}'`
            };
          }
        }

        // If response indicates success but no data
        if (response.data.success === false) {
          return {
            success: false,
            error: response.data.message || response.data.error || 'API request failed',
            count: 0
          };
        }

        // If we get an object but can't determine the structure
        return {
          success: true,
          data: [],
          count: 0,
          message: 'API returned data but in unexpected format'
        };
      }

      // Empty or null response
      return {
        success: true,
        data: [],
        count: 0,
        message: 'No data returned from API'
      };

    } catch (error: any) {
      console.error('Error fetching active users:', error);
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        return {
          success: false,
          error: `API Error: ${error.response.status} - ${error.response.statusText}`,
          count: 0
        };
      } else if (error.request) {
        // Network error
        return {
          success: false,
          error: 'Network error: Unable to connect to license API',
          count: 0
        };
      } else {
        // Other error
        return {
          success: false,
          error: `Unexpected error: ${error.message}`,
          count: 0
        };
      }
    }
  }

  /**
   * Fetch all users (not just active)
   */
  async getAllUsers(): Promise<LicenseApiResponse> {
    try {
      const response = await licenseApi.get('getRegUsers.php', {
        params: {
          mode: 'all'
        }
      });

      console.log('License API Response (All Users):', response.data);

      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data,
          count: response.data.length,
          message: `Successfully loaded ${response.data.length} total users`
        };
      }

      return {
        success: true,
        data: [],
        count: 0,
        message: 'No users found'
      };

    } catch (error: any) {
      console.error('Error fetching all users:', error);
      return {
        success: false,
        error: `Failed to fetch all users: ${error.message}`,
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