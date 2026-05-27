import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function EditAuction() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [endDate, setEndDate] = useState('');
  const [hasBids, setHasBids] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`https://localhost:7211/api/auctions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setStartingPrice(data.startingPrice.toString());
        setEndDate(data.endDate.slice(0, 16));
        setHasBids(data.highestBid !== null);
      });
  }, [id]);

  const handleSubmit = async () => {
    setError('');
    const response = await fetch(`https://localhost:7211/api/auctions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        startingPrice: parseFloat(startingPrice),
        endDate,
      }),
    });

    if (response.ok) {
      navigate(`/auktion/${id}`);
    } else {
      setError('Något gick fel, försök igen');
    }
  };

  return (
    <div className="create-auction-container">
      <h1>Redigera annons</h1>
      <div className="create-auction-form">
        <Input
          label="Rubrik"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Beskrivning</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="Startpris (kr)"
          type="text"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
          disabled={hasBids}
        />
        {hasBids && (
          <p className="detail-owner-note">
            Startpriset kan inte ändras eftersom det finns bud.
          </p>
        )}
        <Input
          label="Avslutas"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <div className="create-auction-actions">
          <Button
            label="Avbryt"
            variant="secondary"
            type="button"
            onClick={() => navigate(`/auktion/${id}`)}
          />
          <Button
            label="Spara"
            variant="primary"
            type="button"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
