import './Input.css';

interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ label, type = 'text', value, onChange }: InputProps) {
  return (
    <>
      <label className="input-label">{label}</label>
      <input className="input" type={type} value={value} onChange={onChange} />
    </>
  );
}
