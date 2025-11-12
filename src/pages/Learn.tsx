import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { learningService } from '../api/services';
import type { CourseWithProgress, ApiError, CompletionStatus } from '../types/api';

export default function Learn() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<CourseWithProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (courseId) {
      loadCourse();
    }
  }, [courseId, isAuthenticated]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading course:', courseId);
      const data = await learningService.getCourseWithProgress(courseId!);
      console.log('Course data received:', data);
      setCourse(data);

      // Auto-select first lesson if none selected
      if (data.course.sections.length > 0 && data.course.sections[0].lessons.length > 0) {
        setSelectedLesson(data.course.sections[0].lessons[0]);
      } else {
        console.warn('No sections or lessons found in course');
      }
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Error loading course:', err);
      setError(apiError.error || 'Error al cargar el curso. Asegúrate de estar inscrito.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (lessonId: string) => {
    try {
      setUpdatingProgress(true);
      await learningService.updateProgress({
        lessonId,
        completionStatus: 'COMPLETED',
        timeSpent: 0,
      });

      // Reload course to get updated progress
      await loadCourse();
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.error || 'Error al actualizar progreso');
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleMarkInProgress = async (lessonId: string) => {
    try {
      setUpdatingProgress(true);
      await learningService.updateProgress({
        lessonId,
        completionStatus: 'IN_PROGRESS',
        timeSpent: 0,
      });

      // Reload course to get updated progress
      await loadCourse();
    } catch (err) {
      const apiError = err as ApiError;
      alert(apiError.error || 'Error al actualizar progreso');
    } finally {
      setUpdatingProgress(false);
    }
  };

  const getStatusBadge = (status: CompletionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge-success badge-sm">✓ Completado</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-info badge-sm">⏳ En Progreso</span>;
      case 'NOT_STARTED':
        return <span className="badge badge-ghost badge-sm">⭕ No Iniciado</span>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: CompletionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return '✅';
      case 'IN_PROGRESS':
        return '⏳';
      case 'NOT_STARTED':
        return '⭕';
      default:
        return '⭕';
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
      <div className="min-h-screen bg-base-200 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="alert alert-error">
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
            <span>{error || 'Error al cargar el curso'}</span>
          </div>
          <div className="mt-4">
            <Link to="/my-courses" className="btn btn-primary">
              ← Volver a Mis Cursos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top Header */}
      <div className="bg-base-100 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/my-courses" className="btn btn-ghost btn-sm">
                ← Mis Cursos
              </Link>
              <div>
                <h1 className="text-xl font-bold">{course.course.title}</h1>
                <p className="text-sm text-base-content/70">
                  {course.course.instructor.user.profileData.name || 'Instructor'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-base-content/70">Progreso</div>
                <div className="text-lg font-bold">{course.progress}%</div>
              </div>
              <progress
                className="progress progress-primary w-32"
                value={course.progress}
                max="100"
              ></progress>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Course Content */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-4">
                <h2 className="card-title text-lg mb-4">Contenido del Curso</h2>

                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {course.course.sections.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📝</div>
                      <p className="text-base-content/70">Este curso aún no tiene contenido</p>
                      <p className="text-sm text-base-content/50 mt-2">
                        El instructor está preparando el material
                      </p>
                    </div>
                  ) : (
                    course.course.sections.map((section, sectionIdx) => (
                    <div key={section.id} className="collapse collapse-arrow bg-base-200">
                      <input type="checkbox" defaultChecked={sectionIdx === 0} />
                      <div className="collapse-title font-medium">
                        {section.title}
                        <div className="text-xs text-base-content/60 mt-1">
                          {section.lessons.filter((l: any) => l.progress?.completionStatus === 'COMPLETED').length}/{section.lessons.length} lecciones
                        </div>
                      </div>
                      <div className="collapse-content">
                        <ul className="menu menu-sm p-0">
                          {section.lessons.map((lesson: any) => (
                            <li key={lesson.id}>
                              <a
                                onClick={() => setSelectedLesson(lesson)}
                                className={`flex items-center justify-between ${
                                  selectedLesson?.id === lesson.id ? 'active' : ''
                                }`}
                              >
                                <span className="flex items-center gap-2 flex-1">
                                  <span>{getStatusIcon(lesson.progress?.completionStatus || 'NOT_STARTED')}</span>
                                  <span className="truncate">{lesson.title}</span>
                                </span>
                                {lesson.duration && (
                                  <span className="text-xs opacity-60">{lesson.duration}min</span>
                                )}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Lesson Viewer */}
          <div className="lg:col-span-2">
            {selectedLesson ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  {/* Lesson Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="card-title text-2xl mb-2">{selectedLesson.title}</h2>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(selectedLesson.progress?.completionStatus || 'NOT_STARTED')}
                        <span className="badge badge-outline">{selectedLesson.contentType}</span>
                        {selectedLesson.duration && (
                          <span className="badge badge-outline">{selectedLesson.duration} min</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Lesson Content */}
                  <div className="divider"></div>

                  {selectedLesson.contentType === 'VIDEO' && selectedLesson.videoUrl && (
                    <div className="mb-6">
                      <div className="aspect-video bg-base-300 rounded-lg flex items-center justify-center">
                        <video
                          src={selectedLesson.videoUrl}
                          controls
                          className="w-full h-full rounded-lg"
                          onPlay={() => {
                            if (selectedLesson.progress?.completionStatus === 'NOT_STARTED') {
                              handleMarkInProgress(selectedLesson.id);
                            }
                          }}
                        >
                          Tu navegador no soporta video
                        </video>
                      </div>
                    </div>
                  )}

                  {selectedLesson.contentType === 'TEXT' && selectedLesson.content && (
                    <div className="prose max-w-none mb-6">
                      <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                    </div>
                  )}

                  {selectedLesson.contentType === 'QUIZ' && (
                    <div className="mb-6">
                      <div className="alert alert-info">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span>Este es un cuestionario. Complétalo para continuar.</span>
                      </div>
                      {/* Quiz component would go here */}
                    </div>
                  )}

                  {/* Progress Actions */}
                  <div className="divider"></div>
                  <div className="flex gap-2 justify-end">
                    {selectedLesson.progress?.completionStatus !== 'COMPLETED' && (
                      <>
                        {selectedLesson.progress?.completionStatus === 'NOT_STARTED' && (
                          <button
                            onClick={() => handleMarkInProgress(selectedLesson.id)}
                            className="btn btn-secondary"
                            disabled={updatingProgress}
                          >
                            {updatingProgress ? (
                              <span className="loading loading-spinner"></span>
                            ) : (
                              'Marcar En Progreso'
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleMarkComplete(selectedLesson.id)}
                          className="btn btn-success"
                          disabled={updatingProgress}
                        >
                          {updatingProgress ? (
                            <span className="loading loading-spinner"></span>
                          ) : (
                            '✓ Marcar como Completado'
                          )}
                        </button>
                      </>
                    )}
                    {selectedLesson.progress?.completionStatus === 'COMPLETED' && (
                      <div className="alert alert-success">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Lección completada</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h2 className="text-2xl font-bold mb-2">Selecciona una lección</h2>
                  <p className="text-base-content/70">
                    Elige una lección del menú lateral para comenzar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
