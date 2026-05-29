import { useState } from 'react';
import { Button } from '../ui/Button/Button';
import { Input } from '../ui/Input/Input';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

interface RegisterFormProps {
  onChangeToLogin: () => void;
}

export function RegisterForm({ onChangeToLogin }: RegisterFormProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');

    if (!username.trim()) {
      setError('Användarnamn måste fyllas i.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ange en giltig e-postadress.');
      return;
    }

    if (password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken.');
      return;
    }

    if (password !== passwordCheck) {
      setError('Lösenorden matchar inte.');
      return;
    }

    const { ok, error } = await authService.register(username, email, password);

    if (ok) {
      const loginResult = await authService.login(email, password);
      if (loginResult.ok) {
        login(loginResult.data.token, loginResult.data.user);
      }
      onChangeToLogin();
    } else {
      setError(error || 'Något gick fel, försök igen.');
    }
  };

  return (
    <>
      <h1>Skapa konto</h1>
      <div className="login-field">
        <Input
          label="Användarnamn"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

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

        <Input
          label="Bekräfta lösenord"
          type="password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <Button
        label="Skapa konto"
        variant="primary"
        type="button"
        onClick={handleRegister}
      />

      <Button
        label="Har redan konto?"
        variant="secondary"
        type="button"
        onClick={onChangeToLogin}
      />
    </>
  );
}
