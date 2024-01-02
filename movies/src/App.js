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

function App() {
    const dispatch = useDispatch();

    // Check if the user is already logged in
    useEffect(() => {
        const token = Cookies.get("access-token");
        console.log(token)
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
                    profile_image: data.profile_image,
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
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
