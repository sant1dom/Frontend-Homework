import React, {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";

const Input = ({field, label, type, showError = false, value = "", min = null, max = null}) => {

    const input = useRef();
    const error = useRef();

    const dispatch = useDispatch();

    const handleChange = () => {
        const v = input.current.value;

        let d = "none";
        if (v.length === 0 && showError) {
            d = "inline";
        }
        error.current.style.display = d;

        dispatch({
            type: "inputState/add",
            payload:
                {
                    table: "movie",
                    key: field,
                    value: v,
                }
        });
    };

    const [putDefault, setPutDefault] = useState(false);

    useEffect(() => {
        if(!putDefault){
            input.current.value = value;
            setPutDefault(true);
        }

        handleChange();
    });

    return (
        <div>
            <div className="text-lg font-medium">
                {label}
            </div>

            <div>
                <input
                    ref={input}
                    name={field} type={type} min={min} max={max}
                    onChange={handleChange}
                    className="border-2 border-gray-300 rounded-md w-64 p-2"
                />
            </div>

            <div className="text-lg font-normal text-red-500 h-10">
                <span
                    ref={error}
                    style={{display: "none"}}
                >
                    Write {label}
                </span>
            </div>

        </div>
    );
}

export default Input;