import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const LoadingButton = ({
  isLoading,
  loadingText,
  defaultText,
}: {
  isLoading: boolean;
  loadingText: string;
  defaultText: string;
}) => (
  <Button type="submit" className="font-semibold hover:cursor-pointer" disabled={isLoading}>
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
