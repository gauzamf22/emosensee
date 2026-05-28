import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { authService } from './auth';

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

interface ConversationEntry {
  user_message: string;
  counselor_reply: string;
}

interface MemoryData {
  conversation_history: ConversationEntry[];
  lastUpdated: string | null;
}

interface MemoryResponse {
  success: boolean;
  data: MemoryData;
  message?: string;
}

export async function sendChatMessage(message: string, language?: 'id-ID' | 'en-US'): Promise<ChatData> {
  // Get current auth token
  const token = authService.getToken();
  
  if (!token) {
    throw new Error('Anda harus login terlebih dahulu');
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AI_CHAT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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

export async function getMemory(): Promise<MemoryData> {
  // Get current auth token
  const token = authService.getToken();
  
  if (!token) {
    throw new Error('Anda harus login terlebih dahulu');
  }

  const response = await fetch(`${API_BASE_URL}/api/ai/memory`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const json: MemoryResponse = await response.json();
  
  if (!json.success) {
    throw new Error(json.message || 'API request failed');
  }

  return json.data;
}
