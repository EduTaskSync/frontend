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

export enum DefaultColumns {
  Todo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

export enum Accent {
  Blue = 'blue',
  Amber = 'amber',
  Emerald = 'emerald',
  Violet = 'violet',
}

export const getColumnStyle = (colType: string) => {
  switch (colType) {
    case 'To Do':
      return {
        headerClass: 'bg-blue-500/10 border-b-blue-500/20 text-blue-500',
        borderClass: 'border-t-blue-500/30',
        gradientClass: 'from-blue-500/5 to-transparent',
        accent: Accent.Blue,
      };
    case 'In Progress':
      return {
        headerClass: 'bg-amber-500/10 border-b-amber-500/20 text-amber-500',
        borderClass: 'border-t-amber-500/30',
        gradientClass: 'from-amber-500/5 to-transparent',
        accent: Accent.Amber,
      };
    case 'Done':
      return {
        headerClass: 'bg-emerald-500/10 border-b-emerald-500/20 text-emerald-500',
        borderClass: 'border-t-emerald-500/30',
        gradientClass: 'from-emerald-500/5 to-transparent',
        accent: Accent.Emerald,
      };
    default:
      // Brighter purple for better readability
      return {
        headerClass: 'bg-violet-500/15 border-b-violet-500/25 text-violet-500',
        borderClass: 'border-t-violet-500/30',
        gradientClass: 'from-violet-500/5 to-transparent',
        accent: Accent.Violet,
      };
  }
};
