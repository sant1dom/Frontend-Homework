import {useDispatch, useSelector} from "react-redux";
import Button from "../components/Button";
import {useState} from "react";
import {GoPencil} from "react-icons/go";
import Modal from "../components/Modal";
import {createPortal} from "react-dom";
import api from "../utils/api";
import FileUploader from "../components/FileUploader";
import {update_profile_image} from "../store/store";

const Profile = () => {
    const authState = useSelector((state) => state.auth);
    const [showModal, setShowModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();


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
                                        uploadAction={uploadAction} file={file} setFile={setFile} error={error} setError={setError}/>

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
                    >
                        <img
                            src={process.env.REACT_APP_BASE_URL+"/"+authState.photo}
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
                    <Button onClick={() => {
                    }} label="Modify Password" rounded={true}/>
                </div>
            </div>
        </div>
    );
};
export default Profile;