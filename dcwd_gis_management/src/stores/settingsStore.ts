import { makeAutoObservable, runInAction } from "mobx";

interface SettingsFormData {
  theme: string;
  language: string;
  fontSize: number;
  notifications: boolean;
  emailNotifications: boolean;
  autoSave: boolean;
  displayName: string;
  email: string;
}

class SettingsStore {
  settings: SettingsFormData = {
    theme: "light",
    language: "en",
    fontSize: 14,
    notifications: true,
    emailNotifications: false,
    autoSave: true,
    displayName: "John Doe",
    email: "john.doe@dcwd.gov.ph",
  };

  tempSettings: SettingsFormData = this.settings;
  hasUnsavedChanges = false;
  loading = false;

  constructor() {
    makeAutoObservable(this);
    this.loadSavedSettings();
  }

  loadSavedSettings() {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      runInAction(() => {
        this.settings = JSON.parse(savedSettings);
        this.tempSettings = { ...this.settings };
      });
    }
  }

  saveToLocalStorage(settingsToSave: SettingsFormData) {
    localStorage.setItem("userSettings", JSON.stringify(settingsToSave));
  }

  setTheme(theme: string) {
    this.tempSettings = { ...this.tempSettings, theme };
  }

  setLanguage(language: string) {
    this.tempSettings = { ...this.tempSettings, language };
  }

  setFontSize(fontSize: number) {
    this.tempSettings = { ...this.tempSettings, fontSize };
  }

  setNotifications(notifications: boolean) {
    this.tempSettings = { ...this.tempSettings, notifications };
  }

  setEmailNotifications(emailNotifications: boolean) {
    this.tempSettings = { ...this.tempSettings, emailNotifications };
  }

  setAutoSave(autoSave: boolean) {
    this.tempSettings = { ...this.tempSettings, autoSave };
  }

  setDisplayName(displayName: string) {
    this.tempSettings = { ...this.tempSettings, displayName };
  }

  setEmail(email: string) {
    this.tempSettings = { ...this.tempSettings, email };
  }

  setHasUnsavedChanges(value: boolean) {
    this.hasUnsavedChanges = value;
  }

  setLoading(value: boolean) {
    this.loading = value;
  }

  saveSettings(newSettings: SettingsFormData) {
    runInAction(() => {
      this.settings = { ...newSettings };
      this.tempSettings = { ...newSettings };
      this.saveToLocalStorage(newSettings);
      this.hasUnsavedChanges = false;
    });
  }

  resetSettings() {
    const defaultSettings: SettingsFormData = {
      theme: "light",
      language: "en",
      fontSize: 14,
      notifications: true,
      emailNotifications: false,
      autoSave: true,
      displayName: "John Doe",
      email: "john.doe@dcwd.gov.ph",
    };

    runInAction(() => {
      this.settings = defaultSettings;
      this.tempSettings = { ...defaultSettings };
      this.saveToLocalStorage(defaultSettings);
      this.hasUnsavedChanges = false;
    });
  }

  applySettingsFromDarkMode(isDarkMode: boolean) {
    const currentTheme = isDarkMode ? "dark" : "light";
    
    if (
      this.settings.theme !== "auto" &&
      (
        (this.settings.theme === "dark" && !isDarkMode) ||
        (this.settings.theme === "light" && isDarkMode)
      )
    ) {
      const newSettings = { ...this.settings, theme: currentTheme };
      runInAction(() => {
        this.settings = newSettings;
        this.tempSettings = { ...newSettings };
        this.saveToLocalStorage(newSettings);
      });
    }
  }

  syncTempWithSettings() {
    this.tempSettings = { ...this.settings };
    this.hasUnsavedChanges = false;
  }
}

export const settingsStore = new SettingsStore();
