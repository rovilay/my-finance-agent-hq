'use client';

import { Card, CardContent, Button } from '@/components/ui';
import { Plus, Package } from 'lucide-react';
import Link from 'next/link';
import { BackButton } from '../BackButton';

interface EntityEntriesPageProps {
  entityId: string;
  onBack: () => void;
}

export default function EntityEntriesPage({ entityId, onBack }: EntityEntriesPageProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <BackButton onClick={onBack} text="Back to Entity" />

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Financial Entries</h1>
                <p className="text-neutral-600">View and manage your financial transactions</p>
              </div>
              <Link href={`/entities/${entityId}/entries/create`}>
                <Button variant="primary" size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  New Entry
                </Button>
              </Link>
            </div>
          </div>

          {/* Placeholder */}
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 mb-4">
                Uses existing ledger query but needs pagination support
              </p>
              <p className="text-sm text-neutral-400">
                Backend update needed: ledger(entityId, taxYear, skip, take)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
