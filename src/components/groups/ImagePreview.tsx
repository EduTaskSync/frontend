import { useMemo } from 'react';

interface ImagePreviewProps {
  imageSource: string;
  customImageUrl: string;
  defaultIcon: string;
}

export const ImagePreview = ({ imageSource, customImageUrl, defaultIcon }: ImagePreviewProps) => {
  // Memoize the component to prevent unnecessary re-renders
  return useMemo(() => {
    return (
      <div className="mt-4">
        <p className="text-sm font-medium mb-2 text-muted-foreground">Live Preview</p>
        <div className="border rounded-lg overflow-hidden bg-background/50 flex items-center justify-center h-[150px] w-full">
          {imageSource === 'custom' && customImageUrl && customImageUrl.startsWith('https') ? (
            <div className="relative w-full h-full">
              <img
                src={customImageUrl}
                alt="Group icon preview"
                className="object-cover h-full w-full"
                // direct DOM manipulation to handle error as this is a one off scenario
                onError={(e) => {
                  if (e.currentTarget) {
                    e.currentTarget.src = defaultIcon;
                    e.currentTarget.classList.add('opacity-50');
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-2 opacity-50"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span className="text-sm">
                {imageSource === 'custom' && customImageUrl ? 'Invalid image URL' : 'Preview will appear here'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }, [imageSource, customImageUrl, defaultIcon]); // only re-compute when these values change
};
