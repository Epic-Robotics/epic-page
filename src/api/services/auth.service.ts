import apiClient, { TokenStorage } from '../client';
import type { AuthResponse, User } from '../../types/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface UpdateProfileData {
  name?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  password: string;
}

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.token) {
      TokenStorage.set(response.token);
    }
    return response;
  },

  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.token) {
      TokenStorage.set(response.token);
    }
    return response;
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      TokenStorage.remove();
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>('/users/profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    return apiClient.put<User>('/users/profile', data);
  },

  /**
   * Update user password
   */
  updatePassword: async (data: UpdatePasswordData): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>('/users/password', data);
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (data: PasswordResetRequest): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/password-reset/request', data);
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: PasswordReset): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/auth/password-reset', data);
  },

  /**
   * Initiate Google OAuth login
   * Redirects to backend OAuth endpoint
   */
  loginWithGoogle: (): void => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${API_URL}/api/auth/google`;
  },

  /**
   * Delete current user account
   */
  deleteAccount: async (): Promise<{ message: string; deletedUserId: string; deletedEmail: string }> => {
    const response = await apiClient.delete<{ message: string; deletedUserId: string; deletedEmail: string }>('/users/me');
    TokenStorage.remove();
    return response;
  },
};

export default authService;
