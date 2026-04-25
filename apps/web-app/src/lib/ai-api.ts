import { getIdToken } from '@/lib/firebase/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getIdToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  };
}

export interface ChatPayload {
  message: string;
  entityId: string;
  taxYear?: string;
}

export async function sendTaxChatMessage(payload: ChatPayload): Promise<{ response: string }> {
  const response = await fetch(`${API_BASE}/api/ai/tax-education-chat`, {
    method: 'POST',
    headers: await authHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to get response');
  return response.json();
}

export interface HistoryMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

export async function fetchConversationHistory(
  entityId: string,
  taxYear?: string
): Promise<{ messages: HistoryMessage[] }> {
  const params = new URLSearchParams({ entityId });
  if (taxYear) params.set('taxYear', taxYear);
  const response = await fetch(`${API_BASE}/api/ai/conversation-history?${params.toString()}`, {
    headers: await authHeaders(),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to load history');
  return response.json();
}

export interface FeedbackPayload {
  rating: number;
  category: 'bug' | 'feature_request' | 'general';
  comment: string;
}

export async function submitFeedback(payload: FeedbackPayload): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE}/api/feedback`, {
    method: 'POST',
    headers: await authHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to submit feedback');
  return response.json();
}
