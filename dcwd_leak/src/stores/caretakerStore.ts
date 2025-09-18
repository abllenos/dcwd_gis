import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';

export class CaretakerStore {
  caretakers: any[] = [];    // For table display
  crews: any[] = [];         // For modal dropdown
  loading: boolean = false;
  error: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch caretakers for table
  async fetchCaretakers() {
    this.loading = true;
    this.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        'https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/Caretaker/GetAllCaretaker',
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );
      runInAction(() => {
        const arr = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];
        this.caretakers = arr.map((c: any, idx: number) => ({
          key: c.id ?? String(idx),
          empId: c.empId ?? '',
          designation: c.designation ?? '',
          mobileNo: c.mobileNo ?? '',
          dateCreated: c.dateCreated ?? '',
        }));
        this.loading = false;
      });
    } catch (err: any) {
      runInAction(() => {
        this.error = 'Failed to fetch caretakers';
        this.loading = false;
      });
    }
  }

  // Fetch crews for modal dropdown
  async fetchCrews() {
    this.loading = true;
    this.error = '';
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        'https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/GetCrew/GetAllCrew',
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );
      runInAction(() => {
        const arr = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];
        this.crews = arr.map((c: any, idx: number) => ({
          key: c.id ?? String(idx),
          empId: c.empId ?? '',
          name: c.name ?? '',
          designation: c.designation ?? '',
          mobileNo: c.mobileNo ?? '',
        }));
        this.loading = false;
      });
    } catch (err: any) {
      runInAction(() => {
        this.error = 'Failed to fetch crews';
        this.loading = false;
      });
    }
  }

  // Assign or unassign crew to caretaker
  async assignCrew(payload: { crewId: string; caretakerId: string; action: 'assign' | 'unassign' }) {
    this.loading = true;
    this.error = '';
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/Dispatch/assigned/',
        payload,
        { headers: { Authorization: token ? `Bearer ${token}` : '' } }
      );
      runInAction(() => {
        this.loading = false;
      });
    } catch (err: any) {
      runInAction(() => {
        this.error = 'Failed to assign/unassign crew';
        this.loading = false;
      });
    }
  }
}

export const caretakerStore = new CaretakerStore();