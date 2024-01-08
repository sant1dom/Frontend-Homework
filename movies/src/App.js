import './App.css';
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import SingleList from "./pages/SingleList";

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

    const refresh = (token) => {
        api.post('/auth/refresh_token', {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then((response) => {
            const data = response.data;
            dispatch(login({
                token: data.access_token,
                userId: data.id,
                email: data.email,
                photo: data.profile_image,
                is_superuser: data.is_superuser,
            }));
            const expiration = new Date(new Date().getTime() + data.expiration * 60 * 1000)
            Cookies.set('access-token',
                data.access_token,
                {
                    expires: expiration,
                    sameSite: 'strict'
                });
            Cookies.set('expiration', expiration, {sameSite: 'strict'});
        }).catch((error) => {
            console.log(error);
        });
    }

    // Check if the user is already logged in
    useEffect(() => {
        const token = Cookies.get("access-token");
        if (token && !authState.isAuth) {
            console.log("Token found, logging in")
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
        const expiration = Cookies.get("expiration");
        const refreshTime = 5 * 60 * 1000;
        if (expiration && new Date(expiration) < (new Date().getTime() + refreshTime)) {
            console.log("Refreshing token");
            refresh(token);
        }
        setLoading(false);
    }, [authState.isAuth, dispatch]);

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
                                <Route path="/profile" element={<Profile/>}/>
                                <Route path="/mylists/:listname" element={<SingleList/>}/></>
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
