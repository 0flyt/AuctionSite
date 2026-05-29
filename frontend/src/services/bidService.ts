const BASE_URL = 'https://localhost:7211';

export const bidService = {
  getBids: async (auctionId: string) => {
    const res = await fetch(`${BASE_URL}/api/auctions/${auctionId}/bids`);
    return res.json();
  },

  createBid: async (auctionId: string, amount: number, token: string) => {
    const res = await fetch(`${BASE_URL}/api/auctions/${auctionId}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });
    return { ok: res.ok, data: res.ok ? await res.json() : await res.text() };
  },

  deleteBid: async (auctionId: string, bidId: number, token: string) => {
    const res = await fetch(
      `${BASE_URL}/api/auctions/${auctionId}/bids/${bidId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return { ok: res.ok };
  },
};
