import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../api/services';
import type { AccessLinkInfo, ApiError } from '../types/api';

export default function RedeemAccessLink() {
  const { token } = useParams<{ token: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [linkInfo, setLinkInfo] = useState<AccessLinkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (token) {
      loadLinkInfo();
    }
  }, [token]);

  const loadLinkInfo = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading link info for token:', token);
      const info = await courseService.getAccessLinkInfo(token!);
      console.log('Link info received:', info);
      setLinkInfo(info);
    } catch (err) {
      const apiError = err as ApiError;
      console.error('Error loading link info:', apiError);
      setError(apiError.error || 'Este link de acceso no es válido o ha expirado');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate(`/login?redirect=/redeem/${token}`);
      return;
    }

    try {
      setRedeeming(true);
      setError('');
      await courseService.redeemAccessLink(token!);
      setSuccess('¡Te has inscrito exitosamente al curso!');

      // Redirect to course after 2 seconds
      setTimeout(() => {
        navigate(`/cursos/${linkInfo?.course.id}`);
      }, 2000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Error al canjear el link de acceso');
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-base-content/70">Verificando link de acceso...</p>
        </div>
      </div>
    );
  }

  if (error && !linkInfo) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl max-w-md w-full">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="card-title text-2xl justify-center mb-2">Link Inválido</h2>
            <p className="text-base-content/70 mb-6">{error}</p>
            <Link to="/cursos" className="btn btn-primary">
              Ver Todos los Cursos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!linkInfo) {
    return null;
  }

  if (!linkInfo.isValid) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl max-w-md w-full">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="card-title text-2xl justify-center mb-2">Link Expirado</h2>
            <p className="text-base-content/70 mb-6">
              Este link de acceso ha expirado o ya alcanzó su límite de usos.
            </p>
            <Link to="/cursos" className="btn btn-primary">
              Ver Todos los Cursos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Alert */}
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

        {/* Error Alert */}
        {error && linkInfo && (
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

        {/* Course Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🎓</div>
              <h1 className="text-3xl font-bold mb-2">¡Has sido invitado a un curso!</h1>
              <p className="text-base-content/70">
                {isAuthenticated
                  ? 'Puedes inscribirte gratis usando este link especial'
                  : 'Inicia sesión para inscribirte gratis usando este link especial'}
              </p>
            </div>

            <div className="divider"></div>

            {/* Course Info */}
            <div className="space-y-4">
              {linkInfo.course.thumbnail && (
                <div className="w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={linkInfo.course.thumbnail}
                    alt={linkInfo.course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold mb-2">{linkInfo.course.title}</h2>
                <p className="text-base-content/70 mb-4">{linkInfo.course.description}</p>

                <div className="flex items-center gap-2 text-sm text-base-content/60">
                  <span>👨‍🏫</span>
                  <span>Instructor: {linkInfo.course.instructor.name}</span>
                </div>
              </div>

              {/* Link Stats */}
              <div className="stats stats-vertical sm:stats-horizontal shadow w-full">
                <div className="stat">
                  <div className="stat-title">Usos</div>
                  <div className="stat-value text-primary text-2xl">
                    {linkInfo.usedCount} / {linkInfo.maxUses || '∞'}
                  </div>
                  <div className="stat-desc">
                    {linkInfo.maxUses
                      ? `${linkInfo.maxUses - linkInfo.usedCount} disponibles`
                      : 'Usos ilimitados'}
                  </div>
                </div>

                {linkInfo.expiresAt && (
                  <div className="stat">
                    <div className="stat-title">Expira</div>
                    <div className="stat-value text-secondary text-2xl">
                      {new Date(linkInfo.expiresAt) > new Date() ? '✓' : '✗'}
                    </div>
                    <div className="stat-desc">
                      {new Date(linkInfo.expiresAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="divider"></div>

            {/* Action Buttons */}
            <div className="card-actions justify-center">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={handleRedeem}
                    className={`btn btn-primary btn-lg ${redeeming ? 'loading' : ''}`}
                    disabled={redeeming || !!success}
                  >
                    {success ? '✓ Inscrito' : 'Inscribirme Ahora'}
                  </button>
                  <Link to="/cursos" className="btn btn-ghost btn-lg">
                    Ver Otros Cursos
                  </Link>
                </>
              ) : (
                <>
                  <Link to={`/login?redirect=/redeem/${token}`} className="btn btn-primary btn-lg">
                    Iniciar Sesión para Inscribirme
                  </Link>
                  <Link to="/cursos" className="btn btn-ghost btn-lg">
                    Ver Cursos
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info Card */}
        {!isAuthenticated && (
          <div className="alert alert-info mt-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Necesitas tener una cuenta para inscribirte. Si no tienes una, puedes registrarte gratis.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
