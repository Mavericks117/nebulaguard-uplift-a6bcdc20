import { Navigate } from 'react-router-dom';
import { getAuthUser, UserRole } from '@/utils/auth';
import { hasRole } from '@/utils/rbac';
import { useEffect, useState } from 'react';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  redirectTo?: string;
}

const RoleBasedRoute = ({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}: RoleBasedRouteProps) => {
  const [user, setUser] = useState<{ id: string; email: string; role: UserRole; organizationId?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuthUser().then((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (!hasRole(user.role, requiredRole)) {
    // Redirect based on actual role
    if (user.role === 'user') {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === 'org_admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/super-admin" replace />;
    }
  }
  
  return <>{children}</>;
};

export default RoleBasedRoute;
