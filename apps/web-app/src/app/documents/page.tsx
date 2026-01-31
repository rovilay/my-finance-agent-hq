import type { Metadata } from 'next';
import DocumentsPage from '@/components/documents/DocumentsPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Documents',
  description: 'View and manage your encrypted tax documents securely',
};

export default function Documents() {
  return (
    <ProtectedRoute>
      <DocumentsPage />
    </ProtectedRoute>
  );
}
