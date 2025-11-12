import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../api/services';
import type { ApiError } from '../types/api';

interface EnrolledCourse {
  id: string;
  userId: string;
  courseId: string;
  enrollmentDate: string;
  completionStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  progress: number;
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
    category: string;
    level: string;
    instructor: {
      id: string;
      user: {
        profileData: {
          name?: string;
        };
      };
    };
  };
}

export default function MyCourses() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    loadEnrolledCourses();
  }, []);

  const loadEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await authService.getEnrolledCourses();
      setCourses(data as any);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al cargar tus cursos');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCourses = () => {
    if (filter === 'all') return courses;
    if (filter === 'in_progress') {
      return courses.filter(c => c.completionStatus === 'IN_PROGRESS' || c.completionStatus === 'NOT_STARTED');
    }
    return courses.filter(c => c.completionStatus === 'COMPLETED');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge-success">Completado</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-info">En Progreso</span>;
      case 'NOT_STARTED':
        return <span className="badge badge-ghost">No Iniciado</span>;
      default:
        return null;
    }
  };

  const filteredCourses = getFilteredCourses();

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Mis Cursos</h1>
          <p className="text-base-content/70">Continúa tu aprendizaje</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
            <button onClick={() => setError('')} className="btn btn-sm btn-ghost">✕</button>
          </div>
        )}

        {/* Filter Tabs */}
        {courses.length > 0 && (
          <div className="tabs tabs-boxed mb-6 bg-base-100">
            <a
              className={`tab ${filter === 'all' ? 'tab-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todos ({courses.length})
            </a>
            <a
              className={`tab ${filter === 'in_progress' ? 'tab-active' : ''}`}
              onClick={() => setFilter('in_progress')}
            >
              En Progreso ({courses.filter(c => c.completionStatus !== 'COMPLETED').length})
            </a>
            <a
              className={`tab ${filter === 'completed' ? 'tab-active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completados ({courses.filter(c => c.completionStatus === 'COMPLETED').length})
            </a>
          </div>
        )}

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold mb-2">
                {courses.length === 0 ? 'No tienes cursos inscritos' : 'No hay cursos en esta categoría'}
              </h2>
              <p className="text-base-content/70 mb-4">
                {courses.length === 0 ? 'Explora nuestro catálogo y comienza a aprender' : 'Filtra por otra categoría'}
              </p>
              {courses.length === 0 && (
                <Link to="/cursos" className="btn btn-primary">
                  Explorar Cursos
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((enrollment) => (
              <div key={enrollment.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                {/* Thumbnail */}
                {enrollment.course.thumbnail ? (
                  <figure className="h-48">
                    <img
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                ) : (
                  <figure className="h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <div className="text-6xl">📚</div>
                  </figure>
                )}

                <div className="card-body">
                  {/* Title & Status */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="card-title text-lg flex-1">{enrollment.course.title}</h3>
                    {getStatusBadge(enrollment.completionStatus)}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-base-content/70 line-clamp-2 mb-3">
                    {enrollment.course.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progreso</span>
                      <span className="font-semibold">{enrollment.progress}%</span>
                    </div>
                    <progress
                      className="progress progress-primary w-full"
                      value={enrollment.progress}
                      max="100"
                    ></progress>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-2 text-xs text-base-content/60 mb-4">
                    <span className="badge badge-ghost badge-sm">{enrollment.course.category}</span>
                    <span className="badge badge-ghost badge-sm">{enrollment.course.level}</span>
                    <span className="badge badge-ghost badge-sm">
                      {enrollment.course.instructor.user.profileData.name || 'Instructor'}
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="card-actions">
                    <Link
                      to={`/learn/${enrollment.courseId}`}
                      className="btn btn-primary btn-block btn-sm"
                    >
                      {enrollment.completionStatus === 'NOT_STARTED' ? 'Comenzar' : 'Continuar'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
