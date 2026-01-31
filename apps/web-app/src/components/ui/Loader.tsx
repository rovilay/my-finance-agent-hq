import React from 'react';
import { Loader as MantineLoader } from '@mantine/core';

interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

export const Loader = ({ size = 'md', color = 'blue', className = '' }: LoaderProps) => {
  return <MantineLoader size={size} color={color} className={className} />;
};
