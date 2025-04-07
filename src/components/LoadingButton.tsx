import { Loader2 } from 'lucide-react';
import { ButtonWithTooltip } from './ButtonWithToolTip';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText: string;
  defaultText: string;
  tooltipText?: string;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
  tooltipAlign?: 'start' | 'center' | 'end';
  disabled?: boolean;
  className?: string;
}

export const LoadingButton = ({
  isLoading,
  loadingText,
  defaultText,
  disabled = false,
  tooltipText,
  tooltipSide = 'top',
  tooltipAlign = 'center',
  className = 'font-semibold hover:cursor-pointer',
  ...props
}: LoadingButtonProps) => (
  <ButtonWithTooltip
    disabled={isLoading || disabled}
    className={className}
    {...props}
    tooltipText={tooltipText || ''}
    tooltipSide={tooltipSide}
    tooltipAlign={tooltipAlign}
  >
    {isLoading ? (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{loadingText}</span>
      </div>
    ) : (
      defaultText
    )}
  </ButtonWithTooltip>
);
