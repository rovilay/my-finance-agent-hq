'use client';

import { useState } from 'react';
import { useGetFiscalEntitiesQuery, FiscalEntityType } from '@/lib/graphql/generated';
import { Card, CardContent, Button, PageLoader } from '@/components/ui';
import { Building2, Home, User, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const entityTypeIcons = {
  [FiscalEntityType.Individual]: User,
  [FiscalEntityType.Household]: Home,
  [FiscalEntityType.Business]: Building2,
};

const entityTypeLabels = {
  [FiscalEntityType.Individual]: 'Individual',
  [FiscalEntityType.Household]: 'Household',
  [FiscalEntityType.Business]: 'Business',
};

const entityTypeColors = {
  [FiscalEntityType.Individual]: 'bg-blue-100 text-blue-700',
  [FiscalEntityType.Household]: 'bg-green-100 text-green-700',
  [FiscalEntityType.Business]: 'bg-purple-100 text-purple-700',
};

export default function EntitiesPage() {
  const { user } = useAuth();
  const [filterType, setFilterType] = useState<FiscalEntityType | 'all'>('all');
  const { data, loading, error } = useGetFiscalEntitiesQuery({
    skip: !user,
  });

  if (loading) return <PageLoader message="Loading entities..." />;

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

  const entities = data?.getFiscalEntities || [];
  const filteredEntities =
    filterType === 'all' ? entities : entities.filter(e => e.type === filterType);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Your Entities</h1>
              <p className="text-neutral-600">
                Manage your tax entities and view their financial data
              </p>
            </div>
            <Button variant="primary" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Entity
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              All ({entities.length})
            </button>
            {Object.entries(entityTypeLabels).map(([type, label]) => {
              const count = entities.filter(e => e.type === type).length;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type as FiscalEntityType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>

          {/* Entities Grid */}
          {filteredEntities.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-neutral-500">
                  {filterType === 'all'
                    ? 'No entities yet. Create your first entity to get started.'
                    : `No ${entityTypeLabels[filterType as FiscalEntityType].toLowerCase()} entities found.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntities.map(entity => {
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
    </div>
  );
}
