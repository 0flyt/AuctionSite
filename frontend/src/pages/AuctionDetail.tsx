import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import './AuctionDetail.css';

interface Auction {
  id: number;
  title: string;
  description: string;
  startingPrice: number;
  endDate: string;
  username: string;
  userId: number;
  highestBid: number | null;
}

interface Bid {
  id: number;
  amount: number;
  placedAt: string;
  username: string;
}

export function AuctionDetail() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://localhost:7211/api/auctions/${id}`)
      .then((res) => res.json())
      .then((data) => setAuction(data));

    fetch(`https://localhost:7211/api/auctions/${id}/bids`)
      .then((res) => res.json())
      .then((data) => setBids(data));
  }, [id]);

  const handleBid = async () => {
    setError('');
    const response = await fetch(
      `https://localhost:7211/api/auctions/${id}/bids`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parseFloat(bidAmount) }),
      },
    );

    if (response.ok) {
      const newBid = await response.json();
      setBids([newBid, ...bids]);
      setAuction((prev) =>
        prev ? { ...prev, highestBid: newBid.amount } : prev,
      );
      setBidAmount('');
    } else {
      const msg = await response.text();
      setError(msg);
    }
  };

  if (!auction) return <p>Laddar...</p>;

  const isOwner = user?.id === auction.userId;
  const currentPrice = auction.highestBid ?? auction.startingPrice;
  const isOpen = new Date(auction.endDate) > new Date();

  const formattedEndDate = new Date(auction.endDate).toLocaleDateString(
    'sv-SE',
    {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    },
  );

  return (
    <div className="detail-container">
      <div className="detail-left">
        <div className="detail-image">Ingen bild</div>
        <div className="detail-description">
          <h3>Beskrivning</h3>
          <p>{auction.description}</p>
        </div>

        {isOpen && (
          <div className="detail-bids">
            <h3>Budhistorik</h3>
            {bids.length === 0 ? (
              <p className="detail-empty">Inga bud ännu.</p>
            ) : (
              bids.map((bid) => (
                <div key={bid.id} className="detail-bid-row">
                  <span>{bid.username}</span>
                  <span>{bid.amount} kr</span>
                  <span>
                    {new Date(bid.placedAt).toLocaleDateString('sv-SE')}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="detail-right">
        <p className="detail-seller">{auction.username}</p>
        <h1 className="detail-title">{auction.title}</h1>
        <p className="detail-ends">
          {isOpen ? 'Slutar' : 'Avslutad'} {formattedEndDate}
        </p>

        <div className="detail-price-section">
          <p className="detail-price-label">
            Utropspris · {bids.length} {bids.length === 1 ? 'bud' : 'bud'}
          </p>
          <p className="detail-price">{currentPrice} kr</p>
        </div>

        {!isOpen && (
          <p className="detail-closed-msg">
            {bids.length === 0
              ? 'Auktionen avslutades utan bud'
              : `Vinnare: ${bids[0].username} med ${bids[0].amount} kr`}
          </p>
        )}

        {isOpen && !isOwner && token && (
          <div className="detail-bid-form">
            <input
              className="detail-bid-input"
              type="number"
              placeholder={`Minst ${currentPrice + 1} kr`}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}
            <Button
              label="Lägg bud"
              variant="primary"
              type="button"
              onClick={handleBid}
            />
          </div>
        )}

        {isOpen && isOwner && (
          <p className="detail-owner-note">Detta är din auktion.</p>
        )}
        {isOpen && isOwner && (
          <Button
            label="Redigera annons"
            variant="secondary"
            type="button"
            onClick={() => navigate(`/auktion/${id}/redigera`)}
          />
        )}

        {isOpen && !token && (
          <p className="detail-login-note">Logga in för att lägga bud.</p>
        )}
      </div>
    </div>
  );
}
