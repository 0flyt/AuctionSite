import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthUser {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function parseToken(token: string): AuthUser | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)),
      ),
    );

    const claims = {
      id: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
      name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
      email:
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
      role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    };

    return {
      id: parseInt(payload[claims.id]),
      username: payload[claims.name],
      email: payload[claims.email],
      isAdmin: payload[claims.role] === 'Admin',
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('token');
    return stored ? parseToken(stored) : null;
  });

  const login = (token: string, user: AuthUser) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.isAdmin ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth måste användas inom AuthProvider');
  return context;
}
