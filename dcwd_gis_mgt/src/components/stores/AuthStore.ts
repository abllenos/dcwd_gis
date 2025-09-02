import { makeAutoObservable } from "mobx";

class AuthStore {
  username = "";
  password = "";
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUsername(value: string) {
    this.username = value;
  }

  setPassword(value: string) {
    this.password = value;
  }

  async loginRequest(): Promise<{ success: boolean; token?: string; user?: any }> {
    this.loading = true;
    this.error = null;

    try {
      const response = await fetch(
        "https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/userlogin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        }
      );

      const data = await response.json();
      console.log("API raw response:", data);

      if (response.ok && data.statusCode === 200 && data.data?.token) {
        return { success: true, token: data.data.token, user: data.data };
      } else {
        this.error = data.message || "Invalid credentials. Please try again.";
        return { success: false };
      }
    } catch (err: any) {
      this.error = "Network or server error.";
      return { success: false };
    } finally {
      this.loading = false;
    }
  }
}

export const authStore = new AuthStore();
