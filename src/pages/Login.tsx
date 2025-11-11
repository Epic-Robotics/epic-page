import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import type { ApiError } from '../types/api';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
      }
      navigate('/');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ email: '', password: '', name: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-12">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="text-base-content/70 mt-2">
              {isLogin
                ? 'Bienvenido de vuelta'
                : 'Únete a nuestra plataforma educativa'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error mb-4">
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field - only for registration */}
            {!isLogin && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Nombre Completo</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  className="input input-bordered w-full"
                  required={!isLogin}
                />
              </div>
            )}

            {/* Email field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Correo Electrónico</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Password field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Contraseña</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-bordered w-full"
                required
                minLength={6}
              />
              {isLogin && (
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">
                    ¿Olvidaste tu contraseña?
                  </a>
                </label>
              )}
            </div>

            {/* Submit button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading
                  ? 'Cargando...'
                  : isLogin
                    ? 'Iniciar Sesión'
                    : 'Crear Cuenta'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="divider">O</div>

          {/* Toggle between login/register */}
          <div className="text-center">
            <p className="text-sm">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                type="button"
                onClick={toggleMode}
                className="link link-primary ml-1"
              >
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
              </button>
            </p>
          </div>

          {/* Back to home */}
          <div className="text-center mt-4">
            <Link to="/" className="btn btn-ghost btn-sm">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
