import propTypes from 'prop-types';
import {GoX} from "react-icons/go";
import {useEffect} from "react";

const Modal = ({title, body, footer, onClose}) => {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.keyCode === 27) {
                onClose();
            }
        }
        document.addEventListener("keydown", handleEscape, false);
        return () => {
            document.removeEventListener("keydown", handleEscape, false);
        };
    }, [])

    function handleCloseButtonClick(event) {
        onClose();
        event.stopPropagation();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-white bg-opacity-25"
            onClick={(event)=>handleCloseButtonClick(event)}
        >
            <div className="relative w-auto my-6 mx-auto max-w-3xl"
                    onClick={(event)=>event.stopPropagation()}> 
                {/*content*/}
                <div
                    className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div
                        className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                        <h3 className="text-3xl font-semibold">
                            {title}
                        </h3>
                        <div className="w-4"/>
                        <div className="ml-auto flex items-center cursor-pointer" onClick={(event)=>handleCloseButtonClick(event)}>
                            <GoX className="w-6 h-6"/>
                        </div>
                    </div>
                    {/*body*/}
                    <div className="relative p-6 flex-auto">
                        {body}
                    </div>
                    {/*footer*/}
                    {footer && (
                        <div
                            className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

Modal.propTypes = {
    title: propTypes.string.isRequired,
    body: propTypes.element.isRequired,
    footer: propTypes.element,
    onClose: propTypes.func.isRequired,
};

export default Modal;
