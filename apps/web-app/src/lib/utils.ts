import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getIdToken } from '@/lib/firebase';
import { Document, RetentionPolicy } from './graphql';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export async function uploadDocumentToApi(
  file: File,
  entityId: string,
  retentionPolicy?: RetentionPolicy
): Promise<Document> {
  // Get Firebase auth token
  const token = await getIdToken();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityId', entityId);
  if (retentionPolicy) {
    formData.append('retentionPolicy', retentionPolicy);
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/documents/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  }).then(async response => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }
    return response.json();
  });
}
