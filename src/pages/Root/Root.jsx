import { Outlet } from "react-router";
import Navbar from "../Header/Navbar";
import Footer from "../Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkAuth } from "@/store/auth/authSlice";
import { Spinner } from "@/components/ui/spinner";
import { Bounce, ToastContainer } from "react-toastify";
import PageLayout from "../PageLayout/PageLayout";
import { useRouteMetadata } from "@/hook/useRouteMetadata";


const Root = () => {
  const [isLoading, setIsLoading] = useState(false);
  console.log(import.meta.env.VITE_BACKEND_URL); 
  useRouteMetadata();
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
  }, []);
  return (
    <PageLayout>
      <Navbar />
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Spinner className="size-10 text-sky-500" />
        </div>
      ) : (
        <Outlet />
      )}
      <Footer />
      <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
    </PageLayout>
  );
};
export default Root;
