'use client';

import { useAuth } from '@/hooks/useAuth';
import { useFirstEntity } from '@/hooks/useFirstEntity';
import { ENTITIES_ROUTE } from '@/lib/constants';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

/**
 * Sticky CTA strip shown at the bottom of authenticated non-Tax pages.
 *
 * Tapping it navigates to the user's Tax Overview with `?chat=open` so the
 * TaxChatWidget auto-opens there — keeping a single widget instance and
 * preserving full financial context and conversation history.
 *
 * Falls back to /entities if the user has no entity yet.
 */
export function TaxAssistantCTA() {
  const { user } = useAuth();
  const { entityId, loading } = useFirstEntity();

  // Only show to authenticated users; hide while resolving entity
  if (!user || loading) return null;

  const href = entityId ? `/entities/${entityId}/tax?chat=open` : ENTITIES_ROUTE;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center pointer-events-none pb-5 px-4">
      <Link
        href={href}
        className="pointer-events-auto inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-primary-600 text-white text-sm font-semibold shadow-lg hover:bg-primary-700 active:scale-95 transition-all"
      >
        <Sparkles className="w-4 h-4 shrink-0" />
        Ask the Tax Assistant
        <span className="opacity-60">→</span>
      </Link>
    </div>
  );
}
