import apiClient, { ApiResponse, handleApiError } from './api';

export interface DailyInsight {
  id: string;
  user_id: string;
  source_type: 'daily_summary' | 'weekly_summary';
  insight_text: string;
  created_at: string;
}

export async function getDailyInsight(): Promise<DailyInsight | null> {
  try {
    const response = await apiClient.get<ApiResponse<DailyInsight>>(
      '/api/ai/insight'
    );
    return response.data.data;
  } catch (error) {
    console.error('getDailyInsight: Failed to fetch insight:', error);
    return null;
  }
}
