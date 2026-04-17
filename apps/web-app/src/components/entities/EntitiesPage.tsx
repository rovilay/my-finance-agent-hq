import { useState, useMemo } from 'react';
import { useGetFiscalEntitiesQuery, FiscalEntityType } from '@/lib/graphql/generated';
import { Card, CardContent, Button, PageLoader, Tabs, Tab } from '@/components/ui';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { NewEntityModal } from './NewEntityModal';
import { entityTypeColors, entityTypeIcons, entityTypeLabels } from './constants';

export default function EntitiesPage() {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<FiscalEntityType | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, loading, error } = useGetFiscalEntitiesQuery({
    variables: {
      type: filterType === 'ALL' ? undefined : (filterType as FiscalEntityType),
      pagination: {
        skip: 0,
        take: 50,
      },
    },
    skip: !user,
  });

  const tabs: Tab[] = useMemo(() => {
    return [
      { id: 'ALL', label: 'All' },
      {
        id: FiscalEntityType.Individual,
        label: entityTypeLabels[FiscalEntityType.Individual],
      },
      {
        id: FiscalEntityType.Household,
        label: entityTypeLabels[FiscalEntityType.Household],
      },
      {
        id: FiscalEntityType.Business,
        label: entityTypeLabels[FiscalEntityType.Business],
      },
    ];
  }, []);

  if (loading) return <PageLoader message="Loading your tax profiles..." />;

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-error-600">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const entities = data?.fiscalEntities?.items || [];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Tax Profiles</h1>
              <p className="text-neutral-600">
                Select a tax profile to upload documents, review entries, and track your tax
                estimate.
              </p>
            </div>
            <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Profile
            </Button>
          </div>

          {/* Filters */}
          <Tabs
            tabs={tabs}
            activeTab={filterType}
            onTabChange={tabId => setFilterType(tabId as FiscalEntityType | 'ALL')}
            className="mb-6"
          />

          {/* Entities Grid */}
          {entities.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-neutral-500">
                  {filterType === 'ALL'
                    ? 'No tax profiles yet. Add your first profile to get started.'
                    : `No ${entityTypeLabels[filterType as FiscalEntityType].toLowerCase()} profiles found.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entities.map(entity => {
                const Icon = entityTypeIcons[entity.type];
                return (
                  <Link key={entity.id} href={`/entities/${entity.id}`}>
                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-lg ${entityTypeColors[entity.type]} flex items-center justify-center`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${entityTypeColors[entity.type]}`}
                          >
                            {entityTypeLabels[entity.type]}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg text-neutral-900 mb-2">
                          {entity.name}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {entity.province}, {entity.country}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Entity Modal */}
      <NewEntityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
