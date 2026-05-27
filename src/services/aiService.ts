import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { supabase } from '../lib/supabase';

interface Analytics {
  emotions: Array<{ label: string; score: number }>;
  keywords: Array<{ keyword: string; score: number }>;
  severity: 'low' | 'medium' | 'high';
  severity_score: number;
}

interface ChatData {
  reply: string;
  analytics: Analytics;
}

interface ChatResponse {
  success: boolean;
  data: ChatData;
  message?: string;
}

export async function sendChatMessage(message: string, language?: 'id-ID' | 'en-US'): Promise<ChatData> {
  // Get current session token
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('Anda harus login terlebih dahulu');
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AI_CHAT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ message, language }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const json: ChatResponse = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'API request failed');
  }

  return json.data;
}
