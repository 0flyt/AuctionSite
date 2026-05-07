import { useState } from 'react';
import { Header } from './components/Header';
import { LoginDrawer } from './pages/LoginDrawer';

// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  // const [users, setUsers] = useState<User[]>([]);

  // useEffect(() => {
  //   fetch('https://localhost:7211/api/users')
  //     .then((res) => res.json())
  //     .then((data) => setUsers(data));
  // }, []);

  return (
    <div>
      <Header
        onLoginClick={() => {
          setMode('login');
          setShowLogin(true);
        }}
        onRegisterClick={() => {
          setMode('register');
          setShowLogin(true);
        }}
      />
      <LoginDrawer
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        mode={mode}
        onChangeMode={setMode}
      />
    </div>
  );
}

export default App;
