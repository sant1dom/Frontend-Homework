import React, {useState} from 'react';
import Button from "../components/Button";
import {login} from "../store/store";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import api from "../utils/api";
import Cookies from 'js-cookie';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [validationErrors, setValidationErrors] = useState({});
    const [loginError, setLoginError] = useState(false);

    const EMAIL_REQUIRED = 'Please enter your email';
    const INVALID_EMAIL = 'Please enter a valid email address';
    const PASSWORD_REQUIRED = 'Please enter your password';
    const INVALID_USER = 'Invalid email or password';

    const validateForm = (currentEmail, currentPassword) => {
        const errors = {};

        if (!currentEmail) {
            errors.email = EMAIL_REQUIRED;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(currentEmail)) {
                errors.email = INVALID_EMAIL;
            }
        }

        if (!currentPassword) {
            errors.password = PASSWORD_REQUIRED;
        }
        return errors;
    };

    const handleLogin = () => {
        if (!validateForm()) {
            return;
        }
        api.post('/auth/login', {
            username: email,
            password: password
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
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
            navigate('/');
        }).catch((error) => {
            console.log(error);
            setLoginError(true);
        });
    }

    function handleInputChange(e, setState) {
        const {id, value} = e.target;
        const errors = validateForm(id === "email" ? value : email, id === "password" ? value : password)
        setState(value)
        setValidationErrors(errors)
        setLoginError(false)
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
                        type="email"
                        id="email"
                        className={`w-full border p-2 rounded ${validationErrors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                            handleInputChange(e, setEmail)
                        }}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                handleLogin();
                            }
                        }}
                    />
                    {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className={`w-full border p-2 rounded ${validationErrors.password ? 'border-red-500' : ''}`}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                            handleInputChange(e, setPassword)
                        }}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                handleLogin();
                            }
                        }}
                    />
                    {validationErrors.password &&
                        <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>}
                </div>
                {loginError && <><p className="text-red-500 text-xs mt-1">{INVALID_USER}</p><br/></>}

                <Button label="Login" onClick={handleLogin} rounded={true} disabled={!(Object.keys(validationErrors).length === 0)}/>
                <div className="text-center mt-4">
                    <Link to="/register" className="text-blue-400 hover:text-blue-800">
                        Don't have an account? Register here.
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
