'use client';

import { useParams, useRouter } from 'next/navigation';
import EntityDocumentsPage from '@/components/entities/EntityDocumentsPage';

export default function EntityDocuments() {
  const params = useParams();
  const router = useRouter();
  const entityId = params?.entityId as string;

  return (
    <EntityDocumentsPage entityId={entityId} onBack={() => router.push(`/entities/${entityId}`)} />
  );
}
