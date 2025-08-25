import { makeAutoObservable, runInAction } from "mobx";
import { devApi } from "../components/Endpoints/Interceptor";

class ProfileStore {
  employeeId = "EMP-00123";
  profileEmail = "";
  firstName = "";
  lastName = "";
  middlename = "";
  email = "";
  mobile = "";
  department = "";
  saving = false;
  contactSaving = false;
  showContactPreview = false;
  showProfilePreview = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchProfile() {
    const empId = localStorage.getItem("username");
    if (!empId) return;

    try {
      const res = await devApi.get(`dcwd-gis/api/v1/admin/useraccounts/GetByEmployeeID`, {
        params: { empId }
      });

      const data = res.data;
      if (data?.statusCode === 200 && data?.data) {
        const user = data.data;
        runInAction(() => {
          this.employeeId = user.empId || "";
          this.profileEmail = user.username || "";
          this.firstName = user.firstname || "";
          this.middlename = user.middlename || "";
          this.lastName = user.lastname || "";
          this.email = user.username || "";
          this.mobile = user.mobileNo || "";
          this.department = user.department || "";
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  }

  handleProfileSave() {
    this.saving = true;
    setTimeout(() => {
      runInAction(() => {
        this.saving = false;
        this.showProfilePreview = true;
      });
    }, 1000);
  }

  handleContactSave() {
    this.contactSaving = true;
    setTimeout(() => {
      runInAction(() => {
        this.contactSaving = false;
        this.showContactPreview = true;
      });
    }, 1000);
  }
}

export const profileStore = new ProfileStore();
