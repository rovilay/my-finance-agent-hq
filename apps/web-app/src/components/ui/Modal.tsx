import { Modal as MantineModal } from '@mantine/core';
import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, description, children, size = 'lg' }: ModalProps) {
  const sizeMap = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
  } as const;

  return (
    <MantineModal
      opened={isOpen}
      onClose={onClose}
      title={
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-neutral-600">{description}</p>}
        </div>
      }
      size={sizeMap[size]}
      centered
      overlayProps={{
        backgroundOpacity: 0.5,
        blur: 3,
      }}
      padding="xl"
    >
      {children}
    </MantineModal>
  );
}
