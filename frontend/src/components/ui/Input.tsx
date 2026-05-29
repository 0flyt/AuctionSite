import './Input.css';

interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'datetime-local' | 'number';
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export function Input({
  label,
  type = 'text',
  value,
  onChange,
  disabled,
}: InputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === 'number') {
      if (
        !/[\d]/.test(e.key) &&
        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
          e.key,
        )
      ) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="input-field">
      <label className="input-label">{label}</label>
      <input
        className="input"
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
