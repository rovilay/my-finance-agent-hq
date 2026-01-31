'use client';

import { useParams, useRouter } from 'next/navigation';
import CreateEntryPage from '@/components/entities/CreateEntryPage';

export default function CreateEntry() {
  const params = useParams();
  const router = useRouter();
  const entityId = params?.entityId as string;

  return (
    <CreateEntryPage
      entityId={entityId}
      onBack={() => router.push(`/entities/${entityId}/entries`)}
    />
  );
}
