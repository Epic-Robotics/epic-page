import apiClient from '../client';
import type { Certificate } from '../../types/api';

export const certificateService = {
  /**
   * Issue certificate for completed course
   */
  issueCertificate: async (courseId: string): Promise<Certificate> => {
    return apiClient.post<Certificate>(`/certificates/issue/${courseId}`);
  },

  /**
   * Get user's certificates
   */
  getCertificates: async (): Promise<Certificate[]> => {
    return apiClient.get<Certificate[]>('/certificates');
  },

  /**
   * Get certificate by ID
   */
  getCertificateById: async (certificateId: string): Promise<Certificate> => {
    return apiClient.get<Certificate>(`/certificates/${certificateId}`);
  },

  /**
   * Get certificate for specific course
   */
  getCertificateByCourse: async (courseId: string): Promise<Certificate> => {
    return apiClient.get<Certificate>(`/certificates/course/${courseId}`);
  },

  /**
   * Get certificate download URL
   */
  getDownloadUrl: (certificateId: string): string => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('auth_token');
    return `${API_URL}/api/certificates/${certificateId}/download?token=${token}`;
  },

  /**
   * Get certificate preview URL
   */
  getPreviewUrl: (certificateId: string): string => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('auth_token');
    return `${API_URL}/api/certificates/${certificateId}/preview?token=${token}`;
  },

  /**
   * Verify certificate by code (public)
   */
  verifyCertificate: async (code: string): Promise<{
    valid: boolean;
    certificate?: {
      code: string;
      studentName: string;
      courseName: string;
      category: string;
      issuedAt: string;
    };
    message?: string;
  }> => {
    return apiClient.get(`/certificates/verify/${code}`);
  },
};

export default certificateService;
