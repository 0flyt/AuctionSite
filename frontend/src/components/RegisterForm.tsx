import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface RegisterFormProps {
  onChangeToLogin: () => void;
}

export function RegisterForm({ onChangeToLogin }: RegisterFormProps) {
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

    const response = await fetch('https://localhost:7211/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      onChangeToLogin();
    } else {
      setError('Något gick fel, försök igen');
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
