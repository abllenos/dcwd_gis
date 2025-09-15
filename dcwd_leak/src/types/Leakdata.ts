export interface LeakData {
  key?: string; // React key for table rows
  id: string;
  leakType?: string;
  referenceNo: string;
  location?: string;
  landmark?: string;
  referenceMeter?: string;
  contactNo?: string;
  dateReported?: string;
  dateTimeReported?: string; // For backward compatibility
  dispatchStat?: number;
  flgLeakDetection?: number;
  status?: string;
  reportType?: string;
  remarks?: string;

  // Additional fields that are still used in components
  teamLeader?: string;
  jmsControlNo?: string;
  dateRepaired?: string;
  dateTurnOvered?: string;
  reason?: string;

  dmaId?: string;
  covering?: string;
  nrwLevel?: string;
  leakPressure?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
}