import { Spinner } from "@/components/ui/spinner";
import { checkAuth } from "@/store/auth/authSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

const Protected = ({ 
  children, 
  requiredRole = null, 
  preventAuthenticated = false 
}) => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      try {
        await dispatch(checkAuth());
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setAuthChecked(true);
        setIsLoading(false);
      }
    };

    if (!authChecked) {
      checkAuthentication();
    }
  }, [dispatch, authChecked]);

  // Show spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-10 text-sky-500" />
      </div>
    );
  }

  // If auth check is complete
  if (authChecked) {
    // Prevent authenticated users from accessing auth pages (login/register)
    if (preventAuthenticated) {
      if (user?.email) {
        // Redirect authenticated users based on their role
        switch (user.role) {
          case 'admin':
            return <Navigate to="/admin" replace />;
          case 'student':
          case 'owner':
          default:
            return <Navigate to="/" replace />;
        }
      } else {
        // User is not authenticated, allow access to auth pages
        return children;
      }
    }

    // If no user exists and this is a protected page, redirect to login
    if (!user?.email) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Role-based access control for authenticated users
    if (requiredRole && user.role !== requiredRole) {
      // Redirect users without required role based on their actual role
      switch (user.role) {
        case 'admin':
          return <Navigate to="/admin" replace />;
        case 'student':
        case 'owner':
        default:
          return <Navigate to="/" replace />;
      }
    }

    // If all checks pass, render children
    return children;
  }

  // Fallback - should not reach here in normal flow
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="size-10 text-sky-500" />
    </div>
  );
};

export default Protected;