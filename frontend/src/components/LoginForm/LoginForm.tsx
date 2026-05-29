import { useState } from 'react';
import { Button } from '../ui/Button/Button';
import { Input } from '../ui/Input/Input';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

interface LoginFormProps {
  onChangeToRegister: () => void;
  onClose: () => void;
}

export function LoginForm({ onChangeToRegister, onClose }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ange en giltig e-postadress.');
      return;
    }

    if (!password.trim()) {
      setError('Lösenord måste fyllas i.');
      return;
    }

    const { ok, data, error } = await authService.login(email, password);

    if (ok) {
      login(data.token, data.user);
      onClose();
    } else {
      setError(error || 'Felaktig e-post eller lösenord.');
    }
  };

  return (
    <>
      <h1>Logga in</h1>
      <div className="login-field">
        <Input
          label="E-postadress"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Lösenord"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="login-remember">
        <input type="checkbox" id="remember" />
        <label htmlFor="remember">Fortsätt vara inloggad</label>
      </div>

      <Button
        label="Logga in"
        variant="primary"
        type="submit"
        onClick={handleLogin}
      />
      <p>Glömt lösenord?</p>
      <Button
        label="Skapa konto"
        variant="secondary"
        type="button"
        onClick={onChangeToRegister}
      />
    </>
  );
}
