'use client';

import { useParams, useRouter } from 'next/navigation';
import EntityEntriesPage from '@/components/entities/EntityEntriesPage';

export default function FinancialEntries() {
  const params = useParams();
  const router = useRouter();
  const entityId = params?.entityId as string;

  return (
    <EntityEntriesPage
      entityId={entityId}
      onBack={() => router.push(`/entities/${entityId}`)}
    />
  );
}

