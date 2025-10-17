import { Outlet } from "react-router";
import Navbar from "../Header/Navbar";
import Footer from "../Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkAuth } from "@/store/auth/authSlice";
import { Spinner } from "@/components/ui/spinner";

const Root = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setIsLoading(true);
    dispatch(checkAuth()).then((res) => {
      if (res?.payload.success) {
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  }, [dispatch]);
  return (
    <div>
      <Navbar />
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Spinner className="size-10 text-sky-500" />
        </div>
      ) : (
        <Outlet />
      )}
      <Footer />
    </div>
  );
};
export default Root;
