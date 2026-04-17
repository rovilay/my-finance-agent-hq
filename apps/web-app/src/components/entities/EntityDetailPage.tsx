'use client';

import { useState } from 'react';
import { Card, CardContent, Button, PageLoader } from '@/components/ui';
import { FileText, Package, Calendar, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useGetFiscalEntityQuery } from '@/lib/graphql/generated';
import { EditEntityModal } from './EditEntityModal';
import { DeleteEntityModal } from './DeleteEntityModal';
import { useRouter } from 'next/navigation';
import { ENTITIES_ROUTE } from '@/lib/constants';
import { BackButton } from '../BackButton';

interface EntityDetailPageProps {
  entityId: string;
}

export default function EntityDetailPage({ entityId }: EntityDetailPageProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const router = useRouter();

  const { data, loading, error } = useGetFiscalEntityQuery({
    variables: { id: entityId },
  });

  if (loading) return <PageLoader message="Loading..." />;

  if (error || !data?.fiscalEntity) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-error-600">Tax profile not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const entity = data.fiscalEntity;

  const onBack = () => {
    router.push(ENTITIES_ROUTE);
  };

  return (
    <>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-6xl mx-auto py-12">
          <div className="max-w-6xl mx-auto">
            {/* Entity Header */}
            <div className="mb-8">
              <BackButton onClick={onBack} text="Back to My Tax Profiles" />

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">{entity.name}</h1>
                  <p className="text-neutral-600">
                    {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)} • {entity.province}
                    , {entity.country}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="md" onClick={() => setIsEditModalOpen(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-error hover:text-error-dark hover:border-error"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href={`/entities/${entityId}/documents`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900">Documents</h3>
                          <p className="text-sm text-neutral-600">Upload tax slips and forms</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href={`/entities/${entityId}/entries`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-secondary-100 flex items-center justify-center">
                          <Package className="w-6 h-6 text-secondary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900">Financial Entries</h3>
                          <p className="text-sm text-neutral-600">
                            Income, deductions, credits & more
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href={`/entities/${entityId}/tax`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-accent-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900">Tax Summary</h3>
                          <p className="text-sm text-neutral-600">See your tax estimate</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditEntityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        entity={entity}
      />

      {/* Delete Modal */}
      <DeleteEntityModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        entity={entity}
        redirectAfterDelete={true}
      />
    </>
  );
}
