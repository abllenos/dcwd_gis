import { makeAutoObservable, runInAction } from "mobx";

class MapInfoUsersStore {
  software = '';
  deviceName = '';
  department = '';
  userId = '';
  installDate: Date | null = null;
  search = '';
  pageSize = 10;
  users: any[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setSoftware(val: string) { this.software = val; }
  setDeviceName(val: string) { this.deviceName = val; }
  setDepartment(val: string) { this.department = val; }
  setUserId(val: string) { this.userId = val; }
  setInstallDate(val: Date | null) { this.installDate = val; }
  setSearch(val: string) { this.search = val; }
  setPageSize(val: number) { this.pageSize = val; }

  async fetchUsers() {
    runInAction(() => {
      this.loading = true;
      this.error = null;
    });
    try {
      const res = await fetch('/api/license/getRegUsers.php?mode=active');
      const data = await res.json();
      console.log('MapInfoUsers API response:', data); // Debug log
      runInAction(() => {
        if (Array.isArray(data)) {
          this.users = data;
        } else if (Array.isArray(data?.data)) {
          this.users = data.data;
        } else if (Array.isArray(data?.users)) {
          this.users = data.users;
        } else {
          this.users = [];
        }
      });
    } catch (err: any) {
      runInAction(() => {
        this.error = err.message || 'Failed to fetch users';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export const mapInfoUsersStore = new MapInfoUsersStore();
