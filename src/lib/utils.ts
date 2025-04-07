import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format the date string to a readable format
export const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) return 'Invalid date';

    // Format options
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const getImageUrl = (url: string | null | undefined) => {
  // fallback to group image 1 if server sends no image url
  if (!url) {
    return '/group-icon-1.jpg';
  }

  // if it's a relative path starting with / or a full URL, use it directly
  if (url.startsWith('/') || url.startsWith('http')) {
    return url;
  }

  // assume filename inside public folder
  return `/${url}`;
};
