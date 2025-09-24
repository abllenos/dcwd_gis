import { makeAutoObservable } from 'mobx';

class DashboardUiStore {
  collapsed = false;
  logoutModalVisible = false;

  constructor() {
    makeAutoObservable(this);
  }

  setCollapsed(v: boolean) { this.collapsed = v; }
  toggleCollapsed() { this.collapsed = !this.collapsed; }

  showLogoutModal() { this.logoutModalVisible = true; }
  hideLogoutModal() { this.logoutModalVisible = false; }
}

export const dashboardUiStore = new DashboardUiStore();
