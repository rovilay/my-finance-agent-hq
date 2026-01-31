'use client';

import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { MantineProvider } from '@mantine/core';
import { apolloClient } from '@/lib/apollo-client';
import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>{children}</AuthProvider>
      </ApolloProvider>
    </MantineProvider>
  );
}
