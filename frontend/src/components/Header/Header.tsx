import './Header.css';
import { Button } from '../ui/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAccountClick = () => {
    if (isAdmin) navigate('/admin');
    else navigate('/account');
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-logo" onClick={() => navigate('/')}>
          AuctionSite
        </h1>

        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <span className="header-user" onClick={handleAccountClick}>
                <span className="header-user-avatar">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
                Konto
              </span>
              <Button
                label="Logga ut"
                variant="secondary"
                type="button"
                onClick={handleLogout}
              />
              <Button
                label="Ny annons"
                variant="primary"
                type="button"
                onClick={() => navigate('/skapa-annons')}
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
        </nav>

        <button
          className="header-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <div className="header-mobile-menu">
          {isAuthenticated ? (
            <>
              <button className="mobile-menu-item" onClick={handleAccountClick}>
                Konto
              </button>
              <button
                className="mobile-menu-item"
                onClick={() => {
                  navigate('/skapa-annons');
                  setMenuOpen(false);
                }}
              >
                Ny annons
              </button>
              <button className="mobile-menu-item" onClick={handleLogout}>
                Logga ut
              </button>
            </>
          ) : (
            <>
              <button
                className="mobile-menu-item"
                onClick={() => {
                  onLoginClick();
                  setMenuOpen(false);
                }}
              >
                Logga in
              </button>
              <button
                className="mobile-menu-item"
                onClick={() => {
                  onRegisterClick();
                  setMenuOpen(false);
                }}
              >
                Skapa konto
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
