import type { ApiError } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH || '/api';

export const BASE_URL = `${API_URL}${API_BASE_PATH}`;

// Token management
export const TokenStorage = {
  get: (): string | null => {
    return localStorage.getItem('auth_token');
  },
  set: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },
  remove: (): void => {
    localStorage.removeItem('auth_token');
  },
};

// API Client class
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = TokenStorage.get();
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle empty responses (204 No Content, etc.)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          error: data.error || data.message || 'An error occurred',
          status: response.status,
          field: data.field,
        };
        throw error;
      }

      return data as T;
    } catch (error) {
      // If it's already an ApiError, rethrow it
      if ((error as ApiError).status) {
        throw error;
      }

      // Network error or other error
      throw {
        error: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export const apiClient = new ApiClient(BASE_URL);
export default apiClient;
