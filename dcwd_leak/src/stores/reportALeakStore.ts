import { makeAutoObservable, runInAction } from "mobx";
import { devApi } from '../components/Endpoints/Interceptor';

export type ReportType = 'leak_report' | 'no_water_supply' | 'low_pressure' | 'water_quality';

export interface CustomerDetails {
  accountNumber?: string;
  meterNumber?: string;
  customerName?: string;
  address?: string;
  connectionType?: string;
  districtMeteringArea?: string;
}

export interface ModalData {
  visible: boolean;
  title: string;
  content: string;
  type: 'success' | 'error' | 'warning';
}

export interface FormValues {
  address?: string;
  ReferenceMeter?: string;
  refAccNo?: string;
  Name?: string;
  Number?: string;
  Landmark?: string;
  typeId?: string;
  leakPressure?: string;
  visibility?: string;
  coverings?: string;
  Remarks?: string;
  reportertype?: string;
  reportType?: ReportType;
}

export class ReportALeakStore {
  // Location state
  lat = 7.0722;
  lng = 125.6131;
  wscode = '';
  ctId = '';

  // Form state
  formValues: FormValues = {};
  customerDetails: CustomerDetails = {};
  selectedReportType: ReportType = 'leak_report';
  isCustomerSearched = false; 

  // UI state
  loading = false;
  modalData: ModalData = {
    visible: false,
    title: '',
    content: '',
    type: 'success'
  };

  constructor() {
    makeAutoObservable(this);
  }

  // Location actions
  setLocation(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
    this.fetchWscode(lat, lng);
    this.fetchCaretaker(lat, lng);
  }

  setWscode(wscode: string) {
    this.wscode = wscode;
  }

  setCtId(ctId: string) {
    this.ctId = ctId;
  }

  // Form actions
  setFormValues(values: FormValues) {
    this.formValues = { ...this.formValues, ...values };
  }

  setCustomerDetails(details: CustomerDetails) {
    runInAction(() => {
      this.customerDetails = details;
      this.isCustomerSearched = details && Object.keys(details).length > 0;
      
      if (details && Object.keys(details).length > 0) {
        const accountNumber = details.accountNumber || '';
        const RefAccAddress = accountNumber.match(/-(.*?)-/)?.[1] || '';
        const trimmedRefAccNo = RefAccAddress.substring(0, 6);

        this.formValues = {
          ...this.formValues,
          address: details.address || '',
          ReferenceMeter: details.meterNumber || '',
          refAccNo: trimmedRefAccNo,
        };
      } else {
        // Reset flag when clearing customer details
        this.isCustomerSearched = false;
      }
    });
  }

  setReportType(reportType: ReportType) {
    this.selectedReportType = reportType;
  }

  // UI actions
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  showModal(title: string, content: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.modalData = { visible: true, title, content, type };
  }

  hideModal() {
    this.modalData = { ...this.modalData, visible: false };
  }

  // API actions
  async fetchWscode(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://api-gis.davao-water.gov.ph/helpers/leaksys/getWSS.php?lat=${lat}&lng=${lng}`
      );
      const data = await response.json();
      
      runInAction(() => {
        if (data.success && data.data && data.data.length > 0) {
          this.wscode = data.data[0].wscode;
        }
      });
    } catch (error) {
      console.error('Error fetching wscode: ', error);
    }
  }

  async fetchCaretaker(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://api-gis.davao-water.gov.ph/helpers/leaksys/getCaretaker.php?lat=${lat}&lng=${lng}`
      );
      const data = await response.json();
      
      runInAction(() => {
        if (data?.CT_ID) {
          this.ctId = data.CT_ID;
        } else if (Array.isArray(data.data) && data.data[0]?.CT_ID) {
          this.ctId = data.data[0].CT_ID;
        }
      });
    } catch (error) {
      console.error('Error fetching caretaker: ', error);
    }
  }

  async submitReport(values: any, navigate: (path: string) => void) {
    const token = localStorage.getItem('debug_token');
    if (!token) {
      this.showModal('Session Expired', 'Your session has expired. Please log in again.', 'error');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('ReporterName', values.Name || '');
    formData.append('ReportedNumber', values.Number || '');
    formData.append('ReferenceMtr', values.ReferenceMeter || '');
    formData.append('ReferenceRecaddrs', values.refAccNo || '');
    formData.append('ReportedLandmark', values.Landmark || '');
    formData.append('ReportedLocation', values.address || '');
    formData.append('LeakPressure', values.leakPressure || '');
    formData.append('LeakIndicator', values.visibility || '');
    formData.append('LeakCovering', values.coverings || '');
    formData.append('ReportType', values.typeId || '');
    formData.append('SpoolID', '0');
    formData.append('Latitude', this.lat.toString());
    formData.append('Longitude', this.lng.toString());
    formData.append('Geom', `${this.lng}, ${this.lat}`);
    formData.append('Remarks', values.Remarks || '');
    formData.append('ReporterType', values.reportertype || '');
    formData.append('CtCode', this.ctId || '');
    formData.append('WsCode', this.wscode || '');
    formData.append('DtReported', new Date().toISOString());
    formData.append('refAccNo', (values.refAccNo || '').substring(0, 6));
    formData.append('DispatchStat', '1');
    formData.append('flgLeakDetection', '0');

    try {
      this.setLoading(true);
      
      await devApi.post(
        "dcwd-gis/api/v1/admin/LeakReport/ReportLeak",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      this.showModal('Success', 'Leak report submitted successfully', 'success');
      this.resetForm();
      
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.showModal('Unauthorized', 'Unauthorized. Please log in again.', 'error');
        navigate('/login');
      } else {
        this.showModal('Submission Failed', 'Failed to submit leak report.', 'error');
      }
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  }

  resetForm() {
    this.formValues = {};
    this.isCustomerSearched = false;
    this.customerDetails = {};
  }

  clearCustomerDetails() {
    this.customerDetails = {};
    this.isCustomerSearched = false;
    this.formValues = {
      ...this.formValues,
      address: '',
      ReferenceMeter: '',
      refAccNo: '',
    };
  }

  // Computed values
  get formattedLocation() {
    return `${this.lat}, ${this.lng}`;
  }

  get hasValidLocation() {
    return this.lat !== null && this.lng !== null;
  }
}

// Create singleton instance
export const reportALeakStore = new ReportALeakStore();
