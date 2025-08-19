export interface LeakData {
  key: string;
  id: string;
  leakType: string;
  location: string;
  landmark: string;
  referenceMeter: string;
  contactNo: string;
  dateTimeReported: string;
  referenceNo: number;
  dmaId: string;
  covering: string;
  nrwLevel?: string;
  repairedLeaks?: string;
  jmsControlNo?: string;
  dateRepaired?: string;
  teamLeader?: string;
  dateTurnedOver?: string;
  turnoverReason?: string;
  leakPressure?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  dispatchStat: number;
  flgLeakDetection: number;
}