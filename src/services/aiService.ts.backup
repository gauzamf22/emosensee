import apiClient, { ApiResponse, handleApiError } from './api';
import { API_ENDPOINTS } from '../config/api';

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

interface ConversationEntry {
  user_message: string;
  counselor_reply: string;
}

interface MemoryData {
  conversation_history: ConversationEntry[];
  lastUpdated: string | null;
}

export async function sendChatMessage(message: string, language?: 'id-ID' | 'en-US'): Promise<ChatData> {
  try {
    const response = await apiClient.post<ApiResponse<ChatData>>(
      API_ENDPOINTS.AI_CHAT,
      { message, language }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function getMemory(): Promise<MemoryData> {
  try {
    const response = await apiClient.get<ApiResponse<MemoryData>>('/api/ai/memory');
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
}
