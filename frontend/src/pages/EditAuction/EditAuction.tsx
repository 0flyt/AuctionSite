import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { auctionService } from '../../services/auctionService';
import '../CreateAuction/CreateAuction.css';

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
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (!id) return;
    auctionService.getAuction(id).then((data) => {
      setTitle(data.title);
      setDescription(data.description);
      setStartingPrice(data.startingPrice.toString());
      setEndDate(data.endDate.slice(0, 16));
      setHasBids(data.highestBid !== null);
    });
  }, [id]);

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
    if (!endDate) {
      setError('Slutdatum måste fyllas i.');
      return;
    }
    if (new Date(endDate) <= new Date()) {
      setError('Slutdatum måste vara i framtiden.');
      return;
    }

    const { ok } = await auctionService.updateAuction(
      id!,
      { title, description, startingPrice: parseFloat(startingPrice), endDate },
      token!,
    );

    if (ok) {
      if (image) await auctionService.uploadImage(parseInt(id!), image, token!);
      navigate(`/auktion/${id}`);
    } else {
      setError('Något gick fel, försök igen.');
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
        <div className="input-field">
          <label className="input-label">Beskrivning</label>
          <textarea
            className="create-auction-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Input
          label="Startpris (kr)"
          type="number"
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
        <div className="input-field">
          <label className="input-label">Byt bild (valfritt)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
        </div>
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
