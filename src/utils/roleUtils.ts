import type { UserRole } from '../types/api';

export const getRoleBadgeColor = (role: UserRole): string => {
  switch (role) {
    case 'ADMIN':
      return 'badge-error'; // Red
    case 'INSTRUCTOR':
      return 'badge-warning'; // Yellow/Orange
    case 'STUDENT':
      return 'badge-info'; // Blue
    default:
      return 'badge-ghost';
  }
};

export const getRoleText = (role: UserRole): string => {
  switch (role) {
    case 'ADMIN':
      return 'Administrador';
    case 'INSTRUCTOR':
      return 'Instructor';
    case 'STUDENT':
      return 'Estudiante';
    default:
      return role;
  }
};

export const getRoleIcon = (role: UserRole): string => {
  switch (role) {
    case 'ADMIN':
      return '👑'; // Crown
    case 'INSTRUCTOR':
      return '🎓'; // Graduation cap
    case 'STUDENT':
      return '📚'; // Books
    default:
      return '👤';
  }
};

export const getRoleDescription = (role: UserRole): string => {
  switch (role) {
    case 'ADMIN':
      return 'Acceso completo a todas las funciones del sistema';
    case 'INSTRUCTOR':
      return 'Puede crear y gestionar cursos';
    case 'STUDENT':
      return 'Puede inscribirse y tomar cursos';
    default:
      return '';
  }
};
