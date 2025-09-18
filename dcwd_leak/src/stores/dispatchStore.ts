import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';

export interface Caretaker {
  id: string;
  empId: string;
  name: string;
  ctCode: string;
  mobileNo: string;
  status?: string;
}

class DispatchStore {
  caretakers: Caretaker[] = [];
  loading: boolean = false;
  error: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  async fetchCaretakers() {
    this.loading = true;
    this.error = '';
    try {
      const token = localStorage.getItem('token'); // or your token key
      const res = await axios.get(
        'https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/Caretaker/GetAllCaretaker',
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      runInAction(() => {
        this.caretakers = Array.isArray(res.data?.data)
          ? res.data.data.map((c: any) => ({
              id: c.id,
              empId: c.empId,
              name: c.name ?? c.description ?? '',
              ctCode: c.ctCode,
              mobileNo: c.mobileNo,
              status: c.status ?? 'active',
            }))
          : [];
        this.loading = false;
      });
    } catch (err: any) {
      runInAction(() => {
        this.error = err?.message || 'Failed to fetch caretakers';
        this.loading = false;
      });
    }
  }

  get mappedCaretakers() {
    return this.caretakers.map(c => ({
      value: c.empId,
      label: `${c.name} (${c.ctCode})`,
      status: c.status ?? 'active',
    }));
  }

  async dispatchToCrew(refNo: string, caretakerEmpId: string) {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        refNo,
        dispatchTo: caretakerEmpId,
      };
      const res = await axios.post(
        'https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/Dispatch/DispatchToCrew',
        payload,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );
      return res.data;
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || 'Dispatch failed');
    }
  }

  refresh() {
    this.fetchCaretakers();
  }
}

export const dispatchStore = new DispatchStore();