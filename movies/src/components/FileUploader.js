import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import Spinner from './Spinner';

const FileUploader = ({
                          text, extensions, uploadAction, file, setFile, error, setError,
                      }) => {
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        if (error) {
            console.log(error);
            setLoading(false);
        }
    }, [error, setFile]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setError(null);
    };

    const handleUpload = () => {
        setLoading(true);
        uploadAction();
    };

    const renderFileInfo = () => {
        if (!file) return null;

        return (<div>
                <p className="text-sm text-gray-500">
                    Selected file: {file.name}, {(file.size / 1024 / 1024).toFixed(2)}MB
                </p>
                {file.type.includes('image') && (
                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-32 h-32 m-auto"/>)}
            </div>);
    };

    return (<div className="mb-3">
            <label className="mb-2 inline-block text-neutral-700 dark:text-neutral-200">
                {text}
            </label>
            <input
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                type="file"
                accept={extensions.map((extension) => `.${extension}`).join(', ')}
                onChange={handleFileChange}
                ref={inputRef}
                id="formFile"
            />
            <div className="h-2"/>
            <div className="flex flex-row items-center">
                <p className="text-sm text-gray-500">Allowed extensions: {extensions.join(', ')}</p>
                <div className="w-2"/>
                <p className="text-sm text-gray-500">Max size: 5MB</p>
                <div className="w-2"/>
            </div>
            <div className="flex justify-center items-center">{renderFileInfo()}</div>
            <div className="h-2"/>
            <div className="flex flex-row items-center">
                <Button
                    onClick={handleUpload}
                    label="Upload"
                    rounded={true}
                    disabled={!file || loading || error}
                />
                {loading && <>
                    <div className="w-2"/>
                    <Spinner/></>}
            </div>
            {error && <p className="text-red-500">{error}</p>}
        </div>);
};

FileUploader.propTypes = {
    text: PropTypes.string.isRequired,
    extensions: PropTypes.array.isRequired,
    uploadAction: PropTypes.func.isRequired,
    file: PropTypes.object,
    setFile: PropTypes.func.isRequired,
    error: PropTypes.string,
    setError: PropTypes.func.isRequired,
};

export default FileUploader;
