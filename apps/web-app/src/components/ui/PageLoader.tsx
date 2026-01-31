import React from 'react';
import { Loader } from './Loader';
import { LogoWithText } from '../Logo';

interface PageLoaderProps {
  message?: string;
  withLogo?: boolean;
}

export const PageLoader = ({ message = 'Loading...', withLogo = true }: PageLoaderProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
      <div className="flex flex-col items-center gap-6">
        {withLogo && (
          <div className="animate-pulse">
            <LogoWithText />
          </div>
        )}
        <div className="flex flex-col items-center gap-3">
          <Loader size="lg" />
          {message && <p className="text-neutral-600 text-sm font-medium">{message}</p>}
        </div>
      </div>
    </div>
  );
};
