import {useRef} from "react";

const Input = (field, label, type, min = null, max = null) => {
    const input = useRef();
    const error = useRef();

    const clearError = () => {
        error.current.style.display = "none";
    };

    return (
        <div>
            {label}
            <br/>

            <input ref={input} name={field} type={type} min={min} max={max} onChange={clearError}/>

            <div ref={error} style="display: none; color: red">
                Write {label}
            </div>
        </div>
    );
}

export default Input;