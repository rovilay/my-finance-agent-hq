'use client';

import React from 'react';
import { Menu } from '@mantine/core';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export const Dropdown = ({ trigger, children }: DropdownProps) => {
  return (
    <Menu position="bottom" offset={8} withArrow={false} shadow="md" width={256}>
      <Menu.Target>
        <div className="cursor-pointer">{trigger}</div>
      </Menu.Target>
      <Menu.Dropdown>{children}</Menu.Dropdown>
    </Menu>
  );
};

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const DropdownItem = ({ children, onClick, className = '' }: DropdownItemProps) => {
  return (
    <Menu.Item onClick={onClick} className={className}>
      {children}
    </Menu.Item>
  );
};

export const DropdownDivider = () => {
  return <Menu.Divider />;
};

export const DropdownLabel = ({ children }: { children: React.ReactNode }) => {
  return <Menu.Label>{children}</Menu.Label>;
};
