import { makeAutoObservable, observable } from 'mobx';
import { getSidebarWidth } from '../components/layout/Menuitems';

interface UserProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  department: string;
  empId: string;
  access: string[];
}

class SidebarUiStore {
  sidebarWidth = getSidebarWidth();
  userProfile: UserProfile = {
    firstName: "",
    middleName: "",
    lastName: "",
    department: "",
    empId: "",
    access: [],
  };
  accessibleMenuItems: any[] = [];
  openKeys: string[] = [];

  constructor() {
    makeAutoObservable(this, {
      accessibleMenuItems: observable.ref, // Use observable.ref to prevent deep observation
    });
  }

  recalcWidth() {
    this.sidebarWidth = getSidebarWidth();
  }

  setUserProfile(profile: UserProfile) {
    this.userProfile = profile;
  }

  setAccessibleMenuItems(items: any[] | undefined) {
    this.accessibleMenuItems = items || [];
  }

  setOpenKeys(keys: string[]) {
    this.openKeys = keys;
  }

  get fullName() {
    return `${this.userProfile.firstName} ${this.userProfile.middleName} ${this.userProfile.lastName}`.trim();
  }

  get userAccess() {
    return this.userProfile.access;
  }
}

export const sidebarUiStore = new SidebarUiStore();
