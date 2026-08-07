import { cnsMerge } from '@/lib/utils';
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={cnsMerge('w-full max-w-6xl mx-auto p-4 md:px-6', className)}>{children}</div>
  );
}
