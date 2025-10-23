import { makeAutoObservable } from "mobx";

interface ModalState {
  modalVisible: boolean;
  selectedUser: any | null;
  logSearch: string;
}

class MapInfoUsersUiStore {
  modalState: ModalState = {
    modalVisible: false,
    selectedUser: null,
    logSearch: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  openModal(user: any) {
    this.modalState = {
      ...this.modalState,
      modalVisible: true,
      selectedUser: user,
    };
  }

  closeModal() {
    this.modalState = {
      ...this.modalState,
      modalVisible: false,
      selectedUser: null,
      logSearch: "",
    };
  }

  setSelectedUser(user: any) {
    this.modalState = {
      ...this.modalState,
      selectedUser: user,
    };
  }

  setLogSearch(searchText: string) {
    this.modalState = {
      ...this.modalState,
      logSearch: searchText,
    };
  }

  get isModalVisible() {
    return this.modalState.modalVisible;
  }

  get selectedUserData() {
    return this.modalState.selectedUser;
  }

  get searchQuery() {
    return this.modalState.logSearch;
  }
}

export const mapInfoUsersUiStore = new MapInfoUsersUiStore();
