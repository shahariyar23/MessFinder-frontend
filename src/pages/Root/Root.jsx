import { Outlet } from "react-router"
import Navbar from "../Header/Navbar"
import Footer from "../Footer/Footer"

const Root = () => {
    return (
        <div>
            <Navbar/>
            <Outlet/>
            <Footer/>
        </div>
    )
}
export default Root