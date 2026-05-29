import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { auctionService } from '../../services/auctionService';
import './CreateAuction.css';

export function CreateAuction() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState<File | null>(null);

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
    if (isNaN(parseFloat(startingPrice)) || parseFloat(startingPrice) <= 0) {
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

    const { ok, data } = await auctionService.createAuction(
      { title, description, startingPrice: parseFloat(startingPrice), endDate },
      token!,
    );

    if (ok) {
      if (image) await auctionService.uploadImage(data.id, image, token!);
      navigate('/');
    } else {
      setError('Något gick fel, försök igen.');
    }
  };

  return (
    <div className="create-auction-container">
      <h1>Ny annons</h1>
      <div className="create-auction-form">
        <div className="input-field">
          <label className="input-label">Bild</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
        </div>
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
