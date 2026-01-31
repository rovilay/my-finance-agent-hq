'use client';

import { useState } from 'react';
import { Card, CardContent, Button } from '@/components/ui';
import { FileText, Upload as UploadIcon, ArrowLeft } from 'lucide-react';
import DocumentUploadModal from '@/components/documents/DocumentUploadModal';

interface EntityDocumentsPageProps {
  entityId: string;
  onBack: () => void;
}

export default function EntityDocumentsPage({ entityId, onBack }: EntityDocumentsPageProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Entity
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Documents</h1>
                <p className="text-neutral-600">Manage your tax documents and files</p>
              </div>
              <Button onClick={() => setIsUploadModalOpen(true)} variant="primary" size="lg">
                <UploadIcon className="w-5 h-5 mr-2" />
                Upload Document
              </Button>
            </div>
          </div>

          {/* Placeholder */}
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 mb-4">
                Backend query needed: documentsByEntity(entityId, skip, take)
              </p>
              <p className="text-sm text-neutral-400">
                This will display paginated documents for this entity
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        entityId={entityId}
      />
    </div>
  );
}
