'use client';

import { LogoWithText } from './Logo';
import { Button, Avatar, Dropdown, DropdownItem, DropdownDivider, Container } from './ui';
import { Menu } from '@mantine/core';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <Container className="py-4 px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href={HOME_ROUTE}>
              <LogoWithText />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {user ? renderTabs() : null}
              {renderAuthState()}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-neutral-700" />
              ) : (
                <MenuIcon className="w-6 h-6 text-neutral-700" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-neutral-200">
              <div className="flex flex-col gap-3 pt-4">
                {user ? (
                  <>
                    <Link href={LEARN_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Learn
                      </Button>
                    </Link>
                    <Link href={GUIDE_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Guide
                      </Button>
                    </Link>
                    <Link href={ENTITIES_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Tax
                      </Button>
                    </Link>
                    <div className="border-t border-neutral-200 pt-3 mt-3">
                      <div className="px-2 py-2 text-sm text-neutral-700 mb-3">{user.email}</div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign Out
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href={LEARN_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Learn
                      </Button>
                    </Link>
                    <Link href={GUIDE_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Guide
                      </Button>
                    </Link>
                    <Link href={LOGIN_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link href={SIGNUP_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" className="w-full">
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </Container>
      </nav>
    </header>
  );
};
