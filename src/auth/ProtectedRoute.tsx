import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useKeycloakAuth } from './useKeycloakAuth';
import { UserRole } from '@/utils/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

/**
 * Protected route component that:
 * - Redirects to Keycloak login if not authenticated
 * - Checks role-based access
 * - Handles loading states
 */
const ProtectedRoute = ({ children, requiredRole = 'user' }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, login, hasRole } = useKeycloakAuth();
  const location = useLocation();

  useEffect(() => {
    // If not authenticated and not loading, redirect to Keycloak login
    if (!isLoading && !isAuthenticated) {
      console.log('[ProtectedRoute] Not authenticated - redirecting to Keycloak login');
      login();
    }
  }, [isLoading, isAuthenticated, login]);

  // Show loading state while Keycloak initializes
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show loading while redirecting to Keycloak
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (user && !hasRole(requiredRole)) {
    console.log(`[ProtectedRoute] User role ${user.role} does not meet required role ${requiredRole}`);
    
    // Redirect based on actual role
    if (user.role === 'super_admin') {
      return <Navigate to="/super-admin" replace state={{ from: location }} />;
    } else if (user.role === 'org_admin') {
      return <Navigate to="/admin" replace state={{ from: location }} />;
    } else {
      return <Navigate to="/dashboard" replace state={{ from: location }} />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
