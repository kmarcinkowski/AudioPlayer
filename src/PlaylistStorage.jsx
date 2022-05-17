import { Fragment, useCallback, useRef, useState } from "react";
import { db } from "./DBController";
import { useLiveQuery } from "dexie-react-hooks";
import Modal from "./Modal";
import Dropdown from "./Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

export default function PlaylistStorage(props) {
    const [show, setShow] = useState(false);
    const [add, setAdd] = useState(false);
    const storage = useLiveQuery(() => db.playlists.toArray());
    const playlistName = useRef({ name: "" });

    const close = useCallback(() => {
        playlistName.current = { name: "" };
        setShow(false);
        setAdd(false);
    }, []);

    const removePlaylist = (index) => {
        let decision = window.confirm(
            "Are you sure you want to remove this playlist?"
        );
        if (decision) db.playlists.delete(index);
    };

    const handleChange = (event) => {
        let newState = Object.assign({}, playlistName.current);
        newState[event.target.name] = event.target.value;
        playlistName.current = newState;
    };

    const newPlaylist = () => {
        db.playlists.add({
            name: playlistName.current.name,
            tracks: props.playlist,
        });
        close();
    };

    return (
        <Fragment>
            <Dropdown
                className="list-button"
                label={<FontAwesomeIcon size="4x" icon={faEllipsisV} />}
            >
                <li className="dropdown-item" onClick={() => setAdd(true)}>
                    Add new
                </li>
                <li className="dropdown-item" onClick={() => setShow(true)}>
                    Manage playlists
                </li>
            </Dropdown>
            <Modal
                show={show}
                title="Playlists"
                onClose={close}
                closeLabel="Close"
            >
                <div className="form-group spacing-outer-bottom"></div>
                <div>
                    {storage?.map((playlist) => (
                        <div key={playlist.id} className="d-flex">
                            <div className="me-auto">{playlist.name}</div>
                            <div className="btn-group">
                                <button
                                    className="btn btn-danger"
                                    onClick={() => removePlaylist(playlist.id)}
                                >
                                    Remove
                                </button>
                                <button
                                    className="btn btn-info"
                                    onClick={() => {
                                        props.onPlaylistLoad(playlist.tracks);
                                        close();
                                    }}
                                >
                                    Load
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
            <Modal
                show={add}
                title="Add new"
                onClose={close}
                onSave={newPlaylist}
            >
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        className="form-control"
                        name="name"
                        onChange={handleChange}
                    />
                </div>
            </Modal>
        </Fragment>
    );
}
