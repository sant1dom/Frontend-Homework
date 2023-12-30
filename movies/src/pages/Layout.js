import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    const links = [
        {text: "Home", url: "/"},
    ];

    return (
        <>
            <Navbar title="Movies" links={links} backgroundColor="bg-gray-800" />
            <Outlet />
        </>
    );
}

export default Layout;