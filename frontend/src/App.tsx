import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('https://localhost:7211/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div>
      <h1>Användare</h1>
      {users.map((user) => (
        <p key={user.id}>
          {user.name} – {user.email}
        </p>
      ))}
    </div>
  );
}

export default App;
