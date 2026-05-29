import './Button.css';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export function Button({
  label,
  variant = 'primary',
  onClick,
  type = 'button',
}: ButtonProps) {
  return (
    <>
      <button className={`btn btn-${variant}`} onClick={onClick} type={type}>
        {label}
      </button>
    </>
  );
}
