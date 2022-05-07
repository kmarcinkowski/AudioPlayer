import Modal from "./Modal";
import { useCallback, useState } from "react";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const style = {
    position: "absolute",
    top: "10px",
};

export default function SettingsModal(props) {
    const [show, setShow] = useState(false);

    const showSettings = () => {
        setShow(true);
    };

    const close = useCallback(() => {
        setShow(false);
    }, []);

    return (
        <div>
            <button
                onClick={showSettings}
                data-toggle="modal"
                className="btn btn-large"
                style={style}
            >
                <FontAwesomeIcon size="2x" icon={faCog} />
            </button>
            <Modal show={show} title="Settings" onClose={close}>
                Soon...
            </Modal>
        </div>
    );
}
