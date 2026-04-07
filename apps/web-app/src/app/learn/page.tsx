import type { Metadata } from 'next';
import LearnPage from '@/components/LearnPage';

export const metadata: Metadata = {
  title: 'Learn — Canadian Taxes Explained',
  description:
    'A visual guide for newcomers to Canada: how tax brackets work, key deadlines, and credits you may be missing.',
};

export default function Learn() {
  return <LearnPage />;
}
