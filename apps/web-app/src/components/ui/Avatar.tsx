import React from 'react';
import { Avatar as MantineAvatar } from '@mantine/core';

interface AvatarProps {
  email?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar = ({ email, name, size = 'md', className = '' }: AvatarProps) => {
  const getInitials = () => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return '?';
  };

  const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 50%)`;
  };

  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const backgroundColor = getColorFromString(email || name || 'user');

  return (
    <MantineAvatar size={sizeMap[size]} radius="xl" color={backgroundColor} className={className}>
      {getInitials()}
    </MantineAvatar>
  );
};
