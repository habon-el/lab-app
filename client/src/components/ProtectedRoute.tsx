import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuthStore();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <>{children}</>;
}
