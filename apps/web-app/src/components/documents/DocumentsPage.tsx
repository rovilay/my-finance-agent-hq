import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { FileText, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Mock data for demonstration
const mockDocuments = [
  {
    id: '1',
    fileName: 'W2-2023.pdf',
    status: 'verified',
    retentionPolicy: 'permanent',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    fileName: 'T4-Slip-2023.pdf',
    status: 'processed',
    retentionPolicy: 'purge_after_extraction',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    fileName: '1099-MISC-2023.pdf',
    status: 'uploaded',
    retentionPolicy: 'permanent',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
];

export default function DocumentsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-50">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">
              Document Dashboard
            </h1>
            <p className="text-neutral-600">Manage and track your tax documents</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <StatCard
              label="Total Documents"
              value="3"
              icon={<FileText className="w-6 h-6 text-primary-600" />}
              color="primary"
            />
            <StatCard
              label="Processed"
              value="2"
              icon={<CheckCircle className="w-6 h-6 text-success-dark" />}
              color="success"
            />
            <StatCard
              label="Pending"
              value="1"
              icon={<Clock className="w-6 h-6 text-warning-dark" />}
              color="warning"
            />
          </div>

          {/* Documents List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-200">
                {mockDocuments.map(doc => (
                  <DocumentRow key={doc.id} document={doc} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses = {
    primary: 'bg-primary-50 border-primary-200',
    success: 'bg-success-light border-success-dark/20',
    warning: 'bg-warning-light border-warning-dark/20',
  };

  return (
    <Card className={colorClasses[color as keyof typeof colorClasses]}>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-neutral-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-neutral-900">{value}</p>
        </div>
        <div>{icon}</div>
      </CardContent>
    </Card>
  );
}

function DocumentRow({ document }: { document: any }) {
  const statusConfig = {
    uploaded: { label: 'Uploaded', variant: 'warning' as const, icon: Clock },
    processed: { label: 'Processed', variant: 'primary' as const, icon: CheckCircle },
    verified: { label: 'Verified', variant: 'success' as const, icon: CheckCircle },
    purged: { label: 'Purged', variant: 'error' as const, icon: Trash2 },
  };

  const status = statusConfig[document.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  return (
    <div className="p-6 hover:bg-neutral-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900 mb-1">{document.fileName}</h3>
            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <span>Uploaded {formatDate(document.createdAt)}</span>
              <span>•</span>
              <span className="capitalize">{document.retentionPolicy.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={status.variant} className="gap-1.5">
            <StatusIcon className="w-3.5 h-3.5" />
            {status.label}
          </Badge>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
