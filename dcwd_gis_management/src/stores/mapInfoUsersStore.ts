import { makeAutoObservable } from "mobx";

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
    this.loading = true;
    this.error = null;
    try {
      // Use the same License API endpoint
      const res = await fetch('/api/license/getRegUsers.php?mode=active');
      const apiData = await res.json();
      console.log('MapInfoUsers API response:', apiData);
      let users: any[] = [];
      if (apiData && Array.isArray(apiData.data)) {
        users = apiData.data.map((user: any) => {
          if (Array.isArray(user)) {
            // Array format: [id, software, department, deviceName]
            return {
              id: user[0] || '',
              software: user[1] || 'N/A',
              department: user[2] || 'N/A',
              computerName: user[3] || 'N/A',
            };
          } else {
            // Object format
            return {
              id: user.id || user.userId || user.user_id || user.username || '',
              software: user.software || user.license_type || user.licenseType || user.Software || 'N/A',
              department: user.department || user.Department || user.dept || 'N/A',
              computerName: user.deviceName || user.device_name || user.pc_name || user.computerName || user.ComputerName || user.DeviceName || 'N/A',
            };
          }
        });
      }
      this.users = users;
    } catch (err: any) {
      this.error = err.message || 'Failed to fetch users';
    } finally {
      this.loading = false;
    }
  }
}

export const mapInfoUsersStore = new MapInfoUsersStore();
