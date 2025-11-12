import apiClient from '../client';
import type {
  UserProgress,
  CourseWithProgress,
  QuizAttemptResponse,
  UpdateProgressRequest,
  ProgressUpdateResponse,
  QuizAttemptRequest
} from '../../types/api';

export const learningService = {
  /**
   * Get user's learning progress across all enrolled courses
   */
  getProgress: async (): Promise<UserProgress[]> => {
    return apiClient.get<UserProgress[]>('/learn/progress');
  },

  /**
   * Update lesson progress
   */
  updateProgress: async (data: UpdateProgressRequest): Promise<ProgressUpdateResponse> => {
    return apiClient.post<ProgressUpdateResponse>('/learn/progress', data);
  },

  /**
   * Get enrolled course with progress details
   */
  getCourseWithProgress: async (courseId: string): Promise<CourseWithProgress> => {
    return apiClient.get<CourseWithProgress>(`/learn/courses/${courseId}`);
  },

  /**
   * Submit quiz attempt
   */
  submitQuizAttempt: async (quizId: string, data: QuizAttemptRequest): Promise<QuizAttemptResponse> => {
    return apiClient.post<QuizAttemptResponse>(`/learn/quiz/${quizId}/attempt`, data);
  },
};

export default learningService;
