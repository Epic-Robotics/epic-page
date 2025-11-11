import apiClient from '../client';
import type { ContactInquiry, ContactInquiryStats, InquiryStatus } from '../../types/api';

export interface SubmitContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface UpdateInquiryData {
  status: InquiryStatus;
}

export const contactService = {
  /**
   * Submit contact inquiry (public)
   */
  submitInquiry: async (data: SubmitContactData): Promise<{
    message: string;
    inquiry: { id: string; subject: string; createdAt: string };
  }> => {
    return apiClient.post('/contact', data);
  },

  /**
   * Get all inquiries with optional status filter (admin only)
   */
  getInquiries: async (status?: InquiryStatus): Promise<ContactInquiry[]> => {
    const query = status ? `?status=${status}` : '';
    return apiClient.get<ContactInquiry[]>(`/contact${query}`);
  },

  /**
   * Get inquiry statistics (admin only)
   */
  getInquiryStats: async (): Promise<ContactInquiryStats> => {
    return apiClient.get<ContactInquiryStats>('/contact/stats');
  },

  /**
   * Get inquiry by ID (admin only)
   */
  getInquiryById: async (inquiryId: string): Promise<ContactInquiry> => {
    return apiClient.get<ContactInquiry>(`/contact/${inquiryId}`);
  },

  /**
   * Update inquiry status (admin only)
   */
  updateInquiry: async (inquiryId: string, data: UpdateInquiryData): Promise<ContactInquiry> => {
    return apiClient.put<ContactInquiry>(`/contact/${inquiryId}`, data);
  },

  /**
   * Delete inquiry (admin only)
   */
  deleteInquiry: async (inquiryId: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/contact/${inquiryId}`);
  },
};

export default contactService;
