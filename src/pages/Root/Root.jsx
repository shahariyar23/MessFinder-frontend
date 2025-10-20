import { Outlet } from "react-router";
import Navbar from "../Header/Navbar";
import Footer from "../Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { checkAuth } from "@/store/auth/authSlice";
import { Spinner } from "@/components/ui/spinner";
import { Bounce, ToastContainer } from "react-toastify";

const Root = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useSelector(state => state.auth)
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
    </div>
  );
};
export default Root;
