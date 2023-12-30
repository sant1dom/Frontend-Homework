// LoginPage.js

import React, {useState} from 'react';
import Button from "../components/Button";
import axios from "axios";
import {login} from "../store/store";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = () => {
        axios.post('http://localhost:8000/auth/login', {
            username: email,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        }).then((response) => {
            console.log(response);
            const data = response.data;
            dispatch(login({
                token: data.access_token,
                userId: data.userId,
                email: data.email,
                isAuth: true
            }));
            navigate('/');
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">Login</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="text"
                        id="email"
                        className="w-full border p-2 rounded"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full border p-2 rounded"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <Button label="Login" onClick={handleLogin}/>

            </div>
        </div>
    );
};

export default Login;
