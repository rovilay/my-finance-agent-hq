import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/components/Providers';
import type { ReactNode } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { FeedbackWidget } from '@/components/FeedbackWidget';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Finance Agent HQ',
    default: 'Finance Agent HQ - Secure Tax Document Management',
  },
  description: 'AI-powered secure tax document processing with envelope encryption',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          <main>
            <AppHeader />
            {children}
            <FeedbackWidget />
          </main>
        </Providers>
      </body>
    </html>
  );
}
