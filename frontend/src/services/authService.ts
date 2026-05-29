const BASE_URL = 'https://localhost:7211';

export const authService = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const msg = await res.text();
      return { ok: false, data: null, error: msg };
    }

    const data = await res.json();
    return { ok: true, data, error: null };
  },

  register: async (username: string, email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      const msg = await res.text();
      return { ok: false, data: null, error: msg };
    }

    const data = await res.json();
    return { ok: true, data, error: null };
  },
};
