import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

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
    const response = await fetch('https://localhost:7211/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      login(data.token, data.user);
      onClose();
    } else {
      setError('Felaktig e-post eller lösenord');
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
