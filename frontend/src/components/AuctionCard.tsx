import { useNavigate } from 'react-router-dom';
import './AuctionCard.css';

interface AuctionCardProps {
  id: number;
  title: string;
  startingPrice: number;
  endDate: string;
  highestBid?: number | null;
  username: string;
  imageUrl: string | null;
}

export function AuctionCard({
  id,
  title,
  startingPrice,
  endDate,
  highestBid,
  username,
  imageUrl,
}: AuctionCardProps) {
  const navigate = useNavigate();

  const formattedDate = new Date(endDate).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="auction-card" onClick={() => navigate(`/auktion/${id}`)}>
      <div className="auction-card-image">
        {imageUrl ? (
          <img src={`https://localhost:7211${imageUrl}`} alt={title} />
        ) : (
          <span>Ingen bild</span>
        )}
      </div>
      <div className="auction-card-body">
        <h3 className="auction-card-title">{title}</h3>
        <p className="auction-card-seller">{username}</p>
        <p className="auction-card-date">{formattedDate}</p>
        <div className="auction-card-price-row">
          <span className="auction-card-price">
            {highestBid ?? startingPrice} kr
          </span>
          <span className="auction-card-price-label">
            {highestBid ? 'Ledande bud' : 'Utropspris'}
          </span>
        </div>
      </div>
    </div>
  );
}
