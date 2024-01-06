import './App.css';
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import MyLists from "./pages/MyLists";

import {BrowserRouter, Route, Routes,} from "react-router-dom";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import axios from "axios";
import {login} from "./store/store";
import Cookies from 'js-cookie';
import Registration from "./pages/Registration";
import api from "./utils/api";
import AdminSearch from "./pages/AdminSearch";
import AdminOperation from "./pages/AdminOperation";
import Popup from "./components/Popup";

function App() {
    const dispatch = useDispatch();

    // Check if the user is already logged in
    useEffect(() => {
        const token = Cookies.get("access-token");
        if (token) {
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
    });
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Registration/>}/>
                        <Route path="/admin/search" element={<AdminSearch/>}/>
                        <Route path="/admin/create" element={<AdminOperation/>}/>
                        <Route path="/admin/update/:id" element={<AdminOperation/>}/>
                        <Route path="/mylists" element={<MyLists/>}/>
                        <Route path="/movie/:id" element={<Movie/>}/>
                    </Route>
                </Routes>
            </div>
            <Popup />
        </BrowserRouter>
    );
}

export default App;
