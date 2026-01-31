'use client';

import { useParams } from 'next/navigation';
import EntityDetailPage from '@/components/entities/EntityDetailPage';

export default function EntityDetail() {
  const params = useParams();
  const entityId = params?.entityId as string;

  return <EntityDetailPage entityId={entityId} />;
}
