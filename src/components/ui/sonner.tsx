import { useTheme } from '@/components/ThemeProvider';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group p-4 font-sans flex items-start gap-3', // Added flex, items-start and gap-3
          title: 'text-base font-heading flex items-center', // Added flex and items-center
          description: 'text-sm italic font-sans opacity-90 mt-1',
          actionButton:
            'bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-primary/90 h-9 font-heading',
          cancelButton:
            'bg-muted text-muted-foreground px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-muted/90 h-9 font-heading',
          // Add specific styling for the info toast
          info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
        },
        duration: 4000,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--success-bg': 'hsl(var(--success))',
          '--success-text': 'hsl(var(--success-foreground))',
          '--success-border': 'var(--border)',
          '--error-bg': 'hsl(var(--destructive))',
          '--error-text': 'hsl(var(--destructive-foreground))',
          '--error-border': 'var(--border)',
          '--toast-padding': '16px',
          '--viewport-padding': '16px',
          '--toast-width': '390px', // Make toasts wider
          '--toast-border-radius': '0.75rem', // Match your UI's border radius
          '--gap': '12px', // Space between toasts
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
