import { useRef, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import Button from "./Button";
import Cookies from 'js-cookie';
import api from "../utils/api";

// Content styles, including inline UI like fake cursors
/* eslint import/no-webpack-loader-syntax: off */
import contentCss from '!!raw-loader!tinymce/skins/content/default/content.min.css';
import contentUiCss from '!!raw-loader!tinymce/skins/ui/oxide/content.min.css';
import PropTypes from "prop-types";

const EditorComment = ({ onSubmit, label, initialContent }) => {
    const editorRef = useRef(null);
    const token = Cookies.get("access-token");
    const [comment, setComment] = useState('');

    const handleEditorChange = (content) => {
        setComment(content);
    };

    const handleSubmit = async () => {
        onSubmit(comment)
        setComment('');
    }

    return (
        <>
            <div className="shadow-2xl">
            <Editor
                tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={initialContent}
                init={{
                    height: 250,
                    menubar: false,
                    /*plugins: [
                        'advlist autolink lists link image charmap anchor',
                        'searchreplace wordcount fullscreen',
                        'insertdatetime media nonbreaking table',
                        'template help code'
                    ],*/
                    toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: [contentCss, contentUiCss].join('\n'),
                }}
                onEditorChange={handleEditorChange}
                value={comment}
            />
            </div>
            <br />
            <Button onClick={handleSubmit} label={label} rounded={true} disabled={comment === ''} />
        </>
    );
}

EditorComment.defaultProps = {
    label: 'Add Comment',
    initialContent: '',
};

EditorComment.propTypes = {
    label: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    initialContent: PropTypes.string,
};

export default EditorComment;