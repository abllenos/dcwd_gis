import React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import '../styles/Settings.css';
import { Card, Avatar, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

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

function Settings() {
  const [employeeId, setEmployeeId] = React.useState('EMP-00123');
  const [profileEmail, setProfileEmail] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [contactSaving, setContactSaving] = React.useState(false);
  const [department, setDepartment] = React.useState('');

  const [showContactPreview, setShowContactPreview] = React.useState(false);
  const [showProfilePreview, setShowProfilePreview] = React.useState(false);

  React.useEffect(() => {
  const empId = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  if (!empId) return;

  const fetchProfile = async () => {
    try {
      const res = await fetch(
        `https://dev-api.davao-water.gov.ph/dcwd-gis/api/v1/admin/useraccounts/GetByEmployeeID?empId=${empId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data?.statusCode === 200 && data?.data) {
        setEmployeeId(data.data.empID || '');
        setProfileEmail(data.data.userName || '');
        setFirstName(data.data.firstName || '');
        setLastName(data.data.lastName || '');
        setEmail(data.data.userName || '');
        setMobile(data.data.mobileNo || '');
        setDepartment(data.data.department || '');
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  fetchProfile();
}, []);

  const handleProfileSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setShowProfilePreview(true);
      message.success('Profile updated!');
    }, 1000);
  };

  const handleContactSave = () => {
    setContactSaving(true);
    setTimeout(() => {
      setContactSaving(false);
      setShowContactPreview(true);
      message.success('Contact details updated!');
    }, 1000);
  };

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
      {/* Header background */}
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
          {/* Animated Avatar */}
          <div className="animated-avatar" style={{
            backgroundColor: '#dbeafe',
            borderRadius: '50%',
            padding: 14,
            border: '3px solid #174ea6',
          }}>
            <Avatar
              size={100}
              icon={<UserOutlined />}
              style={{ backgroundColor: '#fff', color: '#174ea6', fontSize: 36 }}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#174ea6', textTransform: 'uppercase' }}>
              {`${firstName} ${lastName}`}
            </div>
            <div style={{ fontSize: 14, color: '#333', marginTop: 4 }}>
              INFORMATION AND COMMUNICATION TECHNOLOGY DEPARTMENT
            </div>
          </div>

          {/* Preview */}
          {(showContactPreview || showProfilePreview) && (
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
              {showContactPreview && (
                <>
                  <div>Email: {email}</div>
                  <div>Mobile: {mobile}</div>
                </>
              )}
              {showProfilePreview && (
                <>
                  <div style={{ marginTop: 12 }}>Employee ID: {employeeId}</div>
                  <div>Email: {profileEmail}</div>
                  <div>First Name: {firstName}</div>
                  <div>Last Name: {lastName}</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contact & Profile Cards */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
        <Card
          title="Contact Details"
          style={{
            flex: 1,
            minWidth: 280,
            borderRadius: 14,
            background: '#fff',
            boxShadow: '0 4px 18px rgba(44, 98, 186, 0.08)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <span style={{ fontWeight: 500 }}>Email Address:</span>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <span style={{ fontWeight: 500 }}>Mobile No.:</span>
              <Input value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>
            <Button
              type="primary"
              loading={contactSaving}
              onClick={handleContactSave}
              style={{ alignSelf: 'flex-end' }}
            >
              Update
            </Button>
          </div>
        </Card>

        <Card
          title="Edit Profile"
          style={{
            flex: 1,
            minWidth: 280,
            borderRadius: 14,
            background: '#fff',
            boxShadow: '0 4px 18px rgba(44, 98, 186, 0.08)',
          }}
        >
          <EditProfileForm
            employeeId={employeeId}
            setEmployeeId={setEmployeeId}
            profileEmail={profileEmail}
            setProfileEmail={setProfileEmail}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            onSave={handleProfileSave}
            saving={saving}
          />
        </Card>
      </div>
    </div>
  );
}

export default Settings;
