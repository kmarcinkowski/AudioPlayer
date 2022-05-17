import { useEffect, useRef, useState } from "react";

export default function Dropdown(props) {
    const [show, setShow] = useState(false);
    const wrapper = useRef(null);

    const toggleDropdown = (event) => {
        setShow(!show);
    };

    useEffect(() => {
        /** Alert if clicked on outside of element*/
        function handleClickOutside(event) {
            if (wrapper.current && !wrapper.current.contains(event.target)) {
                setShow(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapper]);
    
    // TODO on click out hide
    return (
        <div className={`dropdown ${props.className ?? ""}`} ref={wrapper}>
            <button
                className="btn shadow-none"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded={show ? true : false}
                onClick={toggleDropdown}
            >
                {props.label ? props.label : "Dropdown btn"}
            </button>
            {show && (
                <ul
                    className="dropdown-menu show"
                    aria-labelledby="dropdownMenuButton1"
                    onClick={toggleDropdown}
                >
                    {props.children}
                </ul>
            )}
        </div>
    );
}
