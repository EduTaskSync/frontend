import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ReactNode } from 'react';

interface ButtonWithTooltipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltipText: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  tooltipAlign?: 'start' | 'center' | 'end';
  tooltipClassName?: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: ReactNode;
}

export const ButtonWithTooltip = ({
  tooltipText,
  tooltipSide = 'top',
  tooltipAlign = 'center',
  tooltipClassName = 'bg-background border border-border shadow-md font-sans text-sm',
  disabled = false,
  children,
  ...buttonProps
}: ButtonWithTooltipProps) => {
  if (disabled) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="inline-flex" style={{ cursor: 'not-allowed' }}>
              <Button {...buttonProps} disabled={disabled}>
                {children}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide} align={tooltipAlign} className={tooltipClassName}>
            {tooltipText}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button {...buttonProps}>{children}</Button>
        </TooltipTrigger>
        <TooltipContent side={tooltipSide} align={tooltipAlign} className={tooltipClassName}>
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
