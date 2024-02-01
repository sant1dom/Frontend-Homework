import './App.css';
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import SingleList from "./pages/SingleList";

import {BrowserRouter, Route, Routes,} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {login} from "./store/store";
import Cookies from 'js-cookie';
import Registration from "./pages/Registration";
import api from "./utils/api";
import AdminSearchMovie from "./pages/AdminSearchMovie";
import AdminUpdateMovie from "./pages/AdminUpdateMovie";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import MyLists from "./pages/MyLists";
import AdminSearchList from "./pages/AdminSearchList";
import AdminSearchComment from "./pages/AdminSearchComment";
import AdvancedSearch from "./pages/AdvancedSearch";
import BestLists from "./pages/BestLists";
import RedirectMsg from "./components/RedirectMsg";

function App() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);

    const refresh = () => {
        const token = Cookies.get("access-token");
        api.post('/auth/refresh_token', {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then((response) => {
            const data = response.data;
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
                    userId: data.id,
                    email: data.email,
                    photo: data.profile_image,
                    isAuth: true,
                    is_superuser: data.is_superuser,
                }));
            }).catch((error) => {
                console.log(error);
            })
        }
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [authState.isAuth, dispatch]);

    // Refresh token every 5 minutes
    useEffect(() => {
        const token = Cookies.get("access-token");
        if (token) {
            setInterval(() => {
                refresh();
            }, 5 * 60 * 1000);
        }
    }, []);

    return (
        <>
            <BrowserRouter>
                <div className="App bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg"
                     style={{minHeight: "91vh"}}>
                    <Routes>
                        <Route path="/" element={<Layout loading={loading}/>}>
                            <Route index element={<Home/>}/>
                            {!authState.isAuth &&
                                <>
                                    <Route path="/login" element={<Login/>}/>
                                    <Route path="/register" element={<Registration/>}/>
                                </>
                            }
                            <Route path="/movie/:id" element={<Movie/>}/>
                            <Route path="/advanced-search" element={<AdvancedSearch/>}/>
                            {authState.isAuth &&
                                <>
                                    <Route path="/mylists" element={<MyLists/>}/>
                                    <Route path="/profile" element={<Profile/>}/>
                                    <Route path="/mylists/:id" element={<SingleList url='/mylists/'/>}/>
                                    <Route path="/bestlists" element={<BestLists/>}/>
                                    <Route path="/bestlists/:id" element={<SingleList url='/bestlists/'/>}/>
                                    <Route path="/list/:id" element={<SingleList url='/bestlists/'/>}/>
                                    {authState.is_superuser &&
                                        <>
                                            <Route path="/admin/movies" element={<AdminSearchMovie/>}/>
                                            <Route path="/admin/movie/create" element={<AdminUpdateMovie/>}/>
                                            <Route path="/admin/movie/update/:id" element={<AdminUpdateMovie/>}/>
                                            <Route path="/admin/lists" element={<AdminSearchList/>}/>
                                            <Route path="/admin/comments" element={<AdminSearchComment/>}/>
                                        </>
                                    }
                                </>
                            }
                            <Route path="*" element={<NotFound/>}/>
                        </Route>
                    </Routes>
                </div>
                <RedirectMsg/>
            </BrowserRouter>
            <footer
                className="relative bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 Watchlater™. All Rights Reserved.</span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">About</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline">Contact</a>
                    </li>
                </ul>
            </footer>
        </>
    );
}

export default App;
