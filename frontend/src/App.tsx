import { useState } from 'react';
import { Header } from './components/Header';
import { LoginDrawer } from './pages/LoginDrawer';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateAuction } from './pages/CreateAuction';
import { AuctionDetail } from './pages/AuctionDetail';
import { UserProfile } from './pages/UserProfile';
import { Admin } from './pages/Admin';
import { EditAuction } from './pages/EditAuction';

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/skapa-annons" element={<CreateAuction />} />
        <Route path="/auktion/:id" element={<AuctionDetail />} />
        <Route path="/account" element={<UserProfile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/auktion/:id/redigera" element={<EditAuction />} />
      </Routes>
    </div>
  );
}

export default App;
