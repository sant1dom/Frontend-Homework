import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import {useSelector} from "react-redux";

const Layout = ({loading}) => {
    const authState = useSelector((state) => state.auth);
    const links = [
        {text: "Home", url: "/"},
    ];
    if (authState.isAuth) {
        // links.push({text: "Watchlist", url: "/watchlist"});
        // links.push({text: "Favorites", url: "/favorites"});
        links.push({text: "MyLists", url: "/mylists"});
        links.push({text: "Advanced Search", url: "/advanced-search"});
    }
    if (authState.is_superuser) {
        links.push({text: "Admin Search", url: "/admin/search"});
        links.push({text: "Add a Movie", url: "/admin/create"});
    }

    return (
        <>
            <Navbar title="Movies" links={links} backgroundColor="bg-gray-800" loading={loading}/>
            <Outlet />
        </>
    );
}

export default Layout;