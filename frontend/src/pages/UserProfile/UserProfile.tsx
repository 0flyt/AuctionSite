import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { userService } from '../../services/userService';
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

    if (newPassword.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Lösenorden matchar inte.');
      return;
    }

    const { ok, data } = await userService.updatePassword(
      user!.id,
      currentPassword,
      newPassword,
      token!,
    );

    if (ok) {
      setSuccess('Lösenordet är uppdaterat!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(data || 'Något gick fel.');
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
