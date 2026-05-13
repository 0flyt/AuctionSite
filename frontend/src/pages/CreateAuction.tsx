import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function CreateAuction() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const response = await fetch('https://localhost:7211/api/auctions', {
      method: 'POST',
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
      navigate('/');
    } else {
      setError('Något gick fel, försök igen');
    }
  };

  return (
    <div className="create-auction-container">
      <h1>Ny annons</h1>
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
          label="Utropspris"
          type="text"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
        />
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
            onClick={() => navigate('/')}
          />
          <Button
            label="Publicera"
            variant="primary"
            type="button"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
