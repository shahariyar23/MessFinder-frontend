import UserProfile from "@/components/Users/UserProfile";
import About from "@/pages/About/About";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminRoot from "@/pages/Admin/AdminRoot";
import AdminUserProfile from "@/pages/Admin/AdminUserProfile";
import Login from "@/pages/Auth/Login/Login";
import Signup from "@/pages/Auth/Signup/Signup";
import Booking from "@/pages/Booking/Booking";
import Contact from "@/pages/Contact/Contact";
import Dashboard from "@/pages/Dashboard/Dashboard";
import AddMessDetails from "@/pages/Mess/AddMessDetails";
import Mess from "@/pages/Mess/Mess";
import Messlisting from "@/pages/Mess/Messlisting";
import MessRoot from "@/pages/Mess/MessRoot";
import SingleMess from "@/pages/Mess/SingleMess";
import NotFound from "@/pages/NotFound/NotFound";
import Root from "@/pages/Root/Root";
import { createBrowserRouter } from "react-router";





export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            {index: true, Component: Dashboard},
            {path: "about", Component: About},
            {path: "contact", Component: Contact},
            {path: "signup", Component: Signup},
            {path: "login", Component: Login},
            {path: "booking", Component: Booking},
            {path: "profile", Component: UserProfile},
            {path: "mess", Component: MessRoot,
                children: [
                    {index: true, Component: Mess},
                    {path: "listing", Component: Messlisting},
                    {path: "info", Component: SingleMess},
                    {path: "add", Component: AddMessDetails},
                ]
            },
            {path: "*", Component: NotFound},

        ]
    },
    {
        path: "admin",
        Component: AdminDashboard,
        children: [
            {index: true, Component: AdminDashboard},
            {path: ":userName/:userId", Component: AdminUserProfile},
        ]
    }
]);