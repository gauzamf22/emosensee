import apiClient, { ApiResponse, handleApiError } from './api';

// Types
export interface Journal {
  id: string; // uuid
  user_id: string; // uuid
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJournalData {
  title: string;
  description: string;
}

export interface UpdateJournalData {
  title?: string;
  description?: string;
}

export interface JournalsListResponse {
  journals: Journal[];
  total?: number;
  page?: number;
  per_page?: number;
}

// Journal API calls
export const journalService = {
  // Get all journals
  async getAll(params?: { page?: number; per_page?: number }): Promise<Journal[]> {
    try {
      const response = await apiClient.get<ApiResponse<JournalsListResponse>>(
        '/api/journals',
        { params }
      );
      // Handle both array and object response formats
      const data = response.data.data;
      return Array.isArray(data) ? data : data.journals || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get single journal
  async getById(id: string): Promise<Journal> {
    try {
      const response = await apiClient.get<ApiResponse<Journal>>(
        `/api/journals/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create journal
  async create(data: CreateJournalData): Promise<Journal> {
    try {
      const response = await apiClient.post<ApiResponse<Journal>>(
        '/api/journals',
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update journal
  async update(id: string, data: UpdateJournalData): Promise<Journal> {
    try {
      const response = await apiClient.put<ApiResponse<Journal>>(
        `/api/journals/${id}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete journal
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/journals/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default journalService;

// Compatibility wrappers for old API
export interface Pagination {
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface JournalResponse {
  success: boolean;
  message?: string;
  data: Journal[];
  pagination?: Pagination;
}

export async function createJournal(title: string, description: string): Promise<Journal> {
  return journalService.create({ title, description });
}

export async function getJournals(limit: number = 10, offset: number = 0): Promise<JournalResponse> {
  const allJournals = await journalService.getAll();
  const start = offset;
  const end = offset + limit;
  const data = allJournals.slice(start, end);
  const hasMore = end < allJournals.length;
  
  return {
    success: true,
    data,
    pagination: {
      limit,
      offset,
      hasMore,
    },
  };
}
