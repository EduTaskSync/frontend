import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText: string;
  defaultText: string;
  disabled?: boolean;
  className?: string;
}

export const LoadingButton = ({
  isLoading,
  loadingText,
  defaultText,
  disabled = false,
  className = 'font-semibold hover:cursor-pointer',
  ...props
}: LoadingButtonProps) => (
  <Button disabled={isLoading || disabled} className={className} {...props}>
    {isLoading ? (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{loadingText}</span>
      </div>
    ) : (
      defaultText
    )}
  </Button>
);
