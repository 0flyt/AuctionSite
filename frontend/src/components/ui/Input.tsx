import './Input.css';

interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'datetime-local';
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
  return (
    <div className="input-field">
      <label className="input-label">{label}</label>
      <input
        className="input"
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
