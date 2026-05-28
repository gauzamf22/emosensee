import apiClient, { ApiResponse, handleApiError } from './api';

// Types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
  conversation_history?: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
  conversation_id?: string;
  timestamp?: string;
}

// Chat API calls
export const chatService = {
  // Send message to AI chat
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await apiClient.post<ApiResponse<ChatResponse>>(
        '/api/chat',
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get chat history (if backend supports it)
  async getHistory(conversationId?: string): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get<ApiResponse<ChatMessage[]>>(
        '/api/chat/history',
        { params: { conversation_id: conversationId } }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default chatService;
