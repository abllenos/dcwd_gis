import React from 'react';
import '../styles/Settings.css';
import { Card, Avatar, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// Edit Profile Form Component
function EditProfileForm() {
  const [employeeId, setEmployeeId] = React.useState('EMP-00123');
  const [profileEmail, setProfileEmail] = React.useState('juan.delacruz@email.com');
  const [firstName, setFirstName] = React.useState('Juan');
  const [lastName, setLastName] = React.useState('Dela Cruz');
  const [saving, setSaving] = React.useState(false);

  const handleProfileSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      message.success('Profile updated!');
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Row: Employee ID & Email Address */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 500, color: '#000' }}>Employee ID:</span>
          <Input
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
            style={{ marginTop: 4, fontSize: 15, color: '#000', background: '#fff', caretColor: '#000' }}
            placeholder="Enter employee ID"
          />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 500, color: '#000' }}>Email Address:</span>
          <Input
            value={profileEmail}
            onChange={e => setProfileEmail(e.target.value)}
            style={{ marginTop: 4, fontSize: 15, color: '#000', background: '#fff', caretColor: '#000' }}
            placeholder="Enter email address"
            type="email"
          />
        </div>
      </div>
      {/* Row: First Name & Last Name */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 500, color: '#000' }}>First Name:</span>
          <Input
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            style={{ marginTop: 4, fontSize: 15, color: '#000', background: '#fff', caretColor: '#000' }}
            placeholder="Enter first name"
          />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontWeight: 500, color: '#000' }}>Last Name:</span>
          <Input
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            style={{ marginTop: 4, fontSize: 15, color: '#000', background: '#fff', caretColor: '#000' }}
            placeholder="Enter last name"
          />
        </div>
      </div>
      <Button
        type="primary"
        onClick={handleProfileSave}
        loading={saving}
        style={{ alignSelf: 'flex-end', marginTop: 8, background: '#174ea6', borderColor: '#174ea6', color: '#fff' }}
      >
        Update
      </Button>
    </div>
  );
}

function Settings() {
  const [email, setEmail] = React.useState('juan.delacruz@email.com');
  const [mobile, setMobile] = React.useState('09171234567');
  const [loading, setLoading] = React.useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Contact details updated!');
    }, 1000);
  };

  return (
    <div style={{ padding: 24, minHeight: '80vh', background: '#f5f7fa', position: 'relative' }}>
      {/* Decorative background behind profile */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 520,
        height: 220,
        zIndex: 0,
        background: 'radial-gradient(circle at 60% 40%, #6ba5f7 0%, #4c85d4 60%, transparent 100%)',
        borderRadius: 32,
        filter: 'blur(2px)',
        opacity: 0.35,
      }} />
      <Card
        bordered={false}
        style={{
          maxWidth: 500,
          margin: '0 auto',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(135deg, #e3edfa 0%, #f5f7fa 100%)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <Avatar size={80} icon={<UserOutlined />} style={{ background: 'linear-gradient(135deg, #4c85d4 60%, #6ba5f7 100%)', marginBottom: 12, boxShadow: '0 4px 16px rgba(76,133,212,0.18)' }} />
          <div style={{ fontWeight: 600, fontSize: 20, color: '#000' }}>ALVIN LLENOS</div>
          <div style={{ color: '#000', fontSize: 15, marginTop: 2 }}>INFORMATION AND COMMUNATION TECHNOLOGY DEPARTMENT</div>
        </div>
      </Card>

      {/* Contact Details and Edit Profile Cards Side by Side */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 24, marginTop: 24, alignItems: 'flex-start' }}>
        {/* Contact Details Card */}
        <Card
          title="Contact Details"
          bordered={false}
          style={{
            flex: 1,
            minWidth: 260,
            borderRadius: 14,
            boxShadow: '0 4px 18px rgba(44, 98, 186, 0.10)',
            position: 'relative',
            zIndex: 1,
            background: 'linear-gradient(135deg, #fafdff 60%, #e9f1fb 100%)',
            border: 'none',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <span style={{ fontWeight: 500, color: '#000' }}>Email Address:</span>
              <Input
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ marginTop: 4, fontSize: 15, color: '#000', background: '#fff', caretColor: '#000' }}
                placeholder="Enter email address"
                type="email"
              />
            </div>
            <div>
              <span style={{ fontWeight: 500, color: '#000' }}>Mobile No.:</span>
              <Input
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                style={{ marginTop: 4, fontSize: 15, color: '#000', background: '#fff', caretColor: '#000' }}
                placeholder="Enter mobile number"
              />
            </div>
            <Button
              type="primary"
              onClick={handleSave}
              loading={loading}
              style={{ alignSelf: 'flex-end', marginTop: 8, background: '#174ea6', borderColor: '#174ea6', color: '#fff' }}
            >
              Update
            </Button>
          </div>
        </Card>

        {/* Edit Profile Card */}
        <Card
          title="Edit Profile"
          bordered={false}
          style={{
            flex: 1,
            minWidth: 260,
            borderRadius: 14,
            boxShadow: '0 4px 18px rgba(44, 98, 186, 0.10)',
            position: 'relative',
            zIndex: 1,
            background: 'linear-gradient(135deg, #fafdff 60%, #e9f1fb 100%)',
            border: 'none',
          }}
        >
          <EditProfileForm />
        </Card>
      </div>

    </div>
  );
}

export default Settings;
