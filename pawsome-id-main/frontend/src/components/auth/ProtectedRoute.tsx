import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or to an unauthorized page
  }

  return <Outlet />;
}

export function AdminRoute() {
  return <ProtectedRoute allowedRoles={['admin']} />;
}

export function VetRoute() {
  return <ProtectedRoute allowedRoles={['vet', 'admin']} />;
}

export function OwnerRoute() {
  return <ProtectedRoute allowedRoles={['owner', 'admin']} />;
}

export function ShelterRoute() {
  return <ProtectedRoute allowedRoles={['shelter', 'admin']} />;
}
