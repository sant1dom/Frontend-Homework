import React, {useEffect, useRef} from "react";
import {useDispatch} from "react-redux";

const Input = ({field, label, type, value = null, min = null, max = null}) => {
    const input = useRef();
    const error = useRef();

    const dispatch = useDispatch();

    const handleChange = () => {
        const v = input.current.value;
        let d = "none";

        if (v.length === 0) {
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

    useEffect(() => {
        input.current.value = value;
        handleChange();
    });

    return (
        <div>
            <div className="text-body">
                {label}
            </div>

            <div>
                <input ref={input} name={field} type={type} min={min} max={max} onChange={handleChange}
                       className="border-2 border-gray-300 rounded-md w-64 p-2"
                />
            </div>

            <div className="text-red-500 text-body h-8">
                <span ref={error} style={{display: "none"}}>
                    Write {label}
                    </span>
            </div>

        </div>
    )
        ;
}

export default Input;