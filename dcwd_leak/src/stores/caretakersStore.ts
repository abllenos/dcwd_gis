import { makeAutoObservable, runInAction } from "mobx";
import { devApi } from "../components/Endpoints/Interceptor";
import { 
  CrewMember, 
  MappedCaretaker, 
  DESIGNATION_STATUS_MAP,
  CrewApiResponse,
  DispatchRequest,
  DispatchResponse
} from "../types/caretaker";

class CaretakersStore {
  crewMembers: CrewMember[] = [];
  
  loading: boolean = false;
  error: string | null = null;
  lastFetchTime: number | null = null;
  
  pageIndex: number = 0;
  pageSize: number = 100;
  totalCount: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  // Computed getters
  get mappedCaretakers(): MappedCaretaker[] {
    return this.crewMembers.map((crew, index) => this.mapCrewToCaretaker(crew, index));
  }

  get activeCaretakers(): MappedCaretaker[] {
    return this.mappedCaretakers.filter(c => c.status === 'active');
  }

  get hasData(): boolean {
    return this.crewMembers.length > 0;
  }

  get shouldRefetch(): boolean {
    if (!this.lastFetchTime) return true;
  
    return Date.now() - this.lastFetchTime > 5 * 60 * 1000;
  }

  // Private helper to map crew data to UI format
  private mapCrewToCaretaker(crew: CrewMember, index: number): MappedCaretaker {
    const status = DESIGNATION_STATUS_MAP[crew.designation] || 'inactive';
    
    // Generate a sequence number for display purposes
    const sequenceNumber = String(index + 1).padStart(3, '0');
    const label = crew.empId 
      ? `${crew.empId} - CT - ${sequenceNumber}`
      : `Unknown - CT - ${sequenceNumber}`;

    return {
      value: crew.empId, 
      label,
      status,
      empId: crew.empId,
      mobileNo: crew.mobileNo,
      designation: crew.designation,
      id: crew.id,
    };
  }

