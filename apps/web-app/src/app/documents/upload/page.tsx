'use client';

import UploadPage from '@/components/documents/UploadPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Upload() {
  return (
    <ProtectedRoute>
      <UploadPage />
    </ProtectedRoute>
  );
}
