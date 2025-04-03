import { Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Avatar {
  id: string;
  src: string;
  alt: string;
}

interface AvatarSelectorProps {
  initialImage?: string | null;
  selected?: string | null;
  onChange: (url: string) => void;
  seed: string;
}

const getAvatars = (seed: string): Avatar[] => [
  { id: 'avatar1', src: `https://api.dicebear.com/9.x/identicon/svg?seed=${seed}`, alt: 'Avatar 1' },
  { id: 'avatar2', src: `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`, alt: 'Avatar 2' },
  { id: 'avatar3', src: `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${seed}`, alt: 'Avatar 3' },
  { id: 'avatar4', src: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`, alt: 'Avatar 4' },
  { id: 'avatar5', src: `https://api.dicebear.com/9.x/personas/svg?seed=${seed}`, alt: 'Avatar 5' },
  { id: 'avatar6', src: `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}`, alt: 'Avatar 6' },
  { id: 'avatar7', src: `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`, alt: 'Avatar 8' },
];

export default function AvatarSelector({ initialImage, selected, onChange, seed }: AvatarSelectorProps) {
  const avatars = getAvatars(seed);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(initialImage || null);

  // Update selected state when external selection changes
  useEffect(() => {
    if (selected !== undefined && selected !== selectedAvatar) {
      setSelectedAvatar(selected);
    }
  }, [selected]);

  const handleSelect = (avatarSrc: string) => {
    setSelectedAvatar(avatarSrc);
    onChange(avatarSrc);
  };
  const initialAvatar = initialImage ? initialImage : `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;

  return (
    <div className="space-y-4">
      {/* Avatar grid */}
      <div className="grid grid-cols-4 gap-3">
        <div
          key={'initial'}
          className={`relative cursor-pointer rounded-full overflow-hidden border-2 transition-all flex items-center justify-center aspect-square ${
            selectedAvatar === initialAvatar
              ? 'border-primary ring-2 ring-primary ring-offset-2'
              : 'border-muted hover:border-muted-foreground'
          }`}
          onClick={() => handleSelect(initialAvatar)}
        >
          <div className="w-full h-full flex items-center justify-center">
            <img src={initialAvatar} alt="profile" className="h-full w-full object-cover" />
          </div>
          {selectedAvatar === initialAvatar && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <Check className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
        {/* Dicebear avatars */}
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            className={`relative cursor-pointer rounded-full overflow-hidden border-2 transition-all flex items-center justify-center aspect-square ${
              selectedAvatar === avatar.src
                ? 'border-primary ring-2 ring-primary ring-offset-2'
                : 'border-muted hover:border-muted-foreground'
            }`}
            onClick={() => handleSelect(avatar.src)}
          >
            <div className="w-full h-full flex items-center justify-center">
              <img src={avatar.src} alt={avatar.alt} className="h-full w-full object-cover" />
            </div>
            {selectedAvatar === avatar.src && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <Check className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
