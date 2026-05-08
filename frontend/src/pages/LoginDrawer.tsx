import './LoginDrawer.css';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

interface LoginDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onChangeMode: (mode: 'login' | 'register') => void;
}

export function LoginDrawer({
  isOpen,
  onClose,
  mode,
  onChangeMode,
}: LoginDrawerProps) {
  return (
    <div className={`drawer ${isOpen ? 'drawer-open' : ''}`}>
      <button className="drawer-close" onClick={onClose}>
        X
      </button>
      {mode === 'login' ? (
        <LoginForm
          onChangeToRegister={() => onChangeMode('register')}
          onClose={onClose}
        />
      ) : (
        <RegisterForm onChangeToLogin={() => onChangeMode('login')} />
      )}
    </div>
  );
}
