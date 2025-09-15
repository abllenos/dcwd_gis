// API Response Types for Caretakers/Crew
export interface CrewMember {
  id: string;
  empId: string;
  designation: number;
  mobileNo: string;
  dateCreated: string;
}

export interface CrewData {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: CrewMember[];
  totalCount: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export type CrewApiResponse = ApiResponse<CrewData>;

// UI Display Types
export interface MappedCaretaker {
  value: string;
  label: string;
  status: 'active' | 'inactive';
  empId: string;
  mobileNo: string;
  designation: number;
  id: string;
}

// Designation mapping (can be customized based on actual business logic)
export const DESIGNATION_STATUS_MAP: Record<number, 'active' | 'inactive'> = {
  0: 'inactive',
  1: 'active',
  2: 'active',
  3: 'active',
  // Add more mappings as needed
};

// Dispatch API Types
export interface DispatchRequest {
  refNo: string;
  dispatchedBy: string;
  dispatchTo: string;
}

export interface DispatchData {
  id: string;
  refNo: string;
  dispatchedBy: string;
  dispatchTo: string;
  dateDispatched: string;
  dispatchStat: number;
}

export interface DispatchResponse {
  statusCode: number;
  message: string;
  data: DispatchData;
}