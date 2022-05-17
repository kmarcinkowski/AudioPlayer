import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import Modal from "./Modal";
import variables from "./css/variables.scss";

const style = {
    position: "absolute",
    opacity: "0.8",
    cursor: "pointer",
    transition: "opacity 0.2s",
    top: "10px",
};

const Storage = {
    bgColor: "bg-color",
    fontColor: "font-color",
};

const pickerStyles = {
    marginBottom: "8px",
    width: "auto",
};

export default function SettingsModal(props) {
    const [show, setShow] = useState(false);
    const [bgColor, setBgColor] = useState(
        localStorage.getItem(Storage.bgColor) ?? variables.bgColorPrimary
    );
    const [fontColor, setFontColor] = useState(
        localStorage.getItem(Storage.fontColor) ?? variables.fontColorPrimary
    );

    const showSettings = () => {
        setShow(true);
    };

    useEffect(() => {
        document.body.style.backgroundColor = bgColor;
        document.body.style.color = fontColor;
    }, [bgColor, fontColor]);

    const close = useCallback(() => {
        setShow(false);
        setBgColor(
            localStorage.getItem(Storage.bgColor) ?? variables.bgColorPrimary
        );
        setFontColor(
            localStorage.getItem(Storage.fontColor) ??
                variables.fontColorPrimary
        );
    }, []);

    const save = () => {
        localStorage.setItem(Storage.bgColor, bgColor);
        localStorage.setItem(Storage.fontColor, fontColor);
        document.body.style.backgroundColor = bgColor;
        document.body.style.color = fontColor;
        setShow(false);
    };

    return (
        <div>
            <button className="btn shadow-none" onClick={showSettings} data-toggle="modal" style={style}>
                <FontAwesomeIcon size="2x" icon={faCog} />
            </button>
            <Modal show={show} title="Settings" onClose={close} onSave={save}>
                <div className="form-group spacing-outer-bottom">
                    <label
                        htmlFor="bg-selector"
                        className="spacing-outer-bottom"
                    >
                        Background color
                    </label>
                    <HexColorPicker
                        color={bgColor}
                        onChange={setBgColor}
                        style={pickerStyles}
                    />
                    <HexColorInput
                        color={bgColor}
                        className="form-control"
                        onChange={setBgColor}
                        id="bg-selector"
                        required
                    />
                </div>
                <div className="form-group">
                    <label
                        htmlFor="fontcolor-selector"
                        className="spacing-outer-bottom"
                    >
                        Font color
                    </label>
                    <HexColorPicker
                        color={fontColor}
                        onChange={setFontColor}
                        style={pickerStyles}
                    />
                    <HexColorInput
                        color={fontColor}
                        className="form-control"
                        onChange={setFontColor}
                        id="fontcolor-selector"
                        required
                    />
                </div>
            </Modal>
        </div>
    );
}
