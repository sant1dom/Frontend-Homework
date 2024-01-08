import {useDispatch, useSelector} from "react-redux";
import Button from "../components/Button";
import React, {useState} from "react";
import {GoPencil} from "react-icons/go";
import Modal from "../components/Modal";
import {createPortal} from "react-dom";
import api from "../utils/api";
import FileUploader from "../components/FileUploader";
import {update_profile_image} from "../store/store";
import FadeContainer from "../components/FadeContainer";
import {validateFormWithPassword} from "../utils/validationUtils";

const Profile = () => {
    const authState = useSelector((state) => state.auth);
    const [showModal, setShowModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [modifyingPassword, setModifyingPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const dispatch = useDispatch();

    function handleInputChange(e, setState) {
        const {value, id} = e.target;
        console.log(id);
        const errors = validateFormWithPassword(id === "password" ? value : password,
            id === "password-confirm" ? value : passwordConfirm)
        setState(value)
        setValidationErrors(errors)
    }


    const uploadAction = () => {
        if (file !== null) {
            let fd = new FormData();
            fd.append('file', file);
            api.post('/auth/update_profile_image', fd, {
                "headers": {
                    "Authorization": `Bearer ${authState.token}`,
                    "Content-Type": "multipart/form-data"
                }
            }).then((response) => {
                dispatch(update_profile_image({photo: response.data}));
                setShowModal(false);
                setIsHovered(false);
                setFile(null);
            }).catch((error) => {
                setError(error.response.data.detail);
            });
        } else {
            console.log("No file selected.");
        }
    }
    const imageUploader = <FileUploader text="Upload a new profile image." extensions={['jpg', 'jpeg', 'png']}
                                        uploadAction={uploadAction} file={file} setFile={setFile} error={error}
                                        setError={setError}/>

    return (
        <div className="container mx-auto">
            <div className="h-4"/>
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center relative">
                    <h1 className="text-4xl font-bold">Profile</h1>
                    <div className="h-4"/>
                    <p className="text-gray-500">This is your profile page.</p>
                    <div className="h-4"/>
                    <div
                        className="relative rounded-full w-64 h-64 overflow-hidden border-4 border-gray-200 hover:border-gray-400 cursor-pointer transition-all duration-150 hover:shadow-lg hover:opacity-75"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => { if (!isHovered) setShowModal(true) }}
                    >
                        <img
                            src={process.env.REACT_APP_BASE_URL + "/" + authState.photo}
                            alt="Profile"
                            className="w-full h-full hover:opacity-75 hover:transition-opacity duration-150"
                        />
                        {isHovered && (
                            <div className="absolute inset-0 flex items-center justify-center"
                                 onClick={() => setShowModal(true)}>
                                <GoPencil className="w-12 h-12 text-black-50 hover:text-gray-400 cursor-pointer"/>
                            </div>
                        )}
                        {showModal &&
                            createPortal(
                                <Modal
                                    title="Edit Profile Image"
                                    body={imageUploader}
                                    onClose={() => {
                                        setIsHovered(false);
                                        setShowModal(false);
                                    }}
                                />,
                                document.body
                            )}
                    </div>
                    <h1 className="text-2xl font-bold mt-4">{authState.email}</h1>
                    {{
                        true: <p className="text-red-500">You're an Administrator.</p>,
                        false: <p></p>,
                    }[authState.is_superuser]}
                    <div className="h-4"/>
                    <Button onClick={() => setModifyingPassword(!modifyingPassword)} label="Modify Password"
                            rounded={true}/>
                    <FadeContainer show={modifyingPassword}>
                        <div className="flex flex-col items-center">
                            <div className="h-4"/>
                            <input type="password" placeholder="New Password"
                                   onChange={(e) => handleInputChange(e, setPassword)}
                                   className="border-2 border-gray-300 rounded-md w-64 p-2"
                                   id="password"
                            />
                            {validationErrors.password &&
                                validationErrors.password.split("$").map((error) => {
                                    return <p className="text-red-500 text-xs mt-1">{error}</p>
                                })}
                            <div className="h-4"/>
                            <input type="password" placeholder="Confirm Password"
                                   onChange={(e) => handleInputChange(e, setPasswordConfirm)}
                                   className="border-2 border-gray-300 rounded-md w-64 p-2"
                                   id="password-confirm"
                            />
                            {validationErrors.passwordConfirm &&
                                <p className="text-red-500 text-xs mt-1">{validationErrors.passwordConfirm}</p>}
                            <div className="h-4"/>
                            <Button onClick={() => {
                                api.post('/auth/change_password', {password: password}, {
                                    "headers": {
                                        "Authorization": `Bearer ${authState.token}`,
                                        "Content-Type": "application/json"
                                    }
                                }).then((response) => {
                                    console.log(response);
                                    setModifyingPassword(false);
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }} label="Submit" rounded={true}/>
                            <div className="h-4"/>
                            <Button onClick={() => setModifyingPassword(false)} label="Cancel" rounded={true}
                                    classes={"bg-red-500 hover:bg-red-600"}/>
                        </div>
                    </FadeContainer>
                </div>
            </div>
        </div>
    );
};
export default Profile;