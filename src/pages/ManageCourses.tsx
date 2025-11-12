import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../api/services';
import type { Course, ApiError, AccessLink, CourseLevel } from '../types/api';
import { Navigate } from 'react-router-dom';

export default function ManageCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [managingAccessLinks, setManagingAccessLinks] = useState<Course | null>(null);
  const [accessLinks, setAccessLinks] = useState<AccessLink[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    level: 'BEGINNER' as CourseLevel,
    thumbnail: '',
    language: 'Español',
    whatYouWillLearn: [] as string[],
    previewVideoUrl: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
  });

  const [whatYouWillLearnInput, setWhatYouWillLearnInput] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  // Redirect if not instructor or admin
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
    return <Navigate to="/" replace />;
  }

  const loadCourses = async () => {
    try {
      setLoading(true);
      const filters = user.role === 'INSTRUCTOR' ? { instructorId: user.instructor?.id } : {};
      const data = await courseService.getCourses(filters);
      setCourses(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al cargar cursos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await courseService.createCourse({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        level: formData.level,
        thumbnail: formData.thumbnail || undefined,
        language: formData.language,
        whatYouWillLearn: formData.whatYouWillLearn.length > 0 ? formData.whatYouWillLearn : undefined,
        previewVideoUrl: formData.previewVideoUrl || undefined,
      });
      setSuccess('Curso creado exitosamente');
      setShowCreateForm(false);
      resetForm();
      await loadCourses();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al crear curso');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent, courseId: string) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await courseService.updateCourse(courseId, {
        ...formData,
        thumbnail: formData.thumbnail || undefined,
        whatYouWillLearn: formData.whatYouWillLearn.length > 0 ? formData.whatYouWillLearn : undefined,
        previewVideoUrl: formData.previewVideoUrl || undefined,
      });
      setSuccess('Curso actualizado exitosamente');
      setEditingCourseId(null);
      resetForm();
      await loadCourses();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al actualizar curso');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('¿Estás seguro de eliminar este curso?')) return;

    try {
      setError('');
      setLoading(true);
      await courseService.deleteCourse(courseId);
      setSuccess('Curso eliminado exitosamente');
      await loadCourses();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al eliminar curso');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAccessLink = async () => {
    if (!managingAccessLinks) return;

    try {
      setError('');
      setLoading(true);
      await courseService.generateAccessLink(managingAccessLinks.id);
      setSuccess('Link de acceso generado exitosamente');
      await loadAccessLinks(managingAccessLinks.id);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al generar link de acceso');
    } finally {
      setLoading(false);
    }
  };

  const loadAccessLinks = async (courseId: string) => {
    try {
      const links = await courseService.getCourseAccessLinks(courseId);
      setAccessLinks(links);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al cargar links de acceso');
    }
  };

  const startEdit = (course: Course) => {
    setEditingCourseId(course.id);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      category: course.category,
      level: course.level,
      thumbnail: course.thumbnail || '',
      language: course.language,
      whatYouWillLearn: course.whatYouWillLearn || [],
      previewVideoUrl: course.previewVideoUrl || '',
      status: course.status,
    });
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingCourseId(null);
    resetForm();
  };

  const openAccessLinksModal = async (course: Course) => {
    setManagingAccessLinks(course);
    await loadAccessLinks(course.id);
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      category: '',
      level: 'BEGINNER',
      thumbnail: '',
      language: 'Español',
      whatYouWillLearn: [],
      previewVideoUrl: '',
      status: 'DRAFT',
    });
    setWhatYouWillLearnInput('');
  };

  const addWhatYouWillLearn = () => {
    if (whatYouWillLearnInput.trim()) {
      setFormData({
        ...formData,
        whatYouWillLearn: [...formData.whatYouWillLearn, whatYouWillLearnInput.trim()],
      });
      setWhatYouWillLearnInput('');
    }
  };

  const removeWhatYouWillLearn = (index: number) => {
    setFormData({
      ...formData,
      whatYouWillLearn: formData.whatYouWillLearn.filter((_, i) => i !== index),
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Link copiado al portapapeles');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleRevokeAccessLink = async (linkId: string) => {
    if (!confirm('¿Estás seguro de revocar este link de acceso?')) return;

    try {
      setError('');
      setLoading(true);
      await courseService.revokeAccessLink(linkId);
      setSuccess('Link de acceso revocado exitosamente');
      if (managingAccessLinks) {
        await loadAccessLinks(managingAccessLinks.id);
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al revocar link de acceso');
    } finally {
      setLoading(false);
    }
  };

  const renderCourseForm = (isCreate: boolean, courseId?: string) => (
    <form onSubmit={(e) => isCreate ? handleCreateCourse(e) : handleUpdateCourse(e, courseId!)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Título*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Categoría*</span>
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input input-bordered"
            placeholder="Programación, Robótica, etc."
            required
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Descripción*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="textarea textarea-bordered h-24"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Precio*</span>
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="input input-bordered"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Nivel*</span>
          </label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value as CourseLevel })}
            className="select select-bordered"
            required
          >
            <option value="BEGINNER">Principiante</option>
            <option value="INTERMEDIATE">Intermedio</option>
            <option value="ADVANCED">Avanzado</option>
            <option value="ALL_LEVELS">Todos los Niveles</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Idioma*</span>
          </label>
          <input
            type="text"
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="input input-bordered"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">URL de Miniatura</span>
          </label>
          <input
            type="url"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            className="input input-bordered"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">URL de Video Preview</span>
          </label>
          <input
            type="url"
            value={formData.previewVideoUrl}
            onChange={(e) => setFormData({ ...formData, previewVideoUrl: e.target.value })}
            className="input input-bordered"
            placeholder="https://ejemplo.com/video.mp4"
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Estado</span>
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          className="select select-bordered"
        >
          <option value="DRAFT">Borrador</option>
          <option value="PUBLISHED">Publicado</option>
          <option value="ARCHIVED">Archivado</option>
        </select>
      </div>

      {/* What You Will Learn */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">¿Qué aprenderás?</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={whatYouWillLearnInput}
            onChange={(e) => setWhatYouWillLearnInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWhatYouWillLearn())}
            className="input input-bordered flex-1"
            placeholder="Agregar un punto de aprendizaje"
          />
          <button
            type="button"
            onClick={addWhatYouWillLearn}
            className="btn btn-secondary"
          >
            Agregar
          </button>
        </div>
        {formData.whatYouWillLearn.length > 0 && (
          <ul className="mt-2 space-y-1">
            {formData.whatYouWillLearn.map((item, index) => (
              <li key={index} className="flex items-center justify-between bg-base-200 p-2 rounded">
                <span>• {item}</span>
                <button
                  type="button"
                  onClick={() => removeWhatYouWillLearn(index)}
                  className="btn btn-xs btn-error"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => isCreate ? (setShowCreateForm(false), resetForm()) : cancelEdit()}
          className="btn btn-ghost"
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {isCreate ? 'Crear' : 'Actualizar'}
        </button>
      </div>
    </form>
  );

  if (loading && courses.length === 0) {
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Gestión de Cursos</h1>
            <p className="text-base-content/70">Administra tus cursos</p>
          </div>
          <button
            onClick={() => {
              setShowCreateForm(true);
              setEditingCourseId(null);
              resetForm();
            }}
            className="btn btn-primary w-full sm:w-auto"
          >
            + Nuevo Curso
          </button>
        </div>

        {/* Success/Error Alerts */}
        {success && (
          <div className="alert alert-success mb-6">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="btn btn-sm btn-ghost">✕</button>
          </div>
        )}

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

        {/* Create Form - Only shown when creating */}
        {showCreateForm && (
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title text-2xl">Crear Nuevo Curso</h2>
              {renderCourseForm(true)}
            </div>
          </div>
        )}

        {/* Courses List */}
        <div className="space-y-4">
          {courses.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-bold mb-2">No hay cursos</h2>
                <p className="text-base-content/70">Crea tu primer curso para comenzar</p>
              </div>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  {/* Show edit form inline if this course is being edited */}
                  {editingCourseId === course.id ? (
                    <>
                      <h2 className="card-title text-2xl mb-4">Editar Curso</h2>
                      {renderCourseForm(false, course.id)}
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Course Thumbnail */}
                        {course.thumbnail && (
                          <div className="w-full md:w-48 h-32 flex-shrink-0">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        )}

                        {/* Course Info */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <h3 className="card-title text-xl">{course.title}</h3>
                            <div className="flex gap-2">
                              {course.status === 'PUBLISHED' ? (
                                <span className="badge badge-success">Publicado</span>
                              ) : course.status === 'ARCHIVED' ? (
                                <span className="badge badge-ghost">Archivado</span>
                              ) : (
                                <span className="badge badge-warning">Borrador</span>
                              )}
                              <span className="badge badge-primary">${course.price}</span>
                            </div>
                          </div>
                          <p className="text-base-content/70 mb-2">{course.description}</p>
                          <div className="flex flex-wrap gap-2 text-sm text-base-content/60 mb-4">
                            <span className="badge badge-ghost">{course.category}</span>
                            <span className="badge badge-ghost">{course.level}</span>
                            <span className="badge badge-ghost">{course.language}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => startEdit(course)}
                              className="btn btn-sm btn-primary"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => openAccessLinksModal(course)}
                              className="btn btn-sm btn-secondary"
                            >
                              Links de Acceso
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="btn btn-sm btn-error"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Access Links Modal */}
        {managingAccessLinks && (
          <div className="modal modal-open">
            <div className="modal-box max-w-3xl">
              <h3 className="font-bold text-2xl mb-4">
                Links de Acceso: {managingAccessLinks.title}
              </h3>

              <div className="mb-6">
                <button
                  onClick={handleGenerateAccessLink}
                  className="btn btn-primary btn-sm"
                  disabled={loading}
                >
                  + Generar Nuevo Link
                </button>
              </div>

              {/* Access Links List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {accessLinks.length > 0 ? (
                  accessLinks.map((link) => (
                    <div key={link.id} className="card bg-base-200 border">
                      <div className="card-body p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-base-content/60">
                              Creado: {new Date(link.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex gap-2">
                              {link.isUsed ? (
                                <span className="badge badge-success badge-sm">Usado</span>
                              ) : link.isExpired ? (
                                <span className="badge badge-error badge-sm">Expirado</span>
                              ) : (
                                <span className="badge badge-info badge-sm">Activo</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={link.url}
                              readOnly
                              className="input input-bordered input-sm flex-1 text-xs"
                            />
                            <button
                              onClick={() => copyToClipboard(link.url)}
                              className="btn btn-sm btn-ghost"
                              title="Copiar link"
                            >
                              📋
                            </button>
                            <button
                              onClick={() => handleRevokeAccessLink(link.id)}
                              className="btn btn-sm btn-error btn-outline"
                              disabled={loading}
                              title="Revocar link"
                            >
                              🗑️
                            </button>
                          </div>
                          {link.isUsed && link.usedBy && (
                            <p className="text-xs text-base-content/60">
                              Usado por: {link.usedBy.name || link.usedBy.email} el {link.usedAt ? new Date(link.usedAt).toLocaleDateString() : 'N/A'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-base-content/60 py-8">
                    No hay links de acceso. Genera el primero.
                  </p>
                )}
              </div>

              <div className="modal-action">
                <button
                  onClick={() => {
                    setManagingAccessLinks(null);
                    setAccessLinks([]);
                  }}
                  className="btn"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
