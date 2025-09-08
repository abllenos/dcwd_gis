import { makeAutoObservable, runInAction } from 'mobx';

export interface WaterSupplyConcernForm {
  Name?: string;
  nearestMeter?: string;
  location?: string;
  Number?: string;
  jmsCode?: string;
  remarks?: string;
  searchValue?: string;
  reportertype?: string;
  refAccNo?: string;
  landmark?: string;
}

class WaterSupplyConcernsStore {
  // Location state
  lat = 7.0722;
  lng = 125.6131;
  wscode = '';
  CT_ID = '';

  // Form state
  formValues: Partial<WaterSupplyConcernForm> = {};
  loading = false;
  searchLoading = false;

  // Modal state (same pattern as ReportALeak)
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

  setFormValues(values: Partial<WaterSupplyConcernForm>) {
    this.formValues = { ...this.formValues, ...values };
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setSearchLoading(loading: boolean) {
    this.searchLoading = loading;
  }

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

  async searchCustomer() {
    if (!this.formValues.searchValue?.trim()) {
      this.showModal('Warning', 'Please enter an account number or meter number', 'warning');
      return false;
    }

    const token = localStorage.getItem('debug_token');
    if (!token) {
      this.showModal('Session Expired', 'Your session has expired. Please log in again.', 'error');
      return false;
    }

    try {
      this.setSearchLoading(true);
      const response = await fetch(
        `https://api-gis.davao-water.gov.ph/dcwd-gis/api/v1/admin/customer/SearchAccountOrMeterNumber?searchValue=${this.formValues.searchValue}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data?.statusCode === 200 && data.data?.length > 0) {
        const customer = data.data[0];
        
        const accountNumber = customer.accountNumber || '';
        const RefAccAddress = accountNumber.match(/-(.*?)-/)?.[1] || '';
        const trimmedRefAccNo = RefAccAddress.substring(0, 6);
        
        const customerData = {
          location: customer.address || '',
          nearestMeter: customer.meterNumber || '',
          refAccNo: trimmedRefAccNo,
        };

        const newLat = parseFloat(customer.latitude);
        const newLng = parseFloat(customer.longitude);

        runInAction(() => {
          this.setFormValues(customerData);
          if (!isNaN(newLat) && !isNaN(newLng)) {
            this.setLocation(newLat, newLng);
          }
        });

        return customerData;
      } else {
        this.showModal('Not Found', 'Account or Meter Number not found in the database.');
        
        runInAction(() => {
          this.setFormValues({
            location: '',
            nearestMeter: '',
            refAccNo: '',
          });
          this.setLocation(7.0722, 125.6131);
        });
        
        return false;
      }
    } catch (error: any) {
      this.showModal('Error', 'Failed to search customer');
      return false;
    } finally {
      runInAction(() => {
        this.setSearchLoading(false);
      });
    }
  }

  async submitConcern(values: WaterSupplyConcernForm) {
    const token = localStorage.getItem('debug_token');
    if (!token) {
      this.showModal('Session Expired', 'Your session has expired. Please log in again.', 'error');
      return false;
    }

    const formData = new FormData();
    formData.append('ReporterName', values.Name || '');
    formData.append('ReportedNumber', values.Number || '');
    formData.append('ReferenceMtr', values.nearestMeter || '');
    formData.append('ReferenceRecaddrs', values.refAccNo || '');
    formData.append('ReportedLandmark', values.landmark || '');
    formData.append('JmsCode', values.jmsCode || '');
    formData.append('SpoolID', '0');
    formData.append('Latitude', this.lat.toString());
    formData.append('Longitude', this.lng.toString());
    formData.append('Geom', `${this.lng}, ${this.lat}`);
    formData.append('Remarks', values.remarks || '');
    formData.append('ReporterType', values.reportertype || '');
    formData.append('CtCode', this.CT_ID || '');
    formData.append('WsCode', this.wscode || '');
    formData.append('DtReported', new Date().toISOString());
    formData.append('refAccNo', (values.refAccNo || '').substring(0, 6));
    formData.append('DispatchStat', '1');
    formData.append('flgLeakDetection', '0')

    try {
      this.setLoading(true);
      const response = await fetch(
        'https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/LeakReport/WaterComplaints',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit concern');
      }

      runInAction(() => {
        this.showModal('Success', 'Water complaint submitted successfully', 'success');
        this.resetForm();
      });

      return true;
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.showModal('Unauthorized', 'Unauthorized. Please log in again.', 'error');
      } else {
        this.showModal('Submission Failed', 'Failed to submit water complaint.', 'error');
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
