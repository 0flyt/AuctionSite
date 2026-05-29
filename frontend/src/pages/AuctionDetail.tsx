import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import './AuctionDetail.css';
import { ImageModal } from '../components/ImageModal';

interface Auction {
  id: number;
  title: string;
  description: string;
  startingPrice: number;
  endDate: string;
  username: string;
  userId: number;
  highestBid: number | null;
  imageUrl?: string | null;
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
  const [showModal, setShowModal] = useState(false);

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

    const amount = parseFloat(bidAmount);

    if (isNaN(amount) || amount <= 0) {
      setError('Ange ett giltigt belopp.');
      return;
    }

    if (amount <= currentPrice) {
      setError(`Budet måste vara högre än ${currentPrice} kr.`);
      return;
    }

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
      try {
        const data = await response.json();
        if (data.errors) {
          setError('Ange ett giltigt belopp.');
        } else {
          setError(data.title || 'Något gick fel.');
        }
      } catch {
        const msg = await response.text();
        setError(msg);
      }
    }
  };

  if (!auction) return <p>Laddar...</p>;

  const isOwner = user?.id === auction.userId;
  const currentPrice = auction.highestBid ?? auction.startingPrice;
  const isOpen = new Date(auction.endDate) > new Date();

  const myLatestBid =
    bids.length > 0 && bids[0].username === user?.username ? bids[0] : null;

  const handleDeleteBid = async () => {
    if (!myLatestBid) return;
    const response = await fetch(
      `https://localhost:7211/api/auctions/${id}/bids/${myLatestBid.id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (response.ok) {
      const updatedBids = bids.slice(1);
      setBids(updatedBids);
      setAuction((prev) =>
        prev ? { ...prev, highestBid: updatedBids[0]?.amount ?? null } : prev,
      );
    }
  };

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
        <div className="detail-image">
          {auction.imageUrl ? (
            <img
              src={`https://localhost:7211${auction.imageUrl}`}
              alt={auction.title}
              onClick={() => setShowModal(true)}
              style={{ cursor: 'zoom-in' }}
            />
          ) : (
            <span>Ingen bild</span>
          )}
        </div>

        {showModal && auction.imageUrl && (
          <ImageModal
            imageUrl={`https://localhost:7211${auction.imageUrl}`}
            alt={auction.title}
            onClose={() => setShowModal(false)}
          />
        )}

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
              onChange={(e) => {
                const val = e.target.value;
                if (val == '' || /^\d+$/.test(val)) setBidAmount(val);
              }}
              min={currentPrice + 1}
              step="1"
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

        {isOpen && myLatestBid && (
          <Button
            label="Ångra mitt bud"
            variant="secondary"
            type="button"
            onClick={handleDeleteBid}
          />
        )}

        {isOpen && !token && (
          <p className="detail-login-note">Logga in för att lägga bud.</p>
        )}
      </div>
    </div>
  );
}
