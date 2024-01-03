import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./pages/Layout";

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
                    isAuth: true
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
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
