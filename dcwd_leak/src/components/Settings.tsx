import React, { useEffect } from 'react';
import { makeAutoObservable, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import '../styles/Settings.css';
import { Card, Avatar, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { devApi } from '../components/Endpoints/Interceptor';

interface EditProfileFormProps {
  employeeId: string;
  setEmployeeId: (value: string) => void;
  profileEmail: string;
  setProfileEmail: (value: string) => void;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  onSave: () => void;
  saving: boolean;
}


class ProfileStore {
  employeeId = 'EMP-00123';
  profileEmail = '';
  firstName = '';
  lastName = '';
  middlename = '';
  email = '';
  mobile = '';
  department = '';
  saving = false;
  contactSaving = false;
  showContactPreview = false;
  showProfilePreview = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchProfile() {
    const empId = localStorage.getItem('username');
    if (!empId) return;

    try {
      const res = await devApi.get(
        `dcwd-gis/api/v1/admin/useraccounts/GetByEmployeeID`,
        { params: { empId } }
      );

      const data = res.data;
      if (data?.statusCode === 200 && data?.data) {
        const user = data.data;
        runInAction(() => {
          this.employeeId = user.empId || '';
          this.profileEmail = user.username || '';
          this.firstName = user.firstname || '';
          this.middlename = user.middlename || '';
          this.lastName = user.lastname || '';
          this.email = user.username || '';
          this.mobile = user.mobileNo || '';
          this.department = user.department || '';
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }

  handleProfileSave() {
    this.saving = true;
    setTimeout(() => {
      runInAction(() => {
        this.saving = false;
        this.showProfilePreview = true;
      });
      message.success('Profile updated!');
    }, 1000);
  }

  handleContactSave() {
    this.contactSaving = true;
    setTimeout(() => {
      runInAction(() => {
        this.contactSaving = false;
        this.showContactPreview = true;
      });
      message.success('Contact details updated!');
    }, 1000);
  }
}

const profileStore = new ProfileStore();


function EditProfileForm({
  employeeId,
  setEmployeeId,
  profileEmail,
  setProfileEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  onSave,
  saving,
}: EditProfileFormProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 500 }}>Employee ID:</span>
          <Input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 500 }}>Email Address:</span>
          <Input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 500 }}>First Name:</span>
          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 500 }}>Last Name:</span>
          <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>
      <Button type="primary" onClick={onSave} loading={saving} style={{ alignSelf: 'flex-end' }}>
        Update
      </Button>
    </div>
  );
}


const Settings: React.FC = observer(() => {
  useEffect(() => {
    profileStore.fetchProfile();
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >

      <div
        style={{
          width: '100%',
          background: 'linear-gradient(90deg, #174ea6, #4c85d4)',
          padding: '40px 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 280,
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            maxWidth: 1000,
            gap: 32,
          }}
        >

          <div
            className="animated-avatar"
            style={{
              backgroundColor: '#dbeafe',
              borderRadius: '50%',
              padding: 14,
              border: '3px solid #174ea6',
            }}
          >
            <Avatar
              size={100}
              icon={<UserOutlined />}
              style={{ backgroundColor: '#fff', color: '#174ea6', fontSize: 36 }}
            />
          </div>


          <div style={{ flex: 1 }}>
            <div
              style={{ fontWeight: 700, fontSize: 20, color: '#174ea6', textTransform: 'uppercase' }}
            >
              {`${profileStore.firstName} ${profileStore.middlename} ${profileStore.lastName}`}
            </div>
            <div style={{ fontSize: 14, color: '#333', marginTop: 4 }}>{`${profileStore.department}`}</div>
          </div>

    
          {(profileStore.showContactPreview || profileStore.showProfilePreview) && (
            <div
              style={{
                flex: 1,
                background: '#f9f9f9',
                padding: 16,
                borderRadius: 12,
                transition: 'all 0.3s ease',
                boxShadow: '0 0 0 3px #d6e4ff',
              }}
            >
              <div style={{ fontWeight: 500, marginBottom: 8 }}>Preview:</div>
              {profileStore.showContactPreview && (
                <>
                  <div>Email: {profileStore.email}</div>
                  <div>Mobile: {profileStore.mobile}</div>
                </>
              )}
              {profileStore.showProfilePreview && (
                <>
                  <div style={{ marginTop: 12 }}>Employee ID: {profileStore.employeeId}</div>
                  <div>Email: {profileStore.profileEmail}</div>
                  <div>First Name: {profileStore.firstName}</div>
                  <div>Last Name: {profileStore.lastName}</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

  
      <div style={{ display: 'flex', flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
    
        <Card title="Contact Details" style={{ flex: 1, minWidth: 280 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <span style={{ fontWeight: 500 }}>Email Address:</span>
              <Input
                value={profileStore.email}
                onChange={(e) => (profileStore.email = e.target.value)}
              />
            </div>
            <div>
              <span style={{ fontWeight: 500 }}>Mobile No.:</span>
              <Input
                value={profileStore.mobile}
                onChange={(e) => (profileStore.mobile = e.target.value)}
              />
            </div>
            <Button
              type="primary"
              loading={profileStore.contactSaving}
              onClick={() => profileStore.handleContactSave()}
              style={{ alignSelf: 'flex-end' }}
            >
              Update
            </Button>
          </div>
        </Card>

        <Card title="Edit Profile" style={{ flex: 1, minWidth: 280 }}>
          <EditProfileForm
            employeeId={profileStore.employeeId}
            setEmployeeId={(val) => (profileStore.employeeId = val)}
            profileEmail={profileStore.profileEmail}
            setProfileEmail={(val) => (profileStore.profileEmail = val)}
            firstName={profileStore.firstName}
            setFirstName={(val) => (profileStore.firstName = val)}
            lastName={profileStore.lastName}
            setLastName={(val) => (profileStore.lastName = val)}
            onSave={() => profileStore.handleProfileSave()}
            saving={profileStore.saving}
          />
        </Card>
      </div>
    </div>
  );
});

export default Settings;
