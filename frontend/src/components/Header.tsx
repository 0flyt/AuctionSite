import './Header.css';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <>
      <div className="header-container">
        <h1>AuctionSite</h1>
        <input />
        {isAuthenticated ? (
          <>
            <span className="header-user">
              <span className="header-user-avatar">
                {user?.username.charAt(0).toUpperCase()}
              </span>
              Konto
            </span>
            <Button
              label="Logga ut"
              variant="secondary"
              type="button"
              onClick={logout}
            />
          </>
        ) : (
          <>
            <Button
              label="Logga in"
              variant="primary"
              type="button"
              onClick={onLoginClick}
            />
            <Button
              label="Skapa konto"
              variant="secondary"
              type="button"
              onClick={onRegisterClick}
            />
          </>
        )}
      </div>
    </>
  );
}
