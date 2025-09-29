import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Switch, 
  Select, 
  Slider, 
  Button, 
  Typography, 
  Divider, 
  Space,
  Form,
  Input,
  notification,
  Avatar,
  Upload
} from "antd";
import {
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  EyeOutlined,
  GlobalOutlined,
  LockOutlined,
  SaveOutlined,
  ReloadOutlined,
  CameraOutlined
} from "@ant-design/icons";
import "../styles/Settings.css";

const { Title, Text } = Typography;
const { Option } = Select;

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

interface SettingsProps {
  isDarkMode?: boolean;
  setIsDarkMode?: (value: boolean) => void;
}

const Settings: React.FC<SettingsProps> = observer(({ isDarkMode, setIsDarkMode }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Load saved settings from localStorage
  const loadSavedSettings = (): SettingsFormData => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      theme: 'light',
      language: 'en',
      fontSize: 14,
      notifications: true,
      emailNotifications: false,
      autoSave: true,
      displayName: 'John Doe',
      email: 'john.doe@dcwd.gov.ph'
    };
  };

  const [settings, setSettings] = useState<SettingsFormData>(loadSavedSettings());
  const [tempSettings, setTempSettings] = useState<SettingsFormData>(settings);

  // Apply theme and font size only for saved settings
  useEffect(() => {
    applyTheme(settings.theme);
    applyFontSize(settings.fontSize);
  }, [settings.theme, settings.fontSize]);

  // Sync theme settings when header dark mode changes
  useEffect(() => {
    if (isDarkMode !== undefined) {
      const currentTheme = isDarkMode ? 'dark' : 'light';
      // Only update if the current theme setting doesn't match
      if (settings.theme !== 'auto' && 
          ((settings.theme === 'dark' && !isDarkMode) || 
           (settings.theme === 'light' && isDarkMode))) {
        const newSettings = { ...settings, theme: currentTheme };
        setSettings(newSettings);
        setTempSettings(newSettings);
        saveToLocalStorage(newSettings);
        form.setFieldValue('theme', currentTheme);
      }
    }
  }, [isDarkMode]);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    let shouldBeDark = false;
    
    if (theme === 'dark') {
      shouldBeDark = true;
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      shouldBeDark = false;
      root.setAttribute('data-theme', 'light');
    } else if (theme === 'auto') {
      // Auto theme - follow system preference
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', shouldBeDark ? 'dark' : 'light');
    }
    
    // Sync with header dark mode state
    if (setIsDarkMode && isDarkMode !== shouldBeDark) {
      setIsDarkMode(shouldBeDark);
    }
  };

  const applyFontSize = (fontSize: number) => {
    const root = document.documentElement;
    root.style.setProperty('--base-font-size', `${fontSize}px`);
  };

  const saveToLocalStorage = (settingsToSave: SettingsFormData) => {
    localStorage.setItem('userSettings', JSON.stringify(settingsToSave));
  };

  const handleAutoSave = (newSettings: SettingsFormData) => {
    if (newSettings.autoSave) {
      setSettings(newSettings);
      saveToLocalStorage(newSettings);
      setHasUnsavedChanges(false);
      
      notification.success({
        message: 'Auto-saved',
        description: 'Changes saved automatically',
        placement: 'topRight',
        duration: 2
      });
    } else {
      setHasUnsavedChanges(true);
    }
  };

  const handleThemeChange = (theme: string) => {
    const newSettings = { ...tempSettings, theme };
    setTempSettings(newSettings);
    form.setFieldValue('theme', theme);
    
    if (tempSettings.autoSave) {
      setSettings(newSettings);
      saveToLocalStorage(newSettings);
      applyTheme(theme);
      
      notification.success({
        message: 'Theme Updated',
        description: `Theme changed to ${theme === 'auto' ? 'Auto (System)' : theme === 'dark' ? 'Dark' : 'Light'}`,
        placement: 'topRight',
        duration: 2
      });
      setHasUnsavedChanges(false);
    } else {
      setHasUnsavedChanges(true);
      notification.info({
        message: 'Theme Changed',
        description: 'Click "Save Settings" to apply changes',
        placement: 'topRight',
        duration: 3
      });
    }
  };

  const handleFontSizeChange = (fontSize: number) => {
    const newSettings = { ...tempSettings, fontSize };
    setTempSettings(newSettings);
    form.setFieldValue('fontSize', fontSize);
    
    if (tempSettings.autoSave) {
      setSettings(newSettings);
      saveToLocalStorage(newSettings);
      applyFontSize(fontSize);
      setHasUnsavedChanges(false);
    } else {
      setHasUnsavedChanges(true);
    }
  };

  const handleAutoSaveToggle = (checked: boolean) => {
    const newSettings = { ...tempSettings, autoSave: checked };
    setTempSettings(newSettings);
    form.setFieldValue('autoSave', checked);
    
    if (checked) {
      // If enabling autosave, save all current temp settings
      setSettings(newSettings);
      saveToLocalStorage(newSettings);
      applyTheme(newSettings.theme);
      applyFontSize(newSettings.fontSize);
      setHasUnsavedChanges(false);
      
      notification.success({
        message: 'Auto-save Enabled',
        description: 'All changes have been saved and will auto-save from now on',
        placement: 'topRight',
        duration: 3
      });
    } else {
      notification.info({
        message: 'Auto-save Disabled',
        description: 'You will need to manually save changes',
        placement: 'topRight',
        duration: 3
      });
    }
  };

  const handleSaveSettings = async (values: SettingsFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(values);
      setTempSettings(values);
      saveToLocalStorage(values);
      applyTheme(values.theme);
      applyFontSize(values.fontSize);
      setHasUnsavedChanges(false);
      
      notification.success({
        message: 'Settings Saved',
        description: 'Your settings have been saved successfully.',
        placement: 'topRight'
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to save settings. Please try again.',
        placement: 'topRight'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    const defaultSettings: SettingsFormData = {
      theme: 'light',
      language: 'en',
      fontSize: 14,
      notifications: true,
      emailNotifications: false,
      autoSave: true,
      displayName: 'John Doe',
      email: 'john.doe@dcwd.gov.ph'
    };
    
    form.setFieldsValue(defaultSettings);
    setSettings(defaultSettings);
    setTempSettings(defaultSettings);
    saveToLocalStorage(defaultSettings);
    applyTheme(defaultSettings.theme);
    applyFontSize(defaultSettings.fontSize);
    setHasUnsavedChanges(false);
    
    notification.info({
      message: 'Settings Reset',
      description: 'Settings have been reset to default values and saved.',
      placement: 'topRight'
    });
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div className="settings-title-section">
          <SettingOutlined className="settings-icon" />
          <div>
            <Title level={1} className="settings-title">Settings</Title>
            <Title level={4} className="settings-subtitle">Manage your account and application preferences</Title>
          </div>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={tempSettings}
        onFinish={handleSaveSettings}
        className="settings-form"
      >
        <Row gutter={[24, 24]}>
          {/* Profile Settings */}
          <Col xs={24} lg={12}>
            <Card className="settings-card" title={
              <Space>
                <UserOutlined />
                <span>Profile Settings</span>
              </Space>
            }>
              <div className="profile-avatar-section">
                <Avatar size={80} icon={<UserOutlined />} className="profile-avatar" />
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                >
                  <Button icon={<CameraOutlined />} size="small">
                    Change Photo
                  </Button>
                </Upload>
              </div>
              
              <Form.Item
                label="Display Name"
                name="displayName"
                rules={[{ required: true, message: 'Please enter your display name' }]}
              >
                <Input placeholder="Enter your display name" />
              </Form.Item>

              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input placeholder="Enter your email address" />
              </Form.Item>
            </Card>
          </Col>

          {/* Appearance Settings */}
          <Col xs={24} lg={12}>
            <Card className="settings-card" title={
              <Space>
                <EyeOutlined />
                <span>Appearance</span>
              </Space>
            }>
              <Form.Item label="Theme" name="theme">
                <Select 
                  value={tempSettings.theme}
                  onChange={handleThemeChange}
                  size="large"
                >
                  <Option value="light">
                    <Space>
                      <span>☀️</span>
                      <span>Light</span>
                    </Space>
                  </Option>
                  <Option value="dark">
                    <Space>
                      <span>🌙</span>
                      <span>Dark</span>
                    </Space>
                  </Option>
                  <Option value="auto">
                    <Space>
                      <span>🔄</span>
                      <span>Auto (System)</span>
                    </Space>
                  </Option>
                </Select>
                <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  💡 Theme changes sync with the dark mode button in the header
                </Text>
              </Form.Item>

              <Form.Item label="Language" name="language">
                <Select size="large">
                  <Option value="en">
                    <Space>
                      <span>🇺🇸</span>
                      <span>English</span>
                    </Space>
                  </Option>
                  <Option value="fil">
                    <Space>
                      <span>🇵🇭</span>
                      <span>Filipino</span>
                    </Space>
                  </Option>
                  <Option value="ceb">
                    <Space>
                      <span>🏝️</span>
                      <span>Cebuano</span>
                    </Space>
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item label="Font Size" name="fontSize">
                <div className="font-size-setting">
                  <div className="font-size-preview">
                    <Text 
                      className="preview-text"
                      style={{ fontSize: `${tempSettings.fontSize}px` }}
                    >
                      Sample Text Preview
                    </Text>
                    <Text type="secondary" className="preview-size">
                      {tempSettings.fontSize}px
                    </Text>
                  </div>
                  <Slider
                    min={12}
                    max={20}
                    value={tempSettings.fontSize}
                    onChange={handleFontSizeChange}
                    marks={{
                      12: 'XS',
                      14: 'SM',
                      16: 'MD',
                      18: 'LG',
                      20: 'XL'
                    }}
                    step={1}
                    tooltip={{ 
                      formatter: (value) => `${value}px`,
                      placement: 'top'
                    }}
                  />
                </div>
              </Form.Item>
            </Card>
          </Col>

          {/* Notifications Settings */}
          <Col xs={24} lg={12}>
            <Card className="settings-card" title={
              <Space>
                <BellOutlined />
                <span>Notifications</span>
              </Space>
            }>
              <div className="settings-switch-group">
                <Form.Item name="notifications" valuePropName="checked">
                  <div className="switch-item">
                    <div className="switch-info">
                      <Text strong>Push Notifications</Text>
                      <Text type="secondary"> Receive notifications in the application</Text>
                    </div>
                    <Switch />
                  </div>
                </Form.Item>

                <Form.Item name="emailNotifications" valuePropName="checked">
                  <div className="switch-item">
                    <div className="switch-info">
                      <Text strong>Email Notifications</Text>
                      <Text type="secondary"> Receive notifications via email</Text>
                    </div>
                    <Switch />
                  </div>
                </Form.Item>
              </div>
            </Card>
          </Col>

          {/* System Settings */}
          <Col xs={24} lg={12}>
            <Card className="settings-card" title={
              <Space>
                <GlobalOutlined />
                <span>System</span>
              </Space>
            }>
              <div className="settings-switch-group">
                <Form.Item name="autoSave" valuePropName="checked">
                  <div className="switch-item">
                    <div className="switch-info">
                      <Text strong>Auto Save</Text>
                      <Text type="secondary"> Automatically save changes</Text>
                    </div>
                    <Switch 
                      checked={tempSettings.autoSave}
                      onChange={handleAutoSaveToggle}
                    />
                  </div>
                </Form.Item>
              </div>

              <Divider />

              <div className="system-info">
                <Text type="secondary">System Version: 2.1.0</Text>
                <br />
                <Text type="secondary">Last Updated: September 25, 2025</Text>
              </div>
            </Card>
          </Col>

          {/* Security Settings */}
          <Col xs={24}>
            <Card className="settings-card" title={
              <Space>
                <LockOutlined />
                <span>Security & Privacy</span>
              </Space>
            }>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Button type="default" block>
                    Change Password
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button type="default" block>
                    Two-Factor Authentication
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button type="default" block>
                    Privacy Settings
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Action Buttons */}
        <div className="settings-actions">
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
              disabled={!hasUnsavedChanges && !tempSettings.autoSave}
            >
              {hasUnsavedChanges ? 'Save Changes' : 'Save Settings'}
            </Button>
            <Button 
              type="default" 
              onClick={handleResetSettings}
              icon={<ReloadOutlined />}
              size="large"
            >
              Reset to Default
            </Button>
          </Space>
          {hasUnsavedChanges && (
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <Text type="warning" style={{ fontSize: '14px' }}>
                ⚠️ You have unsaved changes. {tempSettings.autoSave ? '' : 'Click "Save Changes" to apply them.'}
              </Text>
            </div>
          )}
        </div>
      </Form>
    </div>
  );
});

export default Settings;