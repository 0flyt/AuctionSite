import { useState } from 'react';
import { Header } from './components/Header/Header';
import { LoginDrawer } from './pages/LoginDrawer/LoginDrawer';
import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home/Home';
import { CreateAuction } from './pages/CreateAuction/CreateAuction';
import { AuctionDetail } from './pages/AuctionDetails/AuctionDetail';
import { UserProfile } from './pages/UserProfile/UserProfile';
import { Admin } from './pages/Admin/Admin';
import { EditAuction } from './pages/EditAuction/EditAuction';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');

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
