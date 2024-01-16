import { useRef, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import Button from "./Button";
import Cookies from 'js-cookie';
import api from "../utils/api";

// Content styles, including inline UI like fake cursors
/* eslint import/no-webpack-loader-syntax: off */
import contentCss from '!!raw-loader!tinymce/skins/content/default/content.min.css';
import contentUiCss from '!!raw-loader!tinymce/skins/ui/oxide/content.min.css';

const EditorComment = ({ onSubmit }) => {
    const editorRef = useRef(null);
    const token = Cookies.get("access-token");
    const [comment, setComment] = useState('');

    const handleEditorChange = (content) => {
        setComment(content);
        console.log(content)
    };

    const handleSubmit = async () => {
        onSubmit(comment)
        setComment('');
        
    }

    return (
        <>
            <Editor
                tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue=""
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
            <br />
            <Button onClick={handleSubmit} label={'Add Comment'} rounded={true} />
        </>
    );
}

export default EditorComment;