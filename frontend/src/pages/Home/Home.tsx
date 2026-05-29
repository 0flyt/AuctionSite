import { useEffect, useState } from 'react';
import { AuctionCard } from '../../components/AuctionCard/AuctionCard';
import { auctionService } from '../../services/auctionService';
import './Home.css';

interface Auction {
  id: number;
  title: string;
  description: string;
  startingPrice: number;
  endDate: string;
  username: string;
  highestBid?: number | null;
  imageUrl: string | null;
}

export function Home() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [search, setSearch] = useState('');
  const [closed, setClosed] = useState(false);

  const fetchAuctions = async (searchTerm?: string) => {
    const data = await auctionService.getAuctions(searchTerm, closed);
    setAuctions(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAuctions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closed]);

  const handleSearch = () => {
    fetchAuctions(search);
  };

  return (
    <div className="home-container">
      <div className="home-tabs">
        <button
          className={`home-tab ${!closed ? 'active' : ''}`}
          onClick={() => setClosed(false)}
        >
          Öppna auktioner
        </button>
        <button
          className={`home-tab ${closed ? 'active' : ''}`}
          onClick={() => setClosed(true)}
        >
          Avslutade auktioner
        </button>
      </div>
      <div className="home-search">
        <input
          className="home-search-input"
          type="text"
          placeholder="Sök efter auktioner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="home-search-btn" onClick={handleSearch}>
          Sök
        </button>
      </div>
      <div className="auction-grid">
        {auctions.length === 0 ? (
          <p className="home-empty">Inga auktioner hittades.</p>
        ) : (
          auctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              id={auction.id}
              title={auction.title}
              startingPrice={auction.startingPrice}
              endDate={auction.endDate}
              username={auction.username}
              highestBid={auction.highestBid}
              imageUrl={auction.imageUrl}
            />
          ))
        )}
      </div>
    </div>
  );
}
