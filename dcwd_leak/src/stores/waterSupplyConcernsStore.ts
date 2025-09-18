import { makeAutoObservable, runInAction } from 'mobx';

export interface NoWaterSupplyForm {
  ReferenceMtr?: string;
  DtReported?: string;
  ReportedLocation?: string;
  WsCode?: string;
  ReportedLandmark?: string;
  ReporterName?: string;
  Remarks?: string;
  ReportedNumber?: string;
  Geom?: string;
  ReferenceRecaddrs?: string;
  JmsCode?: string;
  CtCode?: string;
}

class WaterSupplyConcernsStore {
  // Location state
  lat = 7.0722;
  lng = 125.6131;
  wscode = '';
  CT_ID = '';

  // Form state
  formValues: Partial<NoWaterSupplyForm> = {};
  loading = false;

  // Modal state
  modalData = {
    visible: false,
    title: '',
    content: '',
    type: 'success' as 'success' | 'error' | 'warning'
  };

  // Error state
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Actions
  setLocation(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;
    this.fetchWscode(lat, lng);
    this.fetchCaretaker(lat, lng);
  }

  setFormValues(values: Partial<NoWaterSupplyForm>) {
    this.formValues = { ...this.formValues, ...values };
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  // No search for No Water Supply

  showModal(title: string, content: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.modalData = { visible: true, title, content, type };
  }

  closeModal() {
    this.modalData = { ...this.modalData, visible: false };
  }

  setError(error: string | null) {
    this.error = error;
  }

  resetForm() {
    this.formValues = {};
    this.error = null;
  }

  async fetchWscode(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://api-gis.davao-water.gov.ph/helpers/leaksys/getWSS.php?lat=${lat}&lng=${lng}`
      );
      const data = await response.json();
      
      runInAction(() => {
        if (data.success && data.data && data.data.length > 0) {
          this.wscode = data.data[0].wscode;
        } else {
          console.warn('No wscode found in response:', data);
        }
      });
    } catch (error) {
      console.error('Error fetching wscode: ', error);
      runInAction(() => {
        this.setError('Failed to fetch water service code');
      });
    }
  }

  async fetchCaretaker(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://api-gis.davao-water.gov.ph/helpers/leaksys/getCaretaker.php?lat=${lat}&lng=${lng}`
      );
      const data = await response.json();
      
      runInAction(() => {
        if (data && data.CT_ID) {
          this.CT_ID = data.CT_ID;
        } else if (Array.isArray(data.data) && data.data[0]?.CT_ID) {
          this.CT_ID = data.data[0].CT_ID;
        }
      });
    } catch (error) {
      console.error('Error fetching caretaker: ', error);
      runInAction(() => {
        this.setError('Failed to fetch caretaker information');
      });
    }
  }


  async submitNoWaterSupply(values: NoWaterSupplyForm) {
    const token = localStorage.getItem('debug_token');
    if (!token) {
      this.showModal('Session Expired', 'Your session has expired. Please log in again.', 'error');
      return false;
    }

  const formData = new FormData();
  formData.append('ReferenceMtr', values.ReferenceMtr ?? '');
  formData.append('DtReported', values.DtReported ?? new Date().toISOString());
  formData.append('ReportedLocation', values.ReportedLocation ?? '');
  formData.append('WsCode', values.WsCode ?? '0');
  formData.append('ReportedLandmark', values.ReportedLandmark ?? '');
  formData.append('ReporterName', values.ReporterName ?? '');
  formData.append('Remarks', values.Remarks ?? '');
  formData.append('ReportedNumber', values.ReportedNumber ?? '');
  formData.append('Geom', values.Geom ?? `${this.lng}, ${this.lat}`);
  formData.append('ReferenceRecaddrs', values.ReferenceRecaddrs ?? '');
  formData.append('JmsCode', values.JmsCode ?? '0');
  formData.append('CtCode', values.CtCode ?? '0');

    try {
      this.setLoading(true);
      const response = await fetch(
        'https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/LeakReport/NoWaterSupply',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit No Water Supply report');
      }

      runInAction(() => {
        this.showModal('Success', 'No Water Supply report submitted successfully', 'success');
        this.resetForm();
      });

      return true;
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.showModal('Unauthorized', 'Unauthorized. Please log in again.', 'error');
      } else {
        this.showModal('Submission Failed', 'Failed to submit No Water Supply report.', 'error');
      }
      console.error(error);
      return false;
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }
}

export const waterSupplyConcernsStore = new WaterSupplyConcernsStore();
