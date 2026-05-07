import './Header.css';
import { Button } from './ui/Button';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  return (
    <>
      <div className="header-container">
        <h1>AuctionSite</h1>
        <input />
        <Button
          label="Logga in"
          variant="primary"
          type="button"
          onClick={onLoginClick}
        />
        <Button
          label="Skapa konto"
          variant="primary"
          type="button"
          onClick={onRegisterClick}
        />
      </div>
    </>
  );
}
