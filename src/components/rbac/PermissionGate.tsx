import { getAuthUser } from '@/utils/auth';
import { hasPermission } from '@/utils/rbac';
import { useEffect, useState } from 'react';

interface PermissionGateProps {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
}

const PermissionGate = ({ children, permission, fallback = null }: PermissionGateProps) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuthUser().then((user) => {
      if (user && hasPermission(user.role, permission)) {
        setHasAccess(true);
      }
      setLoading(false);
    });
  }, [permission]);

  if (loading) {
    return null;
  }
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default PermissionGate;
