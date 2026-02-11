import { useState, useMemo } from 'react';
import { Card, CardContent, Button, Tabs, Tab } from '@/components/ui';
import { FileText, Upload as UploadIcon, Loader2, AlertCircle } from 'lucide-react';
import DocumentUploadModal from '@/components/documents/DocumentUploadModal';
import DocumentReviewModal from '@/components/documents/DocumentReviewModal';
import { BackButton } from '../BackButton';
import { useGetDocumentsByEntityQuery, DocumentStatus, type Document } from '@/lib/graphql';
import { format } from 'date-fns';
import { Pagination } from '../Pagination';
import { usePagination } from '@/hooks/usePagination';
import { STATUS_CONFIG } from './constants';

interface EntityDocumentsPageProps {
  entityId: string;
  onBack: () => void;
}

export default function EntityDocumentsPage({ entityId, onBack }: EntityDocumentsPageProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [reviewDocument, setReviewDocument] = useState<Document | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | 'ALL'>('ALL');
  const { take, skip, handleLoadMore, handleLoadPrevious } = usePagination({});

  const { data, loading, error, refetch } = useGetDocumentsByEntityQuery({
    variables: {
      entityId,
      pagination: { skip, take },
      status: selectedStatus === 'ALL' ? undefined : selectedStatus,
    },
  });

  console.log('reviewDocument', reviewDocument?.decryptedData);

  const documents = data?.documentsByEntity.items || [];
  const total = data?.documentsByEntity.total || 0;
  const hasMore = data?.documentsByEntity.hasMore || false;

  const formatFileSize = (sizeInKb: number) => {
    if (sizeInKb < 1024) {
      return `${sizeInKb.toFixed(1)} KB`;
    }
    return `${(sizeInKb / 1024).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('text')) return '📝';
    return '📎';
  };

  // Generate tabs with counts
  const tabs: Tab[] = useMemo(
    () => [
      {
        id: 'ALL',
        label: 'All',
      },
      {
        id: DocumentStatus.Uploaded,
        label: 'Uploaded',
      },
      {
        id: DocumentStatus.Processed,
        label: 'Processed',
      },
      {
        id: DocumentStatus.Verified,
        label: 'Verified',
      },
      {
        id: DocumentStatus.Failed,
        label: 'Failed',
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <BackButton onClick={onBack} text="Back to Entity" />

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

          {/* Filter Tabs */}
          {!loading && !error && (
            <div className="mb-6">
              <Tabs
                tabs={tabs}
                activeTab={selectedStatus}
                onTabChange={tabId => setSelectedStatus(tabId as DocumentStatus | 'ALL')}
              />
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <Card>
              <CardContent className="py-12 text-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
                <p className="text-neutral-500">Loading documents...</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
                <p className="text-red-600 mb-2">Failed to load documents</p>
                <p className="text-sm text-neutral-500">{error.message}</p>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && documents.length === 0 && selectedStatus === 'ALL' && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 mb-4">No documents uploaded yet</p>
                <Button onClick={() => setIsUploadModalOpen(true)} variant="primary">
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Upload Your First Document
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Filtered Empty State */}
          {!loading && !error && documents.length === 0 && selectedStatus !== 'ALL' && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 mb-2">
                  No documents found with status "{selectedStatus}"
                </p>
                <Button onClick={() => setSelectedStatus('ALL')} variant="outline">
                  Show All Documents
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Documents List */}
          {!loading && !error && documents.length > 0 && (
            <div className="space-y-4">
              {documents.map(doc => {
                const config = STATUS_CONFIG[doc.status];
                const StatusIcon = config.icon;

                return (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-4xl">{getFileIcon(doc.fileMetadata.mimeType)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-neutral-900 truncate max-w-md">
                                {doc.fileName}
                              </h3>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color} flex items-center gap-1`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {config.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-neutral-500">
                              <span>{formatFileSize(doc.fileMetadata.sizeInKb)}</span>
                              <span>•</span>
                              <span>
                                Uploaded {format(new Date(doc.createdAt), 'MMM dd, yyyy')}
                              </span>
                              {doc.purgedAt && (
                                <>
                                  <span>•</span>
                                  <span className="text-neutral-400">
                                    Purged {format(new Date(doc.purgedAt), 'MMM dd, yyyy')}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {doc.status === DocumentStatus.Processed && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setReviewDocument(doc)}
                            >
                              Review Extraction
                            </Button>
                          )}
                          {doc.status === DocumentStatus.Purged && (
                            <span className="text-xs text-neutral-400 italic">
                              File removed for privacy
                            </span>
                          )}
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
                handleLoadMore={handleLoadMore}
                handleLoadPrevious={handleLoadPrevious}
              />
            </div>
          )}
        </div>
      </div>

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        entityId={entityId}
        onUploadSuccess={() => {
          refetch();
        }}
      />

      {reviewDocument && (
        <DocumentReviewModal
          isOpen={!!reviewDocument}
          onClose={() => setReviewDocument(null)}
          documentId={reviewDocument.id}
          entityId={entityId}
          fileName={reviewDocument.fileName}
          extractedData={reviewDocument.decryptedData}
          retentionPolicy={reviewDocument.retentionPolicy}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
    </div>
  );
}
