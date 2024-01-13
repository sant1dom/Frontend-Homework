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
        links.push({text: "Admin: Edit Movies", url: "/admin/movies"});
        links.push({text: "Admin: Add a Movie", url: "/admin/movie/create"});
        links.push({text: "Admin: Edit Lists", url: "/admin/lists"});
    }

    return (
        <>
            <Navbar title="Movies" links={links} backgroundColor="bg-gray-800" loading={loading}/>
            <Outlet />
        </>
    );
}

export default Layout;