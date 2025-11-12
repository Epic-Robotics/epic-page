import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../api/services';
import type { Course, ApiError } from '../types/api';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    search: '',
  });

  useEffect(() => {
    loadCourses();
  }, [filters]);

  const loadCourses = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await courseService.getCourses({
        category: filters.category || undefined,
        level: (filters.level as any) || undefined,
        search: filters.search || undefined,
      });
      setCourses(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al cargar los cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, category: e.target.value });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, level: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ category: '', level: '', search: '' });
  };

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nuestros Cursos
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Descubre nuestra colección de cursos diseñados para impulsar tu
            carrera profesional
          </p>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  className="input input-bordered w-full"
                  value={filters.search}
                  onChange={handleSearchChange}
                />
              </div>

              {/* Category */}
              <div className="form-control">
                <select
                  className="select select-bordered w-full"
                  value={filters.category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Todas las categorías</option>
                  <option value="Programming">Programación</option>
                  <option value="Computer Vision">Visión Artificial</option>
                  <option value="Artifitial Intelligence">
                    Inteligencia Artificial
                  </option>
                  <option value="Math">Matemáticas</option>
                  <option value="Data Science">Ciencia de Datos</option>
                </select>
              </div>

              {/* Level */}
              <div className="form-control">
                <select
                  className="select select-bordered w-full"
                  value={filters.level}
                  onChange={handleLevelChange}
                >
                  <option value="">Todos los niveles</option>
                  <option value="BEGINNER">Principiante</option>
                  <option value="INTERMEDIATE">Intermedio</option>
                  <option value="ADVANCED">Avanzado</option>
                  <option value="ALL_LEVELS">Todos los niveles</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="form-control">
                <button
                  onClick={clearFilters}
                  className="btn btn-outline w-full"
                >
                  Limpiar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-8">
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
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && (
          <>
            {courses.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold mb-2">
                  No se encontraron cursos
                </h3>
                <p className="text-base-content/70 mb-4">
                  Intenta ajustar los filtros de búsqueda
                </p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Ver todos los cursos
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-base-content/70">
                  Mostrando {courses.length}{' '}
                  {courses.length === 1 ? 'curso' : 'cursos'}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Course Card Component
function CourseCard({ course }: { course: Course }) {
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'badge-success';
      case 'INTERMEDIATE':
        return 'badge-warning';
      case 'ADVANCED':
        return 'badge-error';
      default:
        return 'badge-info';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'Principiante';
      case 'INTERMEDIATE':
        return 'Intermedio';
      case 'ADVANCED':
        return 'Avanzado';
      case 'ALL_LEVELS':
        return 'Todos los niveles';
      default:
        return level;
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      {/* Course Image */}
      <figure className="h-48 bg-base-300">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            📚
          </div>
        )}
      </figure>

      <div className="card-body">
        {/* Category & Level */}
        <div className="flex gap-2 mb-2">
          <span className="badge badge-outline">{course.category}</span>
          <span className={`badge ${getLevelBadgeColor(course.level)}`}>
            {getLevelText(course.level)}
          </span>
        </div>

        {/* Title */}
        <h2 className="card-title text-lg line-clamp-2">{course.title}</h2>

        {/* Description */}
        <p className="text-sm text-base-content/70 line-clamp-3">
          {course.description}
        </p>

        {/* Instructor */}
        {course.instructor && (
          <div className="text-sm text-base-content/60 mt-2">
            Por: {course.instructor.user?.profileData.name || 'Instructor'}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-base-content/60 mt-2">
          {course.averageRating && (
            <div className="flex items-center gap-1">
              <span className="text-warning">★</span>
              <span>{course.averageRating.toFixed(1)}</span>
            </div>
          )}
          {course.totalEnrollments !== undefined && (
            <div>{course.totalEnrollments} estudiantes</div>
          )}
        </div>

        {/* Footer */}
        <div className="card-actions justify-between items-center mt-4">
          <div className="text-2xl font-bold text-primary">
            ${Number(course.price).toFixed(2)}
          </div>
          <Link to={`/cursos/${course.id}`} className="btn btn-primary btn-sm">
            Ver Curso
          </Link>
        </div>
      </div>
    </div>
  );
}
