const BASE_URL = 'https://localhost:7211';

export const userService = {
  searchUsers: async (username: string, token: string) => {
    const res = await fetch(`${BASE_URL}/api/users?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },

  updatePassword: async (
    id: number,
    currentPassword: string,
    newPassword: string,
    token: string,
  ) => {
    const res = await fetch(`${BASE_URL}/api/users/${id}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return { ok: res.ok, data: await res.text() };
  },

  toggleUser: async (id: number, token: string) => {
    const res = await fetch(`${BASE_URL}/api/users/${id}/deactivate`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ok: res.ok };
  },

  toggleAuction: async (id: number, token: string) => {
    const res = await fetch(`${BASE_URL}/api/auctions/${id}/deactivate`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ok: res.ok };
  },
};
