import { makeAutoObservable, runInAction } from "mobx";
import { devApi } from "../components/endpoints/Interceptor";
import { toast } from "react-toastify";

interface Role {
  access: string;
}

interface UserData {
  token: string;
  refreshToken: string;
  expiration: number;
  roles: Role[];
  firstName: string;
  middleName: string;
  lastName: string;
  deptId: number;
  empId: string;
}

class LoginStore {
  username = "";
  password = "";
  showPassword = false;
  darkMode = false;
  loading = false;
  pendingSubmit = false;

  userData: UserData | null = null; 

  constructor() {
    makeAutoObservable(this);
    this.loadUserData();
    this.loadDarkModePreference();
  }

  setUsername(value: string) {
    this.username = value;
  }

  setPassword(value: string) {
    this.password = value;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem("darkMode", JSON.stringify(this.darkMode));
  }

  setDarkMode(value: boolean) {
    this.darkMode = value;
    localStorage.setItem("darkMode", JSON.stringify(value));
  }

  loadDarkModePreference() {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      this.darkMode = JSON.parse(stored);
    }
  }

  setUserDataFromToken(token: string, expiration: number, username: string = '') {
    this.userData = {
      token,
      refreshToken: '',
      expiration,
      roles: [],
      firstName: '',
      middleName: '',
      lastName: '',
      deptId: 0,
      empId: username,
    };
  }

  async login(onLogin: (token: string) => void, navigate: (path: string, opts?: { replace?: boolean }) => void) {
    if (this.loading || this.pendingSubmit) return;
    this.pendingSubmit = true;
    this.loading = true;

    try {
      const { data } = await devApi.post("/admin/userlogin/login", {
        username: this.username,
        password: this.password,
      });

      if (data?.statusCode === 200 && data?.data?.token) {
        runInAction(() => {
          this.userData = data.data;
        });

        localStorage.setItem("token", data.data.token);
        localStorage.setItem("username", this.username);
        localStorage.setItem("userData", JSON.stringify(data.data));

        onLogin(data.data.token);
        setTimeout(() => navigate("/home", { replace: true }), 1300);
      } else {
        toast.error(data.message || "Invalid email or password");
      }
    } catch {
      toast.error("Failed to connect to server.");
    } finally {
      runInAction(() => {
        this.loading = false;
        this.pendingSubmit = false;
      });
    }
  }

  loadUserData() {
    const stored = localStorage.getItem("userData");
    if (stored) {
      this.userData = JSON.parse(stored);
    }
  }

  clearUserData() {
    runInAction(() => {
      this.userData = null;
      this.username = "";
      this.password = "";
    });
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("darkMode");
  }

  get fullDetails() {
    if (!this.userData) return "";
    return `${this.userData.firstName} 
    ${this.userData.middleName} 
    ${this.userData.lastName} 
    ${this.userData.deptId} 
    ${this.userData.empId}`;
  }

  get role() {
    return this.userData?.roles[0]?.access || "";
  }

  get isLoggedIn() {
    return !!this.userData?.token;
  }
}

export const loginStore = new LoginStore();
