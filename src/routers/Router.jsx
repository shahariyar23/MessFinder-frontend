import UserProfile from "@/components/Users/UserProfile";
import About from "@/pages/About/About";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminRoot from "@/pages/Admin/AdminRoot";
import AdminUserProfile from "@/pages/Admin/AdminUserProfile";
import ForgotPassword from "@/pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "@/pages/Auth/ForgotPassword/ResetPassword";
import VerifyOTP from "@/pages/Auth/ForgotPassword/VerifyOtp";
import Login from "@/pages/Auth/Login/Login";
import Signup from "@/pages/Auth/Signup/Signup";
import Booking from "@/pages/Booking/Booking";
import Contact from "@/pages/Contact/Contact";
import Dashboard from "@/pages/Dashboard/Dashboard";
import AddMessDetails from "@/pages/Mess/AddMessDetails";
import Mess from "@/pages/Mess/Mess";
import Messlisting from "@/pages/Mess/Messlisting";
import MessRoot from "@/pages/Mess/MessRoot";
import { PaymentFailed } from "@/pages/Mess/PaymentFailed";
import {PaymentSuccess} from "@/pages/Mess/PaymentSuccess";
import SingleMess from "@/pages/Mess/SingleMess";
import NotFound from "@/pages/NotFound/NotFound";
import Protected from "@/pages/Protected/Protected";
import Root from "@/pages/Root/Root";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { 
        index: true, 
        Component: Dashboard,
        handle: {
          title: "Home - Mess Finder",
          meta: {
            description: "Find the best mess services near you. Browse through various mess options and book your meal plans.",
            keywords: "mess, food, meal, booking, hostel"
          }
        }
      },
      { 
        path: "about", 
        Component: About,
        handle: {
          title: "About Us - Mess Finder",
          meta: {
            description: "Learn more about Mess Finder and our mission to connect students with quality mess services.",
            keywords: "about, mission, team, mess finder"
          }
        }
      },
      { 
        path: "contact", 
        Component: Contact,
        handle: {
          title: "Contact Us - Mess Finder",
          meta: {
            description: "Get in touch with Mess Finder team for any queries or support.",
            keywords: "contact, support, help, query"
          }
        }
      },
      { 
        path: "signup", 
        Component: Signup,
        handle: {
          title: "Sign Up - Mess Finder",
          meta: {
            description: "Create your Mess Finder account to start booking mess services.",
            keywords: "signup, register, create account"
          }
        }
      },
      { 
        path: "login", 
        Component: Login,
        handle: {
          title: "Login - Mess Finder",
          meta: {
            description: "Login to your Mess Finder account to manage your bookings and profile.",
            keywords: "login, signin, account"
          }
        }
      },
      { 
        path: "forgot-password", 
        Component: ForgotPassword,
        handle: {
          title: "Forgot Password - Mess Finder",
          meta: {
            description: "Reset your Mess Finder account password.",
            keywords: "forgot password, reset password"
          }
        }
      },
      { 
        path: "verify-otp", 
        Component: VerifyOTP,
        handle: {
          title: "Verify OTP - Mess Finder",
          meta: {
            description: "Verify your OTP to reset your password.",
            keywords: "verify otp, authentication"
          }
        }
      },
      { 
        path: "reset-password", 
        Component: ResetPassword,
        handle: {
          title: "Reset Password - Mess Finder",
          meta: {
            description: "Set your new password for Mess Finder account.",
            keywords: "reset password, new password"
          }
        }
      },
      { 
        path: "payment/success", 
        Component: PaymentSuccess,
        handle: {
          title: "Payment Successful - Mess Finder",
          meta: {
            description: "Your payment has been processed successfully.",
            keywords: "payment success, booking confirmed"
          }
        }
      },
      { 
        path: "payment/failed", 
        Component: PaymentFailed,
        handle: {
          title: "Payment Failed - Mess Finder",
          meta: {
            description: "Your payment could not be processed. Please try again.",
            keywords: "payment failed, try again"
          }
        }
      },
      { 
        path: "payment/cancel", 
        Component: PaymentFailed,
        handle: {
          title: "Payment Cancelled - Mess Finder",
          meta: {
            description: "Your payment has been cancelled.",
            keywords: "payment cancelled, booking cancelled"
          }
        }
      },
      {
        path: "profile/:userId",
        element: (
          <Protected>
            <UserProfile />
          </Protected>
        ),
        handle: {
          title: "User Profile - Mess Finder",
          meta: {
            description: "View and manage your user profile and bookings.",
            keywords: "profile, user, account, bookings"
          }
        }
      },
      {
        path: "mess/add",
        element: (
          <Protected>
            <AddMessDetails />
          </Protected>
        ),
        handle: {
          title: "Add Mess - Mess Finder",
          meta: {
            description: "Add your mess service to Mess Finder platform.",
            keywords: "add mess, register mess, become provider"
          }
        }
      },
      {
        path: "mess",
        Component: MessRoot,
        children: [
          { 
            index: true, 
            Component: MessRoot,
            handle: {
              title: "Mess Services - Mess Finder",
              meta: {
                description: "Browse all mess services available on our platform.",
                keywords: "mess services, food providers, meal plans"
              }
            }
          },
          { 
            path: "listing", 
            element: 
                <Messlisting/>,
            handle: {
              title: "Mess Listing - Mess Finder",
              meta: {
                description: "Find and compare different mess services near you.",
                keywords: "mess listing, compare mess, find mess"
              }
            }
          },
          { 
            path: "info/:messId", 
            element:<Protected>
              <SingleMess/>
              </Protected> ,
            handle: {
              title: "Mess Details - Mess Finder",
              meta: {
                description: "View detailed information about this mess service.",
                keywords: "mess details, menu, pricing, location"
              }
            }
          },
          {
            path: "booking/:messId",
            element: (
              <Protected>
                <Booking />
              </Protected>
            ),
            handle: {
              title: "Book Mess - Mess Finder",
              meta: {
                description: "Book your meal plan with this mess service.",
                keywords: "book mess, meal plan, subscription"
              }
            }
          },
        ],
      },
      { 
        path: "*", 
        Component: NotFound,
        handle: {
          title: "Page Not Found - Mess Finder",
          meta: {
            description: "The page you are looking for does not exist.",
            keywords: "404, not found, error"
          }
        }
      },
    ],
  },
  {
    path: "admin",
    Component: AdminDashboard,
    children: [
      { 
        index: true, 
        Component: AdminDashboard,
        handle: {
          title: "Admin Dashboard - Mess Finder",
          meta: {
            description: "Admin panel for managing Mess Finder platform.",
            keywords: "admin, dashboard, management"
          }
        }
      },
      { 
        path: ":userName/:userId", 
        Component: AdminUserProfile,
        handle: {
          title: "User Management - Mess Finder",
          meta: {
            description: "Manage user profiles and activities.",
            keywords: "user management, admin, profile"
          }
        }
      },
    ],
  },
]);