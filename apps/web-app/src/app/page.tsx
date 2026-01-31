import type { Metadata } from 'next';
import HomePage from '@/components/Homepage';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'AI-powered secure tax document processing with envelope encryption and intelligent analysis',
};

export default function Home() {
  return <HomePage />;
}
