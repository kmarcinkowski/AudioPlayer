import { useState } from "react";

export default function Dropdown(props) {
    const [show, setShow] = useState(false);

    const toggleDropdown = (event) => {
        setShow(!show);
    };
    // TODO on click out hide
    return (
        <div className="dropdown">
            <button
                className="btn dropdown-toggle"
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
