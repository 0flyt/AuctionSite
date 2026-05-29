const BASE_URL = 'https://localhost:7211';

export const auctionService = {
  getAuctions: async (title?: string, closed = false) => {
    const url = `${BASE_URL}/api/auctions?closed=${closed}${title ? `&title=${title}` : ''}`;
    const res = await fetch(url);
    return res.json();
  },

  getAuction: async (id: string) => {
    const res = await fetch(`${BASE_URL}/api/auctions/${id}`);
    return res.json();
  },

  createAuction: async (data: object, token: string) => {
    const res = await fetch(`${BASE_URL}/api/auctions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return { ok: res.ok, data: await res.json() };
  },

  updateAuction: async (id: string, data: object, token: string) => {
    const res = await fetch(`${BASE_URL}/api/auctions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return { ok: res.ok };
  },

  uploadImage: async (id: number, file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${BASE_URL}/api/auctions/${id}/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return { ok: res.ok };
  },
};
