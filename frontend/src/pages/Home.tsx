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

  useEffect(() => {
    fetch(
      `https://localhost:7211/api/auctions${search ? `?title=${search}` : ''}`,
    )
      .then((res) => res.json())
      .then((data) => setAuctions(data));
  }, [search]);

  return (
    <div className="home-container">
      <div className="home-search">
        <input
          className="home-search-input"
          type="text"
          placeholder="Sök efter auktioner..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
              highestBid={auction.highestBid}
            />
          ))
        )}
      </div>
    </div>
  );
}
