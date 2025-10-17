import { Spinner } from "@/components/ui/spinner";
import { checkAuth } from "@/store/auth/authSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

const Protected = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [authChecked, setAuthChecked] = useState(false); // Track if auth check completed
  const location = useLocation();
  const dispatch = useDispatch();

 // console.log("before check", user?.email);

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      try {
        const result = await dispatch(checkAuth());
        // Auth check completed, regardless of success/failure
        setAuthChecked(true);
        
        if (result?.payload?.success) {
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setAuthChecked(true);
        setIsLoading(false);
      }
    };

    // Only run auth check if we haven't done it yet
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

 // console.log("after ", user?.email);
  
  // Only redirect after auth check is complete and no user exists
  if (authChecked && user?.email) {
    return children;
  }

 // console.log("last", user?.email);
  
  // Only redirect if auth check completed and no user
  if (authChecked && !user?.email) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Fallback - should not reach here in normal flow
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="size-10 text-sky-500" />
    </div>
  );
};

export default Protected;