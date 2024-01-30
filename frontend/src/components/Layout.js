import Navbar from "./Navbar";
import {Outlet} from "react-router-dom";
import {useSelector} from "react-redux";
import Spinner from "./Spinner";

const Layout = ({loading}) => {
    const authState = useSelector((state) => state.auth);
    const links = [
        {text: "Home", url: "/"},
        {text: "Advanced Search", url: "/advanced-search"}
    ];

    if (authState.isAuth) {
        links.push({text: "MyLists", url: "/mylists"});
        links.push({text: "Best Lists", url: "/bestlists"});
    }

    let links_admin = [];
    if (authState.is_superuser) {
        links_admin = [
            {text: "Edit/Delete Movies", url: "/admin/movies"},
            {text: "Add Movie", url: "/admin/movie/create"},
            {text: "Delete Lists", url: "/admin/lists"},
            {text: "Delete Comments", url: "/admin/comments"},
        ];
    }

    return (
        <>
            <Navbar title="Movies" links={links} links_admin={links_admin} backgroundColor="bg-gray-800"
                    loading={loading}/>
            {!loading ? <Outlet/> : <div className={"flex justify-center items-center h-screen "}><Spinner/></div>}
            <div className="h-20"/>
        </>
    );
}

export default Layout;