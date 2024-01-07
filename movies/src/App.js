import './App.css';
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Watchlist from "./pages/Watchlist";

import {BrowserRouter, Route, Routes,} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {login} from "./store/store";
import Cookies from 'js-cookie';
import Registration from "./pages/Registration";
import api from "./utils/api";
import AdminSearch from "./pages/AdminSearch";
import AdminOperation from "./pages/AdminOperation";
import Popup from "./components/Popup";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Spinner from "./components/Spinner";
import MyLists from "./pages/MyLists";

function App() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);

    // Check if the user is already logged in
    useEffect(() => {
        const token = Cookies.get("access-token");
        if (token && !authState.isAuth) {
            api.get("/auth/current_user",
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }
            ).then((response) => {
                const data = response.data;
                dispatch(login({
                    token: token,
                    userId: data.userId,
                    email: data.email,
                    photo: data.profile_image,
                    isAuth: true,
                    is_superuser: data.is_superuser,
                }));
            }).catch((error) => {
                console.log(error);
            });
        }
        setLoading(false);
    });

    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        {!loading && <><Route index element={<Home/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Registration/>}/>
                            <Route path="/movie/:id" element={<Movie/>}/>
                            {authState.isAuth && <><Route path="/admin/search" element={<AdminSearch/>}/>
                                <Route path="/admin/create" element={<AdminOperation/>}/>
                                <Route path="/admin/update/:id" element={<AdminOperation/>}/>
                                <Route path="/mylists" element={<MyLists/>}/>
                                <Route path="/profile" element={<Profile/>}/></>
                            }
                            <Route path="*" element={<NotFound/>}/></>}
                    </Route>
                </Routes>
                {loading && <Spinner/>}
            </div>
            <Popup/>
        </BrowserRouter>
    );
}

export default App;
