import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import './UserProfile.css';

export function UserProfile() {
  const { user, token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordUpdate = async () => {
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }

    const response = await fetch(
      `https://localhost:7211/api/users/${user?.id}/password`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      },
    );

    if (response.ok) {
      setSuccess('Lösenordet är uppdaterat!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      const msg = await response.text();
      setError(msg);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="profile-username">{user?.username}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        <hr className="profile-divider" />

        <div className="profile-section">
          <h2 className="profile-section-title">Uppdatera lösenord</h2>
          <Input
            label="Nuvarande lösenord"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="Nytt lösenord"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="Bekräfta nytt lösenord"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <Button
            label="Spara lösenord"
            variant="primary"
            type="button"
            onClick={handlePasswordUpdate}
          />
        </div>
      </div>
    </div>
  );
}
