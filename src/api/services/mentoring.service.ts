import apiClient from '../client';
import type {
  InstructorAvailability,
  MentoringSession,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  BookSessionRequest,
  UpdateSessionRequest,
  Instructor
} from '../../types/api';

export const mentoringService = {
  /**
   * Get available instructors (public)
   */
  getInstructors: async (): Promise<Instructor[]> => {
    return apiClient.get<Instructor[]>('/mentoring/instructors');
  },

  /**
   * Get instructor availability (public)
   */
  getInstructorAvailability: async (instructorId: string): Promise<InstructorAvailability[]> => {
    return apiClient.get<InstructorAvailability[]>(`/mentoring/instructors/${instructorId}/availability`);
  },

  /**
   * Set availability (instructor)
   */
  setAvailability: async (data: CreateAvailabilityRequest): Promise<InstructorAvailability> => {
    return apiClient.post<InstructorAvailability>('/mentoring/availability', data);
  },

  /**
   * Get my availability (instructor)
   */
  getMyAvailability: async (): Promise<InstructorAvailability[]> => {
    return apiClient.get<InstructorAvailability[]>('/mentoring/availability');
  },

  /**
   * Update availability (instructor)
   */
  updateAvailability: async (availabilityId: string, data: UpdateAvailabilityRequest): Promise<InstructorAvailability> => {
    return apiClient.put<InstructorAvailability>(`/mentoring/availability/${availabilityId}`, data);
  },

  /**
   * Delete availability (instructor)
   */
  deleteAvailability: async (availabilityId: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/mentoring/availability/${availabilityId}`);
  },

  /**
   * Book session (student)
   */
  bookSession: async (data: BookSessionRequest): Promise<MentoringSession> => {
    return apiClient.post<MentoringSession>('/mentoring/sessions', data);
  },

  /**
   * Get my sessions (instructor/student)
   */
  getMySessions: async (): Promise<MentoringSession[]> => {
    return apiClient.get<MentoringSession[]>('/mentoring/sessions');
  },

  /**
   * Get session details
   */
  getSessionById: async (sessionId: string): Promise<MentoringSession> => {
    return apiClient.get<MentoringSession>(`/mentoring/sessions/${sessionId}`);
  },

  /**
   * Update session
   */
  updateSession: async (sessionId: string, data: UpdateSessionRequest): Promise<MentoringSession> => {
    return apiClient.put<MentoringSession>(`/mentoring/sessions/${sessionId}`, data);
  },

  /**
   * Cancel session
   */
  cancelSession: async (sessionId: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/mentoring/sessions/${sessionId}`);
  },
};

export default mentoringService;
