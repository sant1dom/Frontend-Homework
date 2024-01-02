import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {login} from "../store/store";
import Button from "../components/Button";
import api from "../utils/api";

const Registration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [validationErrors, setValidationErrors] = useState({});
    const [registrationError, setRegistrationError] = useState(false);

    const EMAIL_REQUIRED = 'Please enter your email';
    const INVALID_EMAIL = 'Please enter a valid email address';
    const PASSWORD_REQUIRED = 'Please enter your password';
    const PASSWORD_CONFIRM_REQUIRED = 'Please confirm your password';
    const PASSWORDS_DO_NOT_MATCH = 'Passwords do not match';

    const validateForm = (currentEmail, currentPassword, confirmPassword) => {
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
        } else {
            let passwordFeedback = '';
            if (currentPassword.length < 8) {
                passwordFeedback += 'Must be at least 8 characters. ';
            }
            if (!/\d/.test(currentPassword)) {
                passwordFeedback += 'Must contain at least one number. ';
            }
            if (!/[a-zA-Z]/.test(currentPassword)) {
                passwordFeedback += 'Must contain at least one letter. ';
            }
            if (!/[^a-zA-Z0-9]/.test(currentPassword)) {
                passwordFeedback += 'Must contain at least one special character. ';
            }
            if (/\s/.test(currentPassword)) {
                passwordFeedback += 'Your password cannot contain spaces. ';
            }
            if (passwordFeedback !== '') {
                passwordFeedback = 'Your password must meet the following requirements: ' + passwordFeedback;
                errors.password = passwordFeedback;
            }
        }

        if (!confirmPassword) {
            errors.passwordConfirm = PASSWORD_CONFIRM_REQUIRED;
        } else if (currentPassword !== confirmPassword) {
            errors.passwordConfirm = PASSWORDS_DO_NOT_MATCH;
        }

        return errors;
    };

    function handleInputChange(e, setState) {
        const {value, id} = e.target;
        const errors = validateForm(id === "email" ? value : email,
            id === "password" ? value : password,
            id === "password-confirm" ? value : passwordConfirm)
        setState(value)
        setValidationErrors(errors)
        setRegistrationError(false)
    }

    const handleRegistration = () => {
        if (!validateForm()) {
            return;
        }
        api.post('http://localhost:8000/auth/register', JSON.stringify({
                email: email,
                password: password
            })).then((response) => {
            console.log(response);
            const data = response.data;
            dispatch(login({
                token: data.access_token,
                userId: data.userId,
                email: data.email,
                photo: data.profile_image,
                is_superuser: data.is_superuser,
            }));
            navigate('/');
        }).catch((error) => {
            console.log(error);
            setRegistrationError(true);
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">Register</h2>

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
                    />
                    {validationErrors.password &&
                        <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password-confirm">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="password-confirm"
                        className={`w-full border p-2 rounded ${validationErrors.passwordConfirm ? 'border-red-500' : ''}`}
                        placeholder="Confirm your password"
                        value={passwordConfirm}
                        onChange={(e) => {
                            handleInputChange(e, setPasswordConfirm)
                        }}
                    />
                    {validationErrors.passwordConfirm &&
                        <p className="text-red-500 text-xs mt-1">{validationErrors.passwordConfirm}</p>}
                </div>

                {registrationError && <><p className="text-red-500 text-xs mt-1">Registration failed. Please try
                    again.</p><br/></>}

                <Button label="Register" onClick={handleRegistration} rounded={true}
                        disabled={!(Object.keys(validationErrors).length === 0)}/>
                <div className="text-center mt-4">
                    <Link to="/login" className="text-blue-400 hover:text-blue-800">
                        Already have an account? Login here.
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Registration;