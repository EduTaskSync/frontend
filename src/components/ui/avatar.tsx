import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { useNavigate } from 'react-router';

import { cn } from '@/lib/utils';

interface NavigableAvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  navigateTo?: string;
}

function Avatar({ className, navigateTo, ...props }: NavigableAvatarProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'relative flex size-8 shrink-0 overflow-hidden rounded-full',
        navigateTo && 'cursor-pointer',
        className
      )}
      onClick={navigateTo ? handleClick : undefined}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image data-slot="avatar-image" className={cn('aspect-square size-full', className)} {...props} />
  );
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
