import {useEffect, useRef} from "react";
import {useDispatch} from "react-redux";

const Input = ({field, label, type, value = null, min = null, max = null}) => {
    const input = useRef();
    const error = useRef();

    const dispatch = useDispatch();

    const handleChange = () => {
        const v = input.current.value;
        let d = "none";

        if (v.length == 0) {
            d = "inline";
        }

        error.current.style.display = d;

        dispatch({
            type: "genericState/add",
            payload:
                {
                    table: "input",
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
            {label}
            <br/>

            <input ref={input} name={field} type={type} min={min} max={max} onChange={handleChange}
                   style={{border: "1px solid black"}}/>

            <div style={{padding: "0 0 10px 0"}}>
                <span ref={error} style={{display: "none", color: "red"}}>
                    Write {label}
                </span>
                <br/>
            </div>
        </div>
    );
}

export default Input;