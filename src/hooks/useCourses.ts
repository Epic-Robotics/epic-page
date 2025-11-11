import { useState, useEffect } from 'react';
import { courseService } from '../api/services';
import type { Course, CourseLevel, ApiError } from '../types/api';

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

export const useCourses = (filters?: CourseFilters) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, [JSON.stringify(filters)]);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await courseService.getCourses(filters);
      setCourses(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    loadCourses();
  };

  return { courses, loading, error, refresh };
};

export default useCourses;
