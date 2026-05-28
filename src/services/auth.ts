import apiClient from './api';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  token: string;
  user: AuthUser;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authService = {
  // Store token in localStorage
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Store user data in localStorage
  setUser(user: AuthUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Get user data from localStorage
  getUser(): AuthUser | null {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // Get session (token + user)
  getSession(): { user: AuthUser } | null {
    const user = this.getUser();
    return user ? { user } : null;
  },

  // Remove token and user from localStorage
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Register new user
  async register(email: string, password: string, username: string): Promise<LoginResponse> {
    // Backend /api/auth/signup doesn't return token, so we register then login
    const response = await apiClient.post<{ success: boolean; data: AuthUser }>('/api/auth/signup', {
      email,
      password,
      username,
    });
    
    // Auto-login after successful registration
    return this.login(email, password);
  },

  // Login existing user
  async login(identifier: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<{ success: boolean; token: string; user: AuthUser }>('/api/auth/signin', {
      identifier, // Can be email or username
      password,
    });
    
    if (response.data.token) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }
    
    return { token: response.data.token, user: response.data.user };
  },

  // Google OAuth - get OAuth URL
  async getGoogleOAuthUrl(): Promise<string> {
    const response = await apiClient.get<{ success: boolean; url: string }>('/api/auth/google');
    return response.data.url;
  },

  // Google OAuth - exchange code for token
  async handleGoogleCallback(code: string): Promise<LoginResponse> {
    const response = await apiClient.get<{ success: boolean; token: string; user: AuthUser }>(`/api/auth/callback?code=${code}`);
    
    if (response.data.token) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }
    
    return { token: response.data.token, user: response.data.user };
  },

  // Logout user (no backend endpoint, just clear local storage)
  async logout(): Promise<void> {
    this.clearToken();
  },

  // Get current user from localStorage
  async getCurrentUser(): Promise<AuthUser | null> {
    return this.getUser();
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
