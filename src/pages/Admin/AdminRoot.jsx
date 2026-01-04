import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AdminRoot = () => {
  return (
    <>
      <Outlet />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        newestOnTop
        theme="light"
      />
    </>
  );
};
export default AdminRoot;
