import apiClient, { ApiResponse, handleApiError } from './api';

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  bio?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// User API calls
export const userService = {
  // Get current user profile
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/api/users/profile');
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Update profile
  async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      const response = await apiClient.put<ApiResponse<User>>(
        '/api/users/profile',
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Change password
  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      await apiClient.post('/api/users/change-password', data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Upload avatar
  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await apiClient.post<ApiResponse<{ avatar_url: string }>>(
        '/api/users/avatar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default userService;