  private async getAllCrewFromApi(pageIndex: number = 0, pageSize: number = 100): Promise<CrewApiResponse> {
    try {
      const safePageIndex = Math.max(0, pageIndex);
      const safePageSize = Math.max(1, pageSize);
      
      console.log('Attempting API call to GetAllCrew endpoint...');

      const response = await devApi.get('/dcwd-gis/api/v1/admin/GetCrew/GetAllCrew');
      
      console.log('API call successful without parameters');

      const data: any = response.data;
      
      // Debug: Log the actual response to understand the structure
      console.log('Full API Response:', JSON.stringify(data, null, 2));
      console.log('Response type:', typeof data);
      console.log('Response keys:', Object.keys(data || {}));
      
      // Handle different response formats
      let processedResponse: CrewApiResponse;
      
      // If the response is just a string "Success" or simple message
      if (typeof data === 'string') {
        console.log('API returned string response:', data);
        processedResponse = {
          statusCode: 0,
          message: data,
          data: {
            pageIndex: 0,
            pageSize: 100,
            count: 0,
            data: [],
            totalCount: 0
          }
        };
      }
      // If response has the expected structure
      else if (data && typeof data === 'object' && data.data) {
        processedResponse = data as CrewApiResponse;
      }
      // If response is an array directly (some APIs return array directly)
      else if (Array.isArray(data)) {
        console.log('API returned array directly:', data.length, 'items');
        processedResponse = {
          statusCode: 0,
          message: 'Success',
          data: {
            pageIndex: 0,
            pageSize: data.length,
            count: data.length,
            data: data,
            totalCount: data.length
          }
        };
      }
      else if (data && typeof data === 'object') {
        console.log('API returned object with unexpected structure');
        const possibleArrays = Object.values(data).filter(Array.isArray);
        const crewArray = possibleArrays.length > 0 ? possibleArrays[0] as any[] : [];
        
        processedResponse = {
          statusCode: data.statusCode || 0,
          message: data.message || 'Success',
          data: {
            pageIndex: data.pageIndex || 0,
            pageSize: data.pageSize || crewArray.length,
            count: crewArray.length,
            data: crewArray,
            totalCount: data.totalCount || crewArray.length
          }
        };
      }
      // Fallback for any other case
      else {
        console.warn('Unexpected response format, creating empty result');
        processedResponse = {
          statusCode: 0,
          message: 'Success',
          data: {
            pageIndex: 0,
            pageSize: 100,
            count: 0,
            data: [],
            totalCount: 0
          }
        };
      }

      console.log('Processed response:', processedResponse);
      return processedResponse;
    } catch (error) {
      console.error('Error fetching crew data:', error);
      
      // Handle different types of errors with more detail
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Axios error response:', axiosError.response?.data);
        
        if (axiosError.response?.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        if (axiosError.response?.status === 403) {
          throw new Error('Access denied. You do not have permission to view caretakers.');
        }
        if (axiosError.response?.status === 404) {
          throw new Error('API endpoint not found. Please check the API configuration.');
        }
        if (axiosError.response?.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw new Error(`API error (${axiosError.response?.status}): ${axiosError.response?.statusText || 'Unknown error'}`);
      }
      
      throw new Error(
        error instanceof Error 
          ? `Failed to fetch crew data: ${error.message}`
          : 'Failed to fetch crew data: Unknown error'
      );
    }
  }

  // Actions
  fetchCaretakers = async (forceRefresh: boolean = false) => {
    if (this.loading) return;
    
    if (!forceRefresh && this.hasData && !this.shouldRefetch) {
      return; // Use cached data
    }

    this.setLoading(true);
    this.setError(null);

    try {
      const response: CrewApiResponse = await this.getAllCrewFromApi(
        this.pageIndex, 
        this.pageSize
      );

      runInAction(() => {
        // Accept both 0 and 200 as success status codes
        if ((response.statusCode === 0 || response.statusCode === 200) && response.data) {
          console.log('Processing crew data:', response.data.data);
          this.crewMembers = response.data.data || [];
          this.totalCount = response.data.totalCount || response.data.count || 0;
          this.pageIndex = Math.max(0, (response.data.pageIndex || 1) - 1);
          this.pageSize = response.data.pageSize || 100;
          this.lastFetchTime = Date.now();
          console.log('Successfully loaded', this.crewMembers.length, 'caretakers');
        } else {
          console.error('Invalid status code or missing data:', response);
          this.setError(response.message || 'Failed to fetch caretakers');
        }
      });
    } catch (error) {
      runInAction(() => {
        this.setError(
          error instanceof Error 
            ? error.message 
            : 'An unexpected error occurred'
        );
      });
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  };

  setLoading = (loading: boolean) => {
    this.loading = loading;
  };

  setError = (error: string | null) => {
    this.error = error;
  };

  clearError = () => {
    this.error = null;
  };

  // Refresh data
  refresh = () => {
    this.fetchCaretakers(true);
  };

  // Dispatch API method
  dispatchToCrew = async (refNo: string, dispatchTo: string): Promise<DispatchResponse> => {
    try {
      // Get authenticated user for dispatchedBy - check multiple localStorage sources
      let dispatchedBy = 'unknown';
      
      // Try to get empId from username key (most common)
      const empIdFromUsername = localStorage.getItem('username');
      if (empIdFromUsername) {
        dispatchedBy = empIdFromUsername;
      } else {
        // Fallback: try debug_user_data
        const debugUserData = localStorage.getItem('debug_user_data');
        if (debugUserData) {
          try {
            const user = JSON.parse(debugUserData);
            dispatchedBy = user?.empId || user?.username || 'unknown';
          } catch (e) {
            console.warn('Failed to parse debug_user_data:', e);
          }
        } else {
          // Fallback: try userData
          const userData = localStorage.getItem('userData');
          if (userData) {
            try {
              const user = JSON.parse(userData);
              dispatchedBy = user?.empId || user?.username || 'unknown';
            } catch (e) {
              console.warn('Failed to parse userData:', e);
            }
          }
        }
      }
      
      console.log('Found dispatchedBy value:', dispatchedBy);
      
      // Truncate dispatchedBy to 6 characters to match database constraint
      if (dispatchedBy.length > 6) {
        const originalValue = dispatchedBy;
        dispatchedBy = dispatchedBy.substring(0, 6);
        console.warn(`dispatchedBy field truncated from ${originalValue} to ${dispatchedBy} due to database character limit`);
      }

      // Also validate other fields for potential length issues
      let validatedDispatchTo = dispatchTo;
      if (dispatchTo.length > 50) { 
        validatedDispatchTo = dispatchTo.substring(0, 50);
        console.warn(`dispatchTo field truncated from ${dispatchTo} to ${validatedDispatchTo}`);
      }

      let validatedRefNo = refNo;
      if (refNo.length > 50) { 
        validatedRefNo = refNo.substring(0, 50);
        console.warn(`refNo field truncated from ${refNo} to ${validatedRefNo}`);
      }

      console.log('Dispatching to crew:', { 
        refNo: validatedRefNo, 
        dispatchedBy: `${dispatchedBy} (empId)`, 
        dispatchTo: `${validatedDispatchTo} (empId)` 
      });

      const requestData: DispatchRequest = {
        refNo: validatedRefNo,
        dispatchedBy,
        dispatchTo: validatedDispatchTo
      };

      console.log('Sending dispatch request:', requestData);

      const response = await devApi.post('/dcwd-gis/api/v1/admin/Dispatch/DispatchToCrew', requestData);
      
      console.log('Dispatch API response:', response.data);
      console.log('Response type:', typeof response.data);
      console.log('Response keys:', Object.keys(response.data || {}));

      const data: any = response.data;
      
      let dispatchResponse: DispatchResponse;
      
      if (data && typeof data.statusCode === 'number' && data.data) {
        dispatchResponse = data as DispatchResponse;
      }

      else if (data && typeof data.statusCode === 'number') {
        dispatchResponse = {
          statusCode: data.statusCode,
          message: data.message || 'Success',
          data: {
            id: data.id || data.data?.id || '',
            refNo: data.refNo || data.data?.refNo || '',
            dispatchedBy: data.dispatchedBy || data.data?.dispatchedBy || '',
            dispatchTo: data.dispatchTo || data.data?.dispatchTo || '',
            dateDispatched: data.dateDispatched || data.data?.dateDispatched || new Date().toISOString(),
            dispatchStat: data.dispatchStat || data.data?.dispatchStat || 0
          }
        };
      }
      // If response doesn't have statusCode but has dispatch data
      else if (data && (data.id || data.refNo)) {
        dispatchResponse = {
          statusCode: 0, // Assume success
          message: 'Success',
          data: {
            id: data.id || '',
            refNo: data.refNo || '',
            dispatchedBy: data.dispatchedBy || '',
            dispatchTo: data.dispatchTo || '',
            dateDispatched: data.dateDispatched || new Date().toISOString(),
            dispatchStat: data.dispatchStat || 0
          }
        };
      }
      // Fallback - create a basic success response
      else {
        console.warn('Unexpected response format, creating fallback response');
        dispatchResponse = {
          statusCode: 0,
          message: 'Dispatch completed',
          data: {
            id: 'generated-' + Date.now(),
            refNo: refNo,
            dispatchedBy: dispatchedBy,
            dispatchTo: dispatchTo,
            dateDispatched: new Date().toISOString(),
            dispatchStat: 2 // Assuming 2 means dispatched
          }
        };
      }

      console.log('Processed dispatch response:', dispatchResponse);
      
      // Check for business logic errors in the response
      if (dispatchResponse.statusCode === 404) {
        const errorMsg = dispatchResponse.message || 'Record not found';
        
        // Provide specific guidance for 404 errors
        if (errorMsg.includes('Main record') && errorMsg.includes('not found')) {
          throw new Error(`Leak record not found in dispatch system. This may happen if:
• The leak report was created offline or as test data
• The record hasn't been properly synchronized with the dispatch system  
• The reference number "${refNo}" doesn't exist in the backend database

Please try dispatching a different leak report or contact your system administrator.

Backend message: ${errorMsg}`);
        } else {
          throw new Error(`Record not found: ${errorMsg}`);
        }
      }
      
      // Check for other non-success status codes
      if (dispatchResponse.statusCode !== 0 && dispatchResponse.statusCode !== 200) {
        throw new Error(`Dispatch failed: ${dispatchResponse.message || `Status code: ${dispatchResponse.statusCode}`}`);
      }
      
      return dispatchResponse;
    } catch (error) {
      console.error('Error dispatching to crew:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Dispatch API error response:', axiosError.response?.data);
        
        if (axiosError.response?.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        if (axiosError.response?.status === 403) {
          throw new Error('Access denied. You do not have permission to dispatch.');
        }
        if (axiosError.response?.status === 404) {
          const errorData = axiosError.response?.data;
          const errorMessage = errorData?.message || 'API endpoint not found or reference number does not exist';
          throw new Error(`Not found: ${errorMessage}`);
        }
        if (axiosError.response?.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        
        const errorMessage = axiosError.response?.data?.message || axiosError.response?.statusText || 'Unknown error';
        throw new Error(`Dispatch failed: ${errorMessage}`);
      }
      
      throw new Error(
        error instanceof Error 
          ? `Failed to dispatch: ${error.message}`
          : 'Failed to dispatch: Unknown error'
      );
    }
  };

  // Search/filter functionality
  searchCaretakers = (searchTerm: string): MappedCaretaker[] => {
    if (!searchTerm.trim()) {
      return this.mappedCaretakers;
    }

    const term = searchTerm.toLowerCase();
    return this.mappedCaretakers.filter(caretaker =>
      caretaker.empId.toLowerCase().includes(term) ||
      caretaker.mobileNo.toLowerCase().includes(term) ||
      caretaker.label.toLowerCase().includes(term)
    );
  };
}

export const caretakersStore = new CaretakersStore();