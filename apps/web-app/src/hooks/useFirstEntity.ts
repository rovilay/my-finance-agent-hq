'use client';

import { useGetFiscalEntitiesQuery } from '@/lib/graphql';
import { useAuth } from './useAuth';

/**
 * Returns the ID of the user's first (most recently created) fiscal entity,
 * or null while loading / when no entities exist.
 */
export function useFirstEntity(): { entityId: string | null; loading: boolean } {
  const { user } = useAuth();

  const { data, loading } = useGetFiscalEntitiesQuery({
    variables: { pagination: { skip: 0, take: 1 } },
    skip: !user,
  });

  const entityId = data?.fiscalEntities?.items?.[0]?.id ?? null;

  return { entityId, loading };
}
