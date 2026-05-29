import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import './CreateAuction.css';

export function CreateAuction() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (!title.trim()) {
      setError('Rubrik måste fyllas i.');
      return;
    }

    if (!description.trim()) {
      setError('Beskrivning måste fyllas i.');
      return;
    }

    const price = parseFloat(startingPrice);
    if (isNaN(price) || price <= 0) {
      setError('Ange ett giltigt utropspris.');
      return;
    }

    if (!endDate) {
      setError('Slutdatum måste fyllas i.');
      return;
    }

    if (new Date(endDate) <= new Date()) {
      setError('Slutdatum måste vara i framtiden.');
      return;
    }

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
        <div className="input-field">
          <label className="input-label">Beskrivning</label>
          <textarea
            className="create-auction-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Input
          label="Utropspris"
          type="number"
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
