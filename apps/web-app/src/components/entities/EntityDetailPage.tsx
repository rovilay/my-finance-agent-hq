'use client';

import { Card, CardContent } from '@/components/ui';
import { FileText, Package, Calendar } from 'lucide-react';
import Link from 'next/link';

interface EntityDetailPageProps {
  entityId: string;
}

export default function EntityDetailPage({ entityId }: EntityDetailPageProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          {/* Entity Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Entity Overview</h1>
                <p className="text-neutral-600">Entity ID: {entityId}</p>
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
                        <p className="text-sm text-neutral-600">View all documents</p>
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
                        <p className="text-sm text-neutral-600">Manage entries</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Card className="bg-neutral-100">
                <CardContent className="py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent-100 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-accent-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Tax Years</h3>
                      <p className="text-sm text-neutral-600">Coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
