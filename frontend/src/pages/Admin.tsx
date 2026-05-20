import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import './Admin.css';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
}

interface AdminAuction {
  id: number;
  title: string;
  username: string;
  isActive: boolean;
  endDate: string;
}

export function Admin() {
  const { token, isAdmin } = useAuth();
  const [tab, setTab] = useState<'users' | 'auctions'>('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [auctions, setAuctions] = useState<AdminAuction[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [auctionSearch, setAuctionSearch] = useState('');

  const fetchUsers = async () => {
    const res = await fetch(
      `https://localhost:7211/api/users${userSearch ? `?username=${userSearch}` : ''}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data = await res.json();
    setUsers(data);
  };

  const fetchAuctions = async () => {
    const res = await fetch(
      `https://localhost:7211/api/auctions${auctionSearch ? `?title=${auctionSearch}` : ''}`,
    );
    const data = await res.json();
    setAuctions(data);
  };

  const toggleUser = async (id: number) => {
    await fetch(`https://localhost:7211/api/users/${id}/deactivate`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const toggleAuction = async (id: number) => {
    await fetch(`https://localhost:7211/api/auctions/${id}/deactivate`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAuctions();
  };

  if (!isAdmin) return <p>Åtkomst nekad.</p>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Adminpanel</h1>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === 'users' ? 'active' : ''}`}
          onClick={() => setTab('users')}
        >
          Användare
        </button>
        <button
          className={`admin-tab ${tab === 'auctions' ? 'active' : ''}`}
          onClick={() => setTab('auctions')}
        >
          Auktioner
        </button>
      </div>

      {tab === 'users' && (
        <div className="admin-section">
          <div className="admin-search">
            <input
              className="admin-search-input"
              placeholder="Sök användare..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
            <Button
              label="Sök"
              variant="primary"
              type="button"
              onClick={fetchUsers}
            />
          </div>
          {users.length === 0 ? (
            <p className="admin-empty">Sök efter en användare ovan.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Användarnamn</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Åtgärd</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td
                      className={
                        user.isActive ? 'status-active' : 'status-inactive'
                      }
                    >
                      {user.isActive ? 'Aktiv' : 'Inaktiv'}
                    </td>
                    <td>
                      <Button
                        label={user.isActive ? 'Inaktivera' : 'Aktivera'}
                        variant={user.isActive ? 'secondary' : 'primary'}
                        type="button"
                        onClick={() => toggleUser(user.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'auctions' && (
        <div className="admin-section">
          <div className="admin-search">
            <input
              className="admin-search-input"
              placeholder="Sök auktioner..."
              value={auctionSearch}
              onChange={(e) => setAuctionSearch(e.target.value)}
            />
            <Button
              label="Sök"
              variant="primary"
              type="button"
              onClick={fetchAuctions}
            />
          </div>
          {auctions.length === 0 ? (
            <p className="admin-empty">Sök efter en auktion ovan.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Titel</th>
                  <th>Säljare</th>
                  <th>Avslutas</th>
                  <th>Status</th>
                  <th>Åtgärd</th>
                </tr>
              </thead>
              <tbody>
                {auctions.map((auction) => (
                  <tr key={auction.id}>
                    <td>{auction.title}</td>
                    <td>{auction.username}</td>
                    <td>
                      {new Date(auction.endDate).toLocaleDateString('sv-SE')}
                    </td>
                    <td
                      className={
                        auction.isActive ? 'status-active' : 'status-inactive'
                      }
                    >
                      {auction.isActive ? 'Aktiv' : 'Inaktiv'}
                    </td>
                    <td>
                      <Button
                        label={auction.isActive ? 'Inaktivera' : 'Aktivera'}
                        variant={auction.isActive ? 'secondary' : 'primary'}
                        type="button"
                        onClick={() => toggleAuction(auction.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
