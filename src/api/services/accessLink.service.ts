import apiClient from '../client';
import type { AccessLinkInfo } from '../../types/api';

export const accessLinkService = {
  /**
   * Get access link info (public)
   */
  getAccessLinkInfo: async (token: string): Promise<AccessLinkInfo> => {
    return apiClient.get<AccessLinkInfo>(`/access-links/${token}`);
  },

  /**
   * Redeem link and enroll (authenticated)
   */
  redeemAccessLink: async (token: string): Promise<{
    message: string;
    enrollment: {
      id: string;
      courseId: string;
      enrolledAt: string;
    };
  }> => {
    return apiClient.post(`/access-links/redeem/${token}`);
  },

  /**
   * Revoke access link (instructor: own courses / admin: any course)
   */
  revokeAccessLink: async (linkId: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/access-links/${linkId}`);
  },
};

export default accessLinkService;
