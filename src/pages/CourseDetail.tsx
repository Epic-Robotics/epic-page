import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService } from '../api/services';
import { useAuth } from '../contexts/AuthContext';
import type { Course, Section, ApiError } from '../types/api';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      loadCourse();
      loadCourseLessons();
    }
  }, [id]);

  const loadCourse = async () => {
    if (!id) return;

    try {
      const data = await courseService.getCourseById(id);
      setCourse(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al cargar el curso');
    } finally {
      setLoading(false);
    }
  };

  const loadCourseLessons = async () => {
    if (!id) return;

    try {
      const data = await courseService.getCourseLessons(id);
      setSections(data);
    } catch (err) {
      console.error('Error loading lessons:', err);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!id) return;

    setEnrolling(true);
    try {
      await courseService.enrollInCourse(id);
      alert('¡Te has inscrito exitosamente!');
      loadCourse(); // Reload to update enrollment status
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.error || 'Error al inscribirse');
    } finally {
      setEnrolling(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Curso no encontrado</h2>
          <p className="text-base-content/70 mb-4">{error}</p>
          <Link to="/cursos" className="btn btn-primary">
            Ver todos los cursos
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = sections.reduce((sum, section) => sum + section.lessons.length, 0);
  const totalDuration = sections.reduce(
    (sum, section) =>
      sum +
      section.lessons.reduce((lessonSum, lesson) => lessonSum + (lesson.duration || 0), 0),
    0
  );
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Breadcrumb */}
          <div className="text-sm breadcrumbs mb-4">
            <ul>
              <li><Link to="/" className="opacity-70 hover:opacity-100">Inicio</Link></li>
              <li><Link to="/cursos" className="opacity-70 hover:opacity-100">Cursos</Link></li>
              <li>{course.title}</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <div className="flex gap-2 mb-4">
                <span className="badge badge-outline border-primary-content text-primary-content">
                  {course.category}
                </span>
                <span className="badge badge-outline border-primary-content text-primary-content">
                  {getLevelText(course.level)}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl mb-6 opacity-90">{course.description}</p>

              {/* Instructor */}
              {course.instructor && (
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full bg-base-100 text-base-content flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {course.instructor.user?.profileData.name?.charAt(0) || 'I'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {course.instructor.user?.profileData.name || 'Instructor'}
                    </p>
                    <p className="text-sm opacity-70">Instructor</p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-4 mt-6">
                {course.averageRating && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="font-bold">{course.averageRating.toFixed(1)}</span>
                    <span className="opacity-70">({course.totalReviews || 0} reseñas)</span>
                  </div>
                )}
                {course.totalEnrollments !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👥</span>
                    <span className="opacity-70">{course.totalEnrollments} estudiantes</span>
                  </div>
                )}
                {totalLessons > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📚</span>
                    <span className="opacity-70">{totalLessons} lecciones</span>
                  </div>
                )}
                {totalDuration > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⏱️</span>
                    <span className="opacity-70">
                      {hours > 0 ? `${hours}h ` : ''}{minutes}min
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Purchase Card */}
            <div className="lg:col-span-1">
              <div className="card bg-base-100 shadow-xl sticky top-4">
                {course.thumbnail && (
                  <figure>
                    <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                  </figure>
                )}
                <div className="card-body">
                  <div className="text-4xl font-bold text-primary mb-4">
                    ${Number(course.price).toFixed(2)}
                  </div>

                  <button
                    onClick={handleEnroll}
                    className={`btn btn-primary btn-lg w-full ${enrolling ? 'loading' : ''}`}
                    disabled={enrolling}
                  >
                    {enrolling ? 'Inscribiendo...' : 'Inscribirse Ahora'}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-sm text-center text-base-content/60 mt-2">
                      Necesitas <Link to="/login" className="link">iniciar sesión</Link> para inscribirte
                    </p>
                  )}

                  <div className="divider">Este curso incluye</div>

                  <ul className="space-y-2 text-sm">
                    {totalLessons > 0 && (
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        <span>{totalLessons} lecciones</span>
                      </li>
                    )}
                    {totalDuration > 0 && (
                      <li className="flex items-center gap-2">
                        <span>✓</span>
                        <span>{hours > 0 ? `${hours}h ` : ''}{minutes}min de contenido</span>
                      </li>
                    )}
                    <li className="flex items-center gap-2">
                      <span>✓</span>
                      <span>Acceso de por vida</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span>✓</span>
                      <span>Certificado de finalización</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">Lo que aprenderás</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.whatYouWillLearn.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-success mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Course Content */}
            {sections.length > 0 && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">Contenido del curso</h2>
                  <p className="text-sm text-base-content/70 mb-4">
                    {sections.length} secciones • {totalLessons} lecciones • {hours > 0 ? `${hours}h ` : ''}{minutes}min de duración total
                  </p>

                  <div className="space-y-2">
                    {sections.map((section, index) => (
                      <div key={section.id} className="collapse collapse-arrow bg-base-200">
                        <input type="checkbox" defaultChecked={index === 0} />
                        <div className="collapse-title font-medium">
                          <div className="flex justify-between items-center">
                            <span>{section.title}</span>
                            <span className="text-sm text-base-content/60">
                              {section.lessons.length} lecciones
                            </span>
                          </div>
                        </div>
                        <div className="collapse-content">
                          <ul className="space-y-2 mt-2">
                            {section.lessons.map((lesson) => (
                              <li key={lesson.id} className="flex items-center justify-between py-2 border-b border-base-300 last:border-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-base-content/60">
                                    {lesson.contentType === 'VIDEO' ? '▶' : '📄'}
                                  </span>
                                  <span>{lesson.title}</span>
                                  {lesson.isFree && (
                                    <span className="badge badge-success badge-sm">Gratis</span>
                                  )}
                                </div>
                                {lesson.duration && (
                                  <span className="text-sm text-base-content/60">
                                    {Math.floor(lesson.duration / 60)}min
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Instructor Info */}
            {course.instructor && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">Tu instructor</h2>
                  <div className="flex items-start gap-4">
                    <div className="avatar">
                      <div className="w-20 rounded-full bg-primary text-primary-content flex items-center justify-center">
                        <span className="text-2xl font-bold">
                          {course.instructor.user?.profileData.name?.charAt(0) || 'I'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {course.instructor.user?.profileData.name || 'Instructor'}
                      </h3>
                      {course.instructor.bio && (
                        <p className="text-base-content/70 mb-3">{course.instructor.bio}</p>
                      )}
                      {course.instructor.expertise && course.instructor.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {course.instructor.expertise.map((skill, index) => (
                            <span key={index} className="badge badge-outline">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Sidebar (empty for now, can add related courses, etc.) */}
          <div className="lg:col-span-1">
            {/* Could add related courses, reviews, etc. here */}
          </div>
        </div>
      </div>
    </div>
  );
}
