import { makeAutoObservable } from 'mobx';
import { getSidebarWidth } from '../components/layout/Menuitems';

class SidebarUiStore {
  sidebarWidth = getSidebarWidth();

  constructor() {
    makeAutoObservable(this);
  }

  recalcWidth() {
    this.sidebarWidth = getSidebarWidth();
  }
}

export const sidebarUiStore = new SidebarUiStore();
