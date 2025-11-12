import apiClient from '../client';
import type { Course, Section, UserProgress, QuizAttemptResponse, CourseLevel, AccessLink, Review, CreateReviewRequest } from '../../types/api';

export interface CourseFilters {
  category?: string;
  level?: CourseLevel;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  instructorId?: string;
  page?: number;
  limit?: number;
}

export interface CreateCourseData {
  title: string;
  description: string;
  price: number;
  category: string;
  level: CourseLevel;
  thumbnail?: string;
  language: string;
  whatYouWillLearn?: string[];
  previewVideoUrl?: string;
}

export interface UpdateCourseData extends Partial<CreateCourseData> {
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface CourseReviewData {
  rating: number;
  reviewText?: string;
}

export interface UpdateProgressData {
  lessonId: string;
  completionStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  timeSpent?: number;
}

export interface QuizAnswers {
  [questionIndex: string]: number;
}

export const courseService = {
  /**
   * Get all courses with optional filters
   */
  getCourses: async (filters?: CourseFilters): Promise<Course[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get<{ courses: Course[]; pagination: any }>(`/courses${query}`);
    return response.courses;
  },

  /**
   * Get course by ID
   */
  getCourseById: async (courseId: string): Promise<Course> => {
    return apiClient.get<Course>(`/courses/${courseId}`);
  },

  /**
   * Get course lessons/content
   */
  getCourseLessons: async (courseId: string): Promise<Section[]> => {
    return apiClient.get<Section[]>(`/courses/${courseId}/lessons`);
  },

  /**
   * Create a new course (instructor only)
   */
  createCourse: async (data: CreateCourseData): Promise<Course> => {
    return apiClient.post<Course>('/courses', data);
  },

  /**
   * Update course (instructor only)
   */
  updateCourse: async (courseId: string, data: UpdateCourseData): Promise<Course> => {
    return apiClient.put<Course>(`/courses/${courseId}`, data);
  },

  /**
   * Delete course (instructor only)
   */
  deleteCourse: async (courseId: string): Promise<{ message: string }> => {
    return apiClient.delete<{ message: string }>(`/courses/${courseId}`);
  },

  /**
   * Enroll in a course
   */
  enrollInCourse: async (courseId: string): Promise<{ message: string; enrollment: unknown }> => {
    return apiClient.post<{ message: string; enrollment: unknown }>(`/courses/${courseId}/enroll`);
  },

  /**
   * Add or update course review
   */
  addReview: async (courseId: string, data: CourseReviewData): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(`/courses/${courseId}/review`, data);
  },

  /**
   * Get user's learning progress
   */
  getProgress: async (): Promise<UserProgress[]> => {
    return apiClient.get<UserProgress[]>('/learn/progress');
  },

  /**
   * Update lesson progress
   */
  updateProgress: async (data: UpdateProgressData): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>('/learn/progress', data);
  },

  /**
   * Get enrolled course with progress
   */
  getEnrolledCourse: async (courseId: string): Promise<Course> => {
    return apiClient.get<Course>(`/learn/courses/${courseId}`);
  },

  /**
   * Submit quiz attempt
   */
  submitQuiz: async (quizId: string, answers: QuizAnswers): Promise<QuizAttemptResponse> => {
    return apiClient.post<QuizAttemptResponse>(`/learn/quiz/${quizId}/attempt`, { answers });
  },

  /**
   * Get enrolled courses
   */
  getEnrolledCourses: async (): Promise<Course[]> => {
    return apiClient.get<Course[]>('/users/enrolled-courses');
  },

  /**
   * Generate access link for course (instructor: own courses / admin: any course)
   */
  generateAccessLink: async (courseId: string, maxUses?: number, expiresAt?: string): Promise<AccessLink> => {
    return apiClient.post<AccessLink>(`/courses/${courseId}/access-links`, { maxUses, expiresAt });
  },

  /**
   * Get access links for course (instructor: own courses / admin: any course)
   */
  getCourseAccessLinks: async (courseId: string): Promise<AccessLink[]> => {
    return apiClient.get<AccessLink[]>(`/courses/${courseId}/access-links`);
  },

  /**
   * Get reviews for a course
   */
  getCourseReviews: async (courseId: string): Promise<Review[]> => {
    return apiClient.get<Review[]>(`/courses/${courseId}/reviews`);
  },

  /**
   * Update course review
   */
  updateReview: async (courseId: string, data: CreateReviewRequest): Promise<Review> => {
    return apiClient.post<Review>(`/courses/${courseId}/review`, data);
  },
};

export default courseService;
