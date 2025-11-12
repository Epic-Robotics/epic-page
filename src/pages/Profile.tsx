import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../api/services';
import type { ApiError } from '../types/api';
import { getRoleBadgeColor, getRoleText, getRoleIcon, getRoleDescription } from '../utils/roleUtils';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    bio: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.profileData.name || '',
        avatar: user.profileData.avatar || '',
        bio: user.profileData.bio || '',
        phone: user.profileData.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authService.updateProfile(formData);
      await refreshUser();
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await authService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Contraseña actualizada correctamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setChangingPassword(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al actualizar contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-sm md:text-base text-base-content/70">Administra tu información personal</p>
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
          </div>
        )}

        {/* Profile Card */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body p-4 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <h2 className="card-title text-xl md:text-2xl">Información Personal</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary btn-sm w-full sm:w-auto"
                >
                  Editar Perfil
                </button>
              )}
            </div>

            {/* Avatar */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
              <div className="avatar">
                <div className="w-20 sm:w-24 rounded-full bg-primary text-primary-content flex items-center justify-center text-3xl sm:text-4xl font-bold">
                  {user.profileData.avatar ? (
                    <img src={user.profileData.avatar} alt={user.profileData.name} />
                  ) : (
                    <span>{user.profileData.name?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-xl sm:text-2xl font-bold break-words">{user.profileData.name}</h3>
                <p className="text-sm sm:text-base text-base-content/60 break-all">{user.email}</p>
                <div className={`badge ${getRoleBadgeColor(user.role)} mt-2`}>
                  {getRoleIcon(user.role)} {getRoleText(user.role)}
                </div>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nombre Completo</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                {/* Avatar URL */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">URL de Avatar</span>
                  </label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/avatar.jpg"
                    className="input input-bordered"
                  />
                </div>

                {/* Bio */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Biografía</span>
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="textarea textarea-bordered h-24"
                    placeholder="Cuéntanos sobre ti..."
                  />
                </div>

                {/* Phone */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Teléfono</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+591 12345678"
                    className="input input-bordered"
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setError('');
                      setSuccess('');
                    }}
                    className="btn btn-ghost w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary w-full sm:w-auto order-1 sm:order-2 ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Display mode */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Email</span>
                  </label>
                  <p className="text-base sm:text-lg break-all">{user.email}</p>
                </div>

                {user.profileData.bio && (
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Biografía</span>
                    </label>
                    <p className="text-base sm:text-lg break-words">{user.profileData.bio}</p>
                  </div>
                )}

                {user.profileData.phone && (
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">Teléfono</span>
                    </label>
                    <p className="text-base sm:text-lg">{user.profileData.phone}</p>
                  </div>
                )}

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Rol</span>
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className={`badge ${getRoleBadgeColor(user.role)} badge-lg whitespace-nowrap`}>
                      {getRoleIcon(user.role)} {getRoleText(user.role)}
                    </span>
                    <p className="text-xs sm:text-sm text-base-content/70">{getRoleDescription(user.role)}</p>
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Miembro desde</span>
                  </label>
                  <p className="text-base sm:text-lg">
                    {new Date(user.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <h2 className="card-title text-xl md:text-2xl">Cambiar Contraseña</h2>
              {!changingPassword && (
                <button
                  onClick={() => setChangingPassword(true)}
                  className="btn btn-outline btn-sm w-full sm:w-auto"
                >
                  Actualizar Contraseña
                </button>
              )}
            </div>

            {changingPassword ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Current Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Contraseña Actual</span>
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                {/* New Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nueva Contraseña</span>
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input input-bordered"
                    required
                    minLength={6}
                  />
                </div>

                {/* Confirm Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confirmar Nueva Contraseña</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input input-bordered"
                    required
                    minLength={6}
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setChangingPassword(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      setError('');
                      setSuccess('');
                    }}
                    className="btn btn-ghost w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary w-full sm:w-auto order-1 sm:order-2 ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    Actualizar Contraseña
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm sm:text-base text-base-content/70">
                Haz clic en "Actualizar Contraseña" para cambiar tu contraseña
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
