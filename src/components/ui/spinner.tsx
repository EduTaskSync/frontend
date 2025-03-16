interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const Spinner = ({ size = 'medium', color = 'primary', className = '' }: SpinnerProps) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-10 w-10',
    large: 'h-20 w-20',
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white',
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-8 border-solid border-current border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Loading"
    ></div>
  );
};

export { Spinner };
