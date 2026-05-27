import { useEffect, useState } from 'react';
import { AuctionCard } from '../components/AuctionCard';
import './Home.css';

interface Auction {
  id: number;
  title: string;
  description: string;
  startingPrice: number;
  endDate: string;
  username: string;
  highestBid?: number | null;
}

export function Home() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [search, setSearch] = useState('');
  const [closed, setClosed] = useState(false);

  const handleSearch = () => {
    const url = `https://localhost:7211/api/auctions?closed=${closed}${search ? `&title=${search}` : ''}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setAuctions(data));
  };

  useEffect(() => {
    const url = `https://localhost:7211/api/auctions?closed=${closed}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setAuctions(data));
  }, [closed]);

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
            />
          ))
        )}
      </div>
    </div>
  );
}
