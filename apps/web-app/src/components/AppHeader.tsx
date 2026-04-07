'use client';

import { LogoWithText } from './Logo';
import { Button, Avatar, Dropdown, DropdownItem, DropdownDivider } from './ui';
import { Menu } from '@mantine/core';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
  ENTITIES_ROUTE,
  GUIDE_ROUTE,
  HOME_ROUTE,
  LEARN_ROUTE,
  LOGIN_ROUTE,
  SIGNUP_ROUTE,
} from '@/lib/constants';

export const AppHeader = () => {
  const { user, signOut, loading } = useAuth();

  const renderAuthState = () => {
    // Show skeleton during loading to prevent hydration mismatch
    if (loading) {
      return <div className="w-10 h-10 bg-neutral-100 animate-pulse rounded-full" />;
    }
    if (user) {
      return (
        <Dropdown
          trigger={
            <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Avatar email={user.email || undefined} size="md" />
            </div>
          }
        >
          <Menu.Label>{user.email}</Menu.Label>
          <DropdownDivider />
          <DropdownItem onClick={signOut}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </div>
          </DropdownItem>
        </Dropdown>
      );
    }

    return (
      <>
        <Link href={LEARN_ROUTE}>
          <Button variant="ghost">Learn</Button>
        </Link>
        <Link href={GUIDE_ROUTE}>
          <Button variant="ghost">Guide</Button>
        </Link>
        <Link href={LOGIN_ROUTE}>
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href={SIGNUP_ROUTE}>
          <Button variant="primary">Sign up</Button>
        </Link>
      </>
    );
  };

  const renderTabs = () => {
    if (!user) return null;

    return (
      <>
        <Link href={LEARN_ROUTE}>
          <Button variant="ghost">Learn</Button>
        </Link>
        <Link href={GUIDE_ROUTE}>
          <Button variant="ghost">Guide</Button>
        </Link>
        <Link href={ENTITIES_ROUTE}>
          <Button variant="ghost">Tax</Button>
        </Link>
      </>
    );
  };

  return (
    <header>
      <nav className="border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between h-16">
            <Link href={HOME_ROUTE}>
              <LogoWithText />
            </Link>
            <div className="flex items-center gap-4">
              {user ? renderTabs() : null}
              {renderAuthState()}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
