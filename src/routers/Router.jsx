import { createBrowserRouter } from "react-router";

/* ========== LAYOUTS ========== */
import Root from "@/pages/Root/Root";
import MessRoot from "@/pages/Mess/MessRoot";
import AdminLayout from "@/pages/Admin/AdminDashboard";

/* ========== PUBLIC PAGES ========== */
import Dashboard from "@/pages/Dashboard/Dashboard";
import About from "@/pages/About/About";
import Contact from "@/pages/Contact/Contact";
import Login from "@/pages/Auth/Login/Login";
import Signup from "@/pages/Auth/Signup/Signup";
import ForgotPassword from "@/pages/Auth/ForgotPassword/ForgotPassword";
import VerifyOTP from "@/pages/Auth/ForgotPassword/VerifyOtp";
import ResetPassword from "@/pages/Auth/ForgotPassword/ResetPassword";
import VerifyLoginOtp from "@/pages/Auth/Otp/VerifyOtp";
import NotFound from "@/pages/NotFound/NotFound";

/* ========== PROTECTED PAGES ========== */
import Protected from "@/pages/Protected/Protected";
import UserProfile from "@/components/Users/UserProfile";
import Messlisting from "@/pages/Mess/Messlisting";
import SingleMess from "@/pages/Mess/SingleMess";
import Booking from "@/pages/Booking/Booking";
import AddMessDetails from "@/pages/Mess/AddMessDetails";
import { PaymentSuccess } from "@/pages/Mess/PaymentSuccess";
import { PaymentFailed } from "@/pages/Mess/PaymentFailed";

/* ========== ADMIN ========== */
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminUserProfile from "@/pages/Admin/AdminUserProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      /* ---------- PUBLIC ROUTES ---------- */
      { index: true, Component: Dashboard },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },

      { path: "forgot-password", Component: ForgotPassword },
      { path: "verify-otp", Component: VerifyOTP },
      { path: "verify-login-otp", Component: VerifyLoginOtp },
      { path: "reset-password", Component: ResetPassword },

      /* ---------- PROTECTED ROUTES ---------- */
      {
        path: "login",
        element: (
          <Protected preventAuthenticated={true}>
            <Login />
          </Protected>
        ),
      },
      {
        path: "signup",
        element: (
          <Protected preventAuthenticated={true}>
            <Signup />
          </Protected>
        ),
      },
      {
        path: "profile/:userId",
        element: (
          <Protected>
            <UserProfile />
          </Protected>
        ),
      },

      {
        path: "payment/success",
        element: (
          <Protected>
            <PaymentSuccess />
          </Protected>
        ),
      },
      {
        path: "payment/failed",
        element: (
          <Protected>
            <PaymentFailed />
          </Protected>
        ),
      },
      {
        path: "payment/cancel",
        element: (
          <Protected>
            <PaymentFailed />
          </Protected>
        ),
      },

      /* ---------- MESS ROUTES ---------- */
      {
        path: "mess",
        Component: MessRoot,
        children: [
          { index: true, Component: Messlisting },
          { path: "listing", Component: Messlisting },

          {
            path: "info/:messId",
            element: (
              <Protected>
                <SingleMess />
              </Protected>
            ),
          },

          {
            path: "booking/:messId",
            element: (
              <Protected requiredRole="student">
                <Booking />
              </Protected>
            ),
          },

          {
            path: "add",
            element: (
              <Protected requiredRole="owner">
                <AddMessDetails />
              </Protected>
            ),
          },
        ],
      },

      /* ---------- 404 ---------- */
      { path: "*", Component: NotFound },
    ],
  },

  /* ---------- ADMIN ROUTES ---------- */
  {
    path: "/admin",
    element: (
      <Protected requiredRole="admin">
        <AdminLayout />
      </Protected>
    ),
    children: [
      { index: true, Component: AdminDashboard },
      { path: "users/:userId", Component: AdminUserProfile },
    ],
  },
]);
