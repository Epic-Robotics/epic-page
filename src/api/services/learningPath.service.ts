import apiClient from '../client';
import type { LearningPath, CourseLevel } from '../../types/api';

export interface CreateLearningPathData {
  title: string;
  description: string;
  thumbnail?: string;
  difficulty?: CourseLevel;
  orderIndex?: number;
  courseIds?: string[];
}

export interface UpdateLearningPathData extends Partial<CreateLearningPathData> {
  isPublished?: boolean;
}

export interface AddCourseToPathData {
  courseId: string;
  orderIndex?: number;
}

export interface ReorderCoursesData {
  courseOrders: Array<{
    courseId: string;
    orderIndex: number;
  }>;
}

export const learningPathService = {
  /**
   * Get all learning paths (public)
   */
  getLearningPaths: async (): Promise<LearningPath[]> => {
    return apiClient.get<LearningPath[]>('/learning-paths');
  },

  /**
   * Get learning path by ID (public)
   */
  getLearningPathById: async (pathId: string): Promise<LearningPath> => {
    return apiClient.get<LearningPath>(`/learning-paths/${pathId}`);
  },

  /**
   * Create learning path (admin only)
   */
  createLearningPath: async (data: CreateLearningPathData): Promise<LearningPath> => {
    return apiClient.post<LearningPath>('/learning-paths', data);
  },

  /**
   * Update learning path (admin only)
   */
  updateLearningPath: async (pathId: string, data: UpdateLearningPathData): Promise<LearningPath> => {
    return apiClient.put<LearningPath>(`/learning-paths/${pathId}`, data);
  },

  /**
   * Delete learning path (admin only)
   */
  deleteLearningPath: async (pathId: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/learning-paths/${pathId}`);
  },

  /**
   * Add course to learning path (admin only)
   */
  addCourseToPath: async (pathId: string, data: AddCourseToPathData): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(`/learning-paths/${pathId}/courses`, data);
  },

  /**
   * Remove course from learning path (admin only)
   */
  removeCourseFromPath: async (pathId: string, courseId: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/learning-paths/${pathId}/courses/${courseId}`);
  },

  /**
   * Reorder courses in learning path (admin only)
   */
  reorderCourses: async (pathId: string, data: ReorderCoursesData): Promise<{ message: string }> => {
    return apiClient.put<{ message: string }>(`/learning-paths/${pathId}/courses/reorder`, data);
  },
};

export default learningPathService;
