import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import {useSelector} from "react-redux";

const Layout = ({loading}) => {
    const authState = useSelector((state) => state.auth);
    const links = [
        {text: "Home", url: "/"},
        {text: "Advanced Search", url: "/advanced-search"}
    ];
    if (authState.isAuth) {
        // links.push({text: "Watchlist", url: "/watchlist"});
        // links.push({text: "Favorites", url: "/favorites"});
        links.push({text: "MyLists", url: "/mylists"});
    }
    if (authState.is_superuser) {
        links.push({text: "Admin: Edit/Delete Movies", url: "/admin/movies"});
        links.push({text: "Admin: Add Movie", url: "/admin/movie/create"});
        links.push({text: "Admin: Delete Lists", url: "/admin/lists"});
        links.push({text: "Admin: Delete Comments", url: "/admin/comments"});
    }

    return (
        <>
            <Navbar title="Movies" links={links} backgroundColor="bg-gray-800" loading={loading}/>
            <Outlet />
            <div className="h-20"/>
        </>
    );
}

export default Layout;