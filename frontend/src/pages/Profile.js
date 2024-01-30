import {useDispatch, useSelector} from "react-redux";
import Button from "../components/Button";
import React, {useState} from "react";
import {GoCheck, GoPencil} from "react-icons/go";
import Modal from "../components/Modal";
import {createPortal} from "react-dom";
import api from "../utils/api";
import FileUploader from "../components/FileUploader";
import {update_profile_image} from "../store/store";
import FadeContainer from "../components/FadeContainer";
import {validateFormWithOldPassword} from "../utils/validationUtils";
import FeedbackMessage from "../components/FeedbackMessage";

const Profile = () => {
    const authState = useSelector((state) => state.auth);
    const [showModal, setShowModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [modifyingPassword, setModifyingPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const dispatch = useDispatch();

    const PasswordChangeForm = <FadeContainer show={modifyingPassword}>
        <div className="flex flex-col items-center">
            <div className="h-4"/>
            <input type="password" placeholder="Old Password"
                   onChange={(e) => handleInputChange(e, setOldPassword)}
                   className="border-2 border-gray-300 rounded-md w-64 p-2"
                   id="old-password"
                   value={oldPassword}
            />
            <div className="h-4"/>
            <input type="password" placeholder="New Password"
                   onChange={(e) => handleInputChange(e, setPassword)}
                   className="border-2 border-gray-300 rounded-md w-64 p-2"
                   id="password"
                   value={password}
            />
            {validationErrors.password &&
                validationErrors.password.split("$").map((error) => {
                    return <p key={error} className="text-red-500 text-xs mt-1">{error}</p>
                })}
            <div className="h-4"/>
            <input type="password" placeholder="Confirm Password"
                   onChange={(e) => handleInputChange(e, setPasswordConfirm)}
                   className="border-2 border-gray-300 rounded-md w-64 p-2"
                   id="password-confirm"
                   value={passwordConfirm}
            />
            {validationErrors.passwordConfirm &&
                <p className="text-red-500 text-xs mt-1">{validationErrors.passwordConfirm}</p>}
            <div className="h-4"/>
            <div className={"flex flex-col items-center justify-center"}>
                <div className="flex flex-row items-center justify-center">
                    {validationErrors.passwordSub &&
                        <p className="text-red-500 text-xs mt-1">{validationErrors.passwordSub}</p>}
                </div>
                <div className="h-4"/>
                <div className="flex flex-row items-center justify-center">
                    <Button onClick={() => {
                        api.post('/auth/change_password', {
                            old_password: oldPassword,
                            new_password: password
                        }, {
                            "headers": {
                                "Authorization": `Bearer ${authState.token}`,
                                "Content-Type": "application/json"
                            }
                        }).then((response) => {
                            setModifyingPassword(false);
                            setOldPassword("");
                            setPassword("");
                            setPasswordConfirm("");
                            setFeedbackMessage("Password changed successfully.");
                            setShowFeedback(true);
                            setTimeout(() => {
                                setShowFeedback(false);
                            }, 3000);
                        }).catch((error) => {
                            setValidationErrors({
                                passwordSub: error.response.data.detail
                            })
                        });
                    }} label="Submit" rounded={true}
                            disabled={Object.keys(validationErrors).length > 0}/>
                    <div className="w-4"/>
                    <Button onClick={() => {
                        setModifyingPassword(false);
                        setOldPassword("");
                        setPassword("");
                        setPasswordConfirm("");
                    }} label="Cancel" rounded={true}
                            classes={"bg-red-500 hover:bg-red-600"}/>
                </div>
            </div>
        </div>
    </FadeContainer>

    function handleInputChange(e, setState) {
        const {value, id} = e.target;
        const errors = validateFormWithOldPassword(id === "password" ? value : password,
            id === "password-confirm" ? value : passwordConfirm, id === "old-password" ? value : oldPassword);
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
                setError(null);
                setFeedbackMessage("Profile image updated successfully.");
                setShowFeedback(true);
                setTimeout(() => {
                    setShowFeedback(false);
                }, 3000);
            }).catch((error) => {
                setError(error.response.data.detail);
            });
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
                        onClick={() => {
                            if (!isHovered) setShowModal(true)
                        }}
                    >
                        <img
                            src={process.env.REACT_APP_BASE_URL + authState.photo}
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
                    {showFeedback && createPortal(
                        <FeedbackMessage
                            message={<><div className={"flex flex-row items-center justify-center"}><GoCheck className={"mr-4"}/>{feedbackMessage}</div></>}
                            classes="bg-green-500 text-white pointer-events-auto"
                            position="bottom"
                        />,
                        document.body
                    )}
                    {PasswordChangeForm}
                </div>
            </div>
        </div>
    );
};
export default Profile;