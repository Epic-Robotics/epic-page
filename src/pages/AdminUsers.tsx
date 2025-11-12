import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../api/services';
import type { User, ApiError, UpdateInstructorProfileRequest } from '../types/api';
import { Navigate } from 'react-router-dom';
import { getRoleBadgeColor, getRoleText, getRoleIcon } from '../utils/roleUtils';

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showMakeInstructorModal, setShowMakeInstructorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Instructor form data
  const [instructorData, setInstructorData] = useState<UpdateInstructorProfileRequest>({
    bio: '',
    expertise: [],
    socialLinks: {},
  });

  useEffect(() => {
    loadUsers();
  }, []);

  // Redirect if not admin
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setError('');
      setLoading(true);
      await authService.makeInstructor(selectedUser.id, instructorData);
      setSuccess(`${selectedUser.profileData.name} ahora es instructor`);
      setShowMakeInstructorModal(false);
      setSelectedUser(null);
      setInstructorData({ bio: '', expertise: [], socialLinks: {} });
      await loadUsers();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al convertir en instructor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setError('');
      setLoading(true);
      await authService.deleteUser(selectedUser.id);
      setSuccess(`Usuario ${selectedUser.email} eliminado exitosamente`);
      setShowDeleteModal(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al eliminar usuario');
    } finally {
      setLoading(false);
    }
  };

  const openMakeInstructorModal = (targetUser: User) => {
    setSelectedUser(targetUser);
    setShowMakeInstructorModal(true);
    setError('');
    setSuccess('');
  };

  const openDeleteModal = (targetUser: User) => {
    setSelectedUser(targetUser);
    setShowDeleteModal(true);
    setError('');
    setSuccess('');
  };

  if (loading && users.length === 0) {
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
          <h1 className="text-3xl md:text-4xl font-bold">Gestión de Usuarios</h1>
          <p className="text-base-content/70">Administra todos los usuarios del sistema</p>
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

        {/* Users Stats */}
        <div className="stats stats-vertical sm:stats-horizontal shadow mb-6 w-full">
          <div className="stat">
            <div className="stat-title">Total Usuarios</div>
            <div className="stat-value text-primary">{users.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Estudiantes</div>
            <div className="stat-value text-secondary">
              {users.filter(u => u.role === 'STUDENT').length}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Instructores</div>
            <div className="stat-value text-accent">
              {users.filter(u => u.role === 'INSTRUCTOR').length}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Administradores</div>
            <div className="stat-value">{users.filter(u => u.role === 'ADMIN').length}</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Fecha de Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((targetUser) => (
                    <tr key={targetUser.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-12">
                              {targetUser.profileData.avatar ? (
                                <img src={targetUser.profileData.avatar} alt={targetUser.profileData.name} />
                              ) : (
                                <span className="text-lg">
                                  {targetUser.profileData.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{targetUser.profileData.name}</div>
                            {targetUser.id === user.id && (
                              <span className="badge badge-sm badge-info">Tú</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="break-all">{targetUser.email}</td>
                      <td>
                        <span className={`badge ${getRoleBadgeColor(targetUser.role)}`}>
                          {getRoleIcon(targetUser.role)} {getRoleText(targetUser.role)}
                        </span>
                      </td>
                      <td>
                        {new Date(targetUser.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {targetUser.role === 'STUDENT' && (
                            <button
                              onClick={() => openMakeInstructorModal(targetUser)}
                              className="btn btn-sm btn-primary"
                              disabled={loading}
                            >
                              Hacer Instructor
                            </button>
                          )}
                          {targetUser.id !== user.id && (
                            <button
                              onClick={() => openDeleteModal(targetUser)}
                              className="btn btn-sm btn-error"
                              disabled={loading}
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Make Instructor Modal */}
        {showMakeInstructorModal && selectedUser && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                Hacer Instructor a {selectedUser.profileData.name}
              </h3>
              <form onSubmit={handleMakeInstructor} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Biografía</span>
                  </label>
                  <textarea
                    value={instructorData.bio}
                    onChange={(e) => setInstructorData({ ...instructorData, bio: e.target.value })}
                    className="textarea textarea-bordered h-24"
                    placeholder="Describe la experiencia del instructor..."
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Áreas de Experiencia (separadas por coma)</span>
                  </label>
                  <input
                    type="text"
                    value={instructorData.expertise?.join(', ') || ''}
                    onChange={(e) =>
                      setInstructorData({
                        ...instructorData,
                        expertise: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="input input-bordered"
                    placeholder="Programación, Robótica, Arduino..."
                    required
                  />
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMakeInstructorModal(false);
                      setSelectedUser(null);
                      setInstructorData({ bio: '', expertise: [], socialLinks: {} });
                    }}
                    className="btn btn-ghost"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    Convertir en Instructor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete User Modal */}
        {showDeleteModal && selectedUser && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg text-error mb-4">
                ¿Eliminar usuario?
              </h3>
              <div className="alert alert-warning mb-4">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-sm">Esta acción no se puede deshacer.</span>
              </div>
              <p className="mb-4">
                ¿Estás seguro de que quieres eliminar al usuario{' '}
                <strong>{selectedUser.profileData.name}</strong> ({selectedUser.email})?
              </p>
              <p className="text-sm text-base-content/70 mb-4">
                Se eliminarán todos sus datos, cursos inscritos y progreso.
              </p>
              <div className="modal-action">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="btn btn-ghost"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteUser}
                  className={`btn btn-error ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  Sí, eliminar usuario
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
