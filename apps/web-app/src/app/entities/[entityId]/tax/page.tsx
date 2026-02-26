'use client';

import { useParams } from 'next/navigation';
import TaxOverviewPage from '@/components/tax/TaxOverviewPage';

export default function EntityTaxPage() {
  const params = useParams();
  const entityId = params?.entityId as string;

  return <TaxOverviewPage entityId={entityId} />;
}
