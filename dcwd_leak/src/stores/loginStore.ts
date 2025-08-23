import { makeAutoObservable, runInAction } from "mobx";
import { devApi } from "../components/Endpoints/Interceptor"; 
import { toast } from "react-toastify";

class LoginStore {
  username = "";
  password = "";
  showPassword = false;
  darkMode = false;
  loading = false;
  pendingSubmit = false;

  constructor() {
    makeAutoObservable(this);
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
  }

  async login(onLogin: (token: string) => void, navigate: any) {
    if (this.loading || this.pendingSubmit) return;
    this.pendingSubmit = true;
    this.loading = true;

    try {
      const { data } = await devApi.post("dcwd-gis/api/v1/admin/userlogin/login", {
        username: this.username,
        password: this.password,
      });

      if (data?.statusCode === 200 && data?.data?.token) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("username", this.username);
        localStorage.setItem("debug_user_data", JSON.stringify(data.data));
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
}

export const loginStore = new LoginStore();
