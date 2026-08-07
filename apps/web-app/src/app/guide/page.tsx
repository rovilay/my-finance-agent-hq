'use client';

import DocumentGuidePage from '@/components/DocumentGuidePage';
import { useAuth } from '@/contexts';

export default function Guide() {
  const { isAuthenticated } = useAuth();
  return <DocumentGuidePage isAuthenticated={isAuthenticated} />;
}
