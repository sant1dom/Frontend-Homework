import {useEffect, useRef} from "react";
import {useDispatch} from "react-redux";

const Input = ({field, label, type, min = null, max = null}) => {
    const input = useRef();
    const error = useRef();

    const dispatch = useDispatch();

    const handleChange = () => {
        const v = input.current.value;
        let d = "block";

        if (v.length != 0) {
            d = "none";
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
        handleChange();
    });

    return (
        <div>
            {label}
            <br/>

            <input ref={input} name={field} type={type} min={min} max={max} onChange={handleChange}
                   style={{border: "1px solid black"}}/>

            <div ref={error} style={{display: "none", color: "red"}}>
                Write {label}
            </div>
        </div>
    );
}

export default Input;