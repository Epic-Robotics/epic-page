import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRoleBadgeColor, getRoleText, getRoleIcon } from '../utils/roleUtils';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-lg px-4 lg:px-8">
      {/* logo */}
      <div className="flex-1">
        <Link
          to="/"
          className="btn btn-ghost text-xl font-bold flex-1 items-center gap-3"
        >
          <img
            src="/epic-page/epic-white.svg"
            alt="Epic Robotics Logo"
            className="h-17 w-17"
          />
          <span>Epic Robotics</span>
        </Link>
      </div>
      {/* Desktop Menu */}
      <div className="flex-none hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/about">Sobre Nosotros</Link>
          </li>
          <li>
            <Link to="/cursos">Cursos</Link>
          </li>
          <li>
            <Link to="/services">Servicios</Link>
          </li>
          <li>
            <Link to="/contact">Contacto</Link>
          </li>
        </ul>

        {/* Auth Section */}
        {isAuthenticated && user ? (
          <div className="dropdown dropdown-end ml-4">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <span className="text-lg font-bold">
                  {user.profileData.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="menu-title">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span>{user.profileData.name}</span>
                    <span className={`badge ${getRoleBadgeColor(user.role)} badge-sm`}>
                      {getRoleIcon(user.role)} {getRoleText(user.role)}
                    </span>
                  </div>
                  <span className="text-xs text-base-content/60">
                    {user.email}
                  </span>
                </div>
              </li>
              <li>
                <Link to="/profile">
                  <span>👤</span> Mi Perfil
                </Link>
              </li>
              <li>
                <Link to="/my-courses">
                  <span>📚</span> Mis Cursos
                </Link>
              </li>
              {user.role === 'INSTRUCTOR' && (
                <li>
                  <Link to="/instructor/courses">
                    <span>🎓</span> Gestionar Cursos
                  </Link>
                </li>
              )}
              {user.role === 'ADMIN' && (
                <li>
                  <Link to="/admin/productos">
                    <span>👑</span> Gestionar Productos
                  </Link>
                </li>
              )}
              <div className="divider my-1"></div>
              <li>
                <button onClick={handleLogout} className="text-error">
                  <span>🚪</span> Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary ml-4">
            Login
          </Link>
        )}
      </div>
      {/* Mobile menu */}
      <div className="flex-none lg:hidden">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/about">Sobre Nosotros</Link>
            </li>
            <li>
              <Link to="/cursos">Cursos</Link>
            </li>
            <li>
              <Link to="/services">Servicios</Link>
            </li>
            <li>
              <Link to="/contact">Contacto</Link>
            </li>

            {/* Mobile Auth Section */}
            {isAuthenticated && user ? (
              <>
                <div className="divider my-1"></div>
                <li className="menu-title mt-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span>{user.profileData.name}</span>
                      <span className={`badge ${getRoleBadgeColor(user.role)} badge-xs`}>
                        {getRoleIcon(user.role)} {getRoleText(user.role)}
                      </span>
                    </div>
                  </div>
                </li>
                <li>
                  <Link to="/profile">
                    <span>👤</span> Mi Perfil
                  </Link>
                </li>
                <li>
                  <Link to="/my-courses">
                    <span>📚</span> Mis Cursos
                  </Link>
                </li>
                {user.role === 'INSTRUCTOR' && (
                  <li>
                    <Link to="/instructor/courses">
                      <span>🎓</span> Gestionar Cursos
                    </Link>
                  </li>
                )}
                {user.role === 'ADMIN' && (
                  <li>
                    <Link to="/admin/productos">
                      <span>👑</span> Gestionar Productos
                    </Link>
                  </li>
                )}
                <li>
                  <button onClick={handleLogout} className="text-error">
                    <span>🚪</span> Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="btn btn-primary btn-sm mt-2 w-full"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
