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
    // const getPlaylists =  useLiveQuery(() => db.playlists.toArray());
    const storage = useLiveQuery(() => db.playlists.toArray());
    const playlistName = useRef({ name: "" });

    const close = useCallback(() => {
        playlistName.current = { name: "" };
        setShow(false);
        setAdd(false);
    }, []);

    const removePlaylist = (index) => {
        db.playlists.delete(index);
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
            <Dropdown label={<FontAwesomeIcon size="4x" icon={faEllipsisV} />}>
                <li
                    key="add"
                    className="dropdown-item"
                    onClick={() => setAdd(true)}
                >
                    Add new
                </li>
                <li
                    key="manage"
                    className="dropdown-item"
                    onClick={() => setShow(true)}
                >
                    Manage playlists
                </li>
            </Dropdown>
            <Modal show={show} title="Playlists" onClose={close}>
                <div className="form-group spacing-outer-bottom"></div>
                <div>
                    {storage?.map((playlist) => (
                        <div key={playlist.id}>
                            <div>{playlist.name}</div>
                            <button onClick={() => removePlaylist(playlist.id)}>
                                Remove
                            </button>
                            <button
                                onClick={() => {
                                    props.onPlaylistLoad(playlist.tracks);
                                    close();
                                }}
                            >
                                Load
                            </button>
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
