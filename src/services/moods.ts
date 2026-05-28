import apiClient, { ApiResponse, handleApiError } from './api';

// Types
export interface Mood {
  id: number;
  user_id: number;
  mood: string;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMoodData {
  mood: string;
  note?: string;
}

export interface MoodsListResponse {
  moods: Mood[];
  total?: number;
  page?: number;
  per_page?: number;
}

export interface MoodStats {
  mood: string;
  count: number;
  percentage?: number;
}

// Mood API calls
export const moodService = {
  // Get all moods
  async getAll(params?: { page?: number; per_page?: number; date?: string }): Promise<Mood[]> {
    try {
      const response = await apiClient.get<ApiResponse<MoodsListResponse>>(
        '/api/moods',
        { params }
      );
      // Handle both array and object response formats
      const data = response.data.data;
      return Array.isArray(data) ? data : data.moods || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get single mood
  async getById(id: number): Promise<Mood> {
    try {
      const response = await apiClient.get<ApiResponse<Mood>>(
        `/api/moods/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create mood entry
  async create(data: CreateMoodData): Promise<Mood> {
    try {
      const response = await apiClient.post<ApiResponse<Mood>>(
        '/api/moods',
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get mood statistics
  async getStats(params?: { start_date?: string; end_date?: string }): Promise<MoodStats[]> {
    try {
      const response = await apiClient.get<ApiResponse<MoodStats[]>>(
        '/api/moods/stats',
        { params }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete mood
  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/moods/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default moodService;
