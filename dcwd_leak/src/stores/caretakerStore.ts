import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

export class CaretakerStore {
  caretakers: any[] = [];
  crews: any[] = [];
  loading: boolean = false;
  error: string = "";

  // UI state
  searchText: string = "";
  modalVisible: boolean = false;
  selectedCaretaker: any = null;
  addMode: boolean = false;
  selectedCrewKey: string | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  // UI actions
  setSearchText = (value: string) => { this.searchText = value; };
  setModalVisible = (value: boolean) => { this.modalVisible = value; };
  setSelectedCaretaker = (value: any) => { this.selectedCaretaker = value; };
  setAddMode = (value: boolean) => { this.addMode = value; };
  setSelectedCrewKey = (value: string | undefined) => { this.selectedCrewKey = value; };

  // Axios instance with token
  private getApi() {
    const token = localStorage.getItem("token");
    return axios.create({
      baseURL: "https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  }

  async fetchCaretakers() {
    this.loading = true;
    this.error = "";
    try {
      const res = await this.getApi().get("/Caretaker/GetAllCaretaker");
      runInAction(() => {
        const arr = Array.isArray(res.data?.data?.data)
          ? res.data.data.data
          : [];
        this.caretakers = arr.map((c: any) => ({
          key: c.id,
          ctCode: c.description ?? "",
          assignedCrewId: c.assignedCrewId ?? "",
        }));
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = "Failed to fetch caretakers";
        this.loading = false;
      });
    }
  }

  async fetchCrews() {
    this.loading = true;
    this.error = "";
    try {
      const res = await this.getApi().get("/GetCrew/GetAllCrew");
      runInAction(() => {
        const arr = Array.isArray(res.data?.data?.data)
          ? res.data.data.data
          : [];
        this.crews = arr.map((c: any) => ({
          key: c.id,
          empId: c.empId ?? "",
          mobileNo: c.mobileNo ?? "",
        }));
        this.loading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = "Failed to fetch crews";
        this.loading = false;
      });
    }
  }

  async assignCrew(payload: { caretakerId: string; crewId: string; crewEmpId: string }) {
    this.loading = true;
    this.error = "";
    try {
      await this.getApi().post("/Caretaker/AssignCrew/", payload);
      runInAction(() => {
        this.loading = false;
      });
      await this.fetchCaretakers();
      await this.fetchCrews();
    } catch (err) {
      runInAction(() => {
        this.error = "Failed to assign crew";
        this.loading = false;
      });
    }
  }

  async unassignCrew(payload: { caretakerId: string; crewId: string }) {
    this.loading = true;
    this.error = "";
    try {
      await this.getApi().delete("/Caretaker/RemoveCrew/", { data: payload });
      runInAction(() => {
        this.loading = false;
      });
      await this.fetchCaretakers();
      await this.fetchCrews();
    } catch (err) {
      runInAction(() => {
        this.error = "Failed to unassign crew";
        this.loading = false;
      });
    }
  }
}

export const caretakerStore = new CaretakerStore();