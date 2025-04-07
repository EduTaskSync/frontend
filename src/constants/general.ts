export enum LocalStorageKey {
  ACCESS_TOKEN = 'access_token',
}

export const defaultGroupIcons = [
  { src: '/group-icon-1.jpg', alt: 'Group Icon 1', value: '/group-icon-1.jpg' },
  { src: '/group-icon-2.jpg', alt: 'Group Icon 2', value: '/group-icon-2.jpg' },
  { src: '/group-icon-3.webp', alt: 'Group Icon 3', value: '/group-icon-3.webp' },
  { src: '/group-icon-4.avif', alt: 'Group Icon 4', value: '/group-icon-4.avif' },
];

export enum GroupRole {
  MEMBER = 'Member',
  ADMIN = 'Admin',
}
