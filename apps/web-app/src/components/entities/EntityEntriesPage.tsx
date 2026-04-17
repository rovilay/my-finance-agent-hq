import { useState, useMemo } from 'react';
import { Card, CardContent, Button, Tabs, Tab } from '@/components/ui';
import { Plus, Package, Loader2, FileText, PenLine } from 'lucide-react';
import Link from 'next/link';
import { BackButton } from '../BackButton';
import { FinancialEntry, FinancialType, useGetLedgerQuery } from '@/lib/graphql/generated';
import { format } from 'date-fns';
import { TYPE_CONFIG } from './constants';
import EntryInfoModal from './EntryInfoModal';
import { Pagination } from '../Pagination';
import { usePagination } from '@/hooks/usePagination';

interface EntityEntriesPageProps {
  entityId: string;
  onBack: () => void;
}

export default function EntityEntriesPage({ entityId, onBack }: EntityEntriesPageProps) {
  const { take, skip, handleLoadMore, handleLoadPrevious } = usePagination({});
  const [selectedEntry, setSelectedEntry] = useState<FinancialEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<FinancialType | 'ALL'>('ALL');

  const { data, loading, error } = useGetLedgerQuery({
    variables: {
      entityId,
      pagination: { skip, take },
    },
  });

  const allEntries = data?.financialEntries.items || [];
  const entries =
    selectedType === 'ALL' ? allEntries : allEntries.filter(entry => entry.type === selectedType);
  const total = data?.financialEntries.total || 0;
  const hasMore = data?.financialEntries.hasMore || false;

  // Generate tabs with counts
  const tabs: Tab[] = useMemo(
    () => [
      {
        id: 'ALL',
        label: 'All',
      },
      {
        id: FinancialType.Income,
        label: 'Income',
      },
      {
        id: FinancialType.Deduction,
        label: 'Deductions',
      },
      {
        id: FinancialType.Credit,
        label: 'Credits',
      },
      {
        id: FinancialType.TaxPaid,
        label: 'Tax Paid',
      },
    ],
    [allEntries]
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <BackButton onClick={onBack} text="Back to Tax Profile" />

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Financial Entries</h1>
              </div>
              <Link href={`/entities/${entityId}/entries/create`}>
                <Button variant="primary" size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  New Entry
                </Button>
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          {!loading && !error && allEntries.length > 0 && (
            <div className="mb-6">
              <Tabs
                tabs={tabs}
                activeTab={selectedType}
                onTabChange={tabId => setSelectedType(tabId as FinancialType | 'ALL')}
              />
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
                <p className="text-neutral-500">Loading entries...</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-16 h-16 text-red-300 mx-auto mb-4" />
                <p className="text-red-600 mb-2">Failed to load entries</p>
                <p className="text-sm text-neutral-500">{error.message}</p>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && allEntries.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 mb-4">No financial entries yet</p>
                <Link href={`/entities/${entityId}/entries/create`}>
                  <Button variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Entry
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Filtered Empty State */}
          {!loading && !error && allEntries.length > 0 && entries.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 mb-2">No entries found for type "{selectedType}"</p>
                <Button onClick={() => setSelectedType('ALL')} variant="outline">
                  Show All Entries
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Entries List */}
          {!loading && !error && entries.length > 0 && (
            <div className="space-y-4">
              {entries.map(entry => {
                const config = TYPE_CONFIG[entry.type];
                const Icon = config.icon;

                return (
                  <Card
                    key={entry.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedEntry(entry);
                      setIsModalOpen(true);
                    }}
                  >
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`p-3 rounded-lg ${config.bgColor}`}>
                            <Icon className={`w-6 h-6 ${config.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-neutral-900">{entry.category}</h3>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}
                              >
                                {config.label}
                              </span>
                              {entry.sourceDocumentId ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                  <FileText className="w-3 h-3" />
                                  From document
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-500">
                                  <PenLine className="w-3 h-3" />
                                  Manual entry
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-neutral-500">
                              <span>{format(new Date(entry.date), 'MMM dd, yyyy')}</span>
                              <span>•</span>
                              <span>Tax Year {entry.taxYear}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text font-bold text-neutral-900">
                              {entry.currency} $
                              {entry.amount.toLocaleString('en-CA', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <Pagination
                take={take}
                skip={skip}
                total={total}
                hasMore={hasMore}
                handleLoadPrevious={handleLoadPrevious}
                handleLoadMore={handleLoadMore}
              />
            </div>
          )}
        </div>
      </div>

      <EntryInfoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEntry(null);
        }}
        entry={selectedEntry}
      />
    </div>
  );
}
