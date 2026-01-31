'use client';

import { useMeQuery } from '@/lib/graphql';
import { Card } from '@/components/ui';

export function UserProfile() {
  const { data, loading, error } = useMeQuery();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.me) return <div>No user found</div>;

  const { me } = data;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        {me.avatarUrl && (
          <img
            src={me.avatarUrl}
            alt={`${me.firstName} ${me.lastName}`}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h2 className="text-xl font-bold">
            {me.firstName} {me.lastName}
          </h2>
          <p className="text-neutral-600">{me.email}</p>
          {me.bio && <p className="text-sm text-neutral-500 mt-2">{me.bio}</p>}
        </div>
      </div>
    </Card>
  );
}
