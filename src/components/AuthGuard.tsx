
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthState } from "@/lib/auth";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  requireAdmin = false, 
  redirectTo = "/login" 
}: AuthGuardProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = getAuthState();
  
  useEffect(() => {
    if (loading) return;
    
    // If auth is required but user isn't authenticated, redirect to login
    if (requireAuth && !isAuthenticated) {
      navigate(redirectTo);
      return;
    }
    
    // If admin access is required but user isn't an admin, redirect to dashboard
    if (requireAdmin && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/dashboard");
      return;
    }
    
    // If user is already authenticated and tries to access login/register, redirect to dashboard
    if (!requireAuth && isAuthenticated) {
      navigate("/dashboard");
      return;
    }
  }, [isAuthenticated, loading, navigate, redirectTo, requireAuth, requireAdmin, user?.role]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }
  
  // If auth is required and user is not authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return null;
  }
  
  // If admin access is required and user is not admin, don't render children
  if (requireAdmin && (!isAuthenticated || user?.role !== "admin")) {
    return null;
  }
  
  return <>{children}</>;
}

export default AuthGuard;
