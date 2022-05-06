import React, { memo, Fragment, useState, useEffect } from "react";
import defaultImage from "./defaultImage.jpg";
import ProgressBar from "./ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseBlob } from "music-metadata-browser";
import {
    faPlayCircle,
    faPlusSquare,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

export function Playlist(props) {
    const { onRemove, onLoad } = props;
    const [playlist, setPlaylist] = useState([]);
    const [showProgress, setShowProgress] = useState(false);
    let [trackIndex, setTrackIndex] = useState(-1);

    useEffect(() => {
        setTrackIndex(props.trackIndex);
    }, [props.trackIndex]);

    useEffect(() => {
        onLoad(playlist);
    }, [playlist, onLoad]);

    const clearPlaylist = () => {
        playlist.forEach((track) => {
            URL.revokeObjectURL(track.path);
            URL.revokeObjectURL(track.image);
        });
        onRemove();
        setPlaylist([]);
    };

    /** Unmount - clear playlist and remove blobs */
    useEffect(() => {
        return clearPlaylist;
    }, []);

    async function addNewFile(event) {
        var files = event.target.files;
        setShowProgress(true);
        loadFileToPlaylist(files).then(() => {
            event.target.value = "";
            setShowProgress(false);
        });
    }

    async function blobToBase64(blob) {
        const reader = new FileReader();
        return new Promise((resolve, _) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    function _arrayBufferToBase64(bytes) {
        if (!bytes) return null;
        
        let binary = "";
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    async function loadFileToPlaylist(files) {
        let promiseArray = [];
        for (const file of files) {
            const fileBase64 = await blobToBase64(file);
            promiseArray.push(
                new Promise((resolve) => {
                    parseBlob(file).then(meta => {
                        let picture = meta.common.picture ? meta.common.picture[0] : null;
                        let image;
                        if (picture && picture.data){
                            image = _arrayBufferToBase64(picture?.data);
                            image = "data:" +meta.common.picture[0].format + ";base64," + image;
                        }
                        else image = defaultImage;
                        let newTrack = {
                            name: meta.common.title,
                            artist: meta.common.artist ?? meta.common.albumartist,
                            album: meta.common.album,
                            path: fileBase64,
                            image,
                        }
                        resolve(newTrack);
                    })
                    .catch((error) => {
                        alert(error);
                        let newTrack = {
                            name: file.name,
                            path: fileBase64,
                            image: defaultImage,
                        };
                        resolve(newTrack);
                    });
                })
            );
        }
        await Promise.all(promiseArray).then((tracks) => {
            setPlaylist([...playlist, ...tracks]);
        });
    }

    function playListItem(index) {
        setTrackIndex(index); //probably unnecessary since on parent rerender, current index will be given
        props.onPlay(index);
    }

    function deleteListItem(index) {
        if (trackIndex === index) {
            onRemove();
        }
        URL.revokeObjectURL(playlist[index].path);
        URL.revokeObjectURL(playlist[index].image);
        let newPlaylist = [...playlist];
        newPlaylist.splice(index, 1);
        if (index < trackIndex) setTrackIndex(trackIndex--);
        setPlaylist(newPlaylist);
    }

    return (
        <Fragment>
            <ProgressBar show={showProgress} />
            <div className="buttons d-flex justify-content-center">
                <div className="list-button">
                    <input
                        id="addNewFile"
                        type="file"
                        accept="audio/*"
                        className="inputfile d-none"
                        multiple
                        onChange={addNewFile}
                    ></input>
                    <label htmlFor="addNewFile">
                        <FontAwesomeIcon size="4x" icon={faPlusSquare} />
                    </label>
                </div>
                <div className="list-button" onClick={clearPlaylist}>
                    <FontAwesomeIcon size="4x" icon={faTrashAlt} />
                </div>
            </div>
            <ul id="music-list" className="playlist container">
                {playlist.map((item, index) => {
                    return buildTrackItem(
                        item,
                        index,
                        trackIndex,
                        deleteListItem,
                        playListItem
                    );
                })}
            </ul>
        </Fragment>
    );
}

function buildTrackItem(track, index, activeIndex, deleteHandle, playHandle) {
    return (
        <li
            className={`playlist-item ${
                activeIndex === index ? " active" : ""
            }`}
            key={index}
            value={index}
        >
            <div className="row align-items-center">
                <div className="col-3 playlist-item-image">
                    <img src={track.image} alt={track.name} />
                </div>
                <div className="col-7 playlist-item-details">
                    <h4 className="text-wrap">{track.name}</h4>
                    <h5 className="text-wrap">{track.artist}</h5>
                </div>
                <div className="col-2 playlist-item-button d-flex flex-column">
                    <button
                        className="player-button"
                        aria-label="play"
                        value={index}
                        onClick={() => playHandle(index)}
                    >
                        <FontAwesomeIcon size="2x" icon={faPlayCircle} />
                    </button>
                    <button
                        className="player-button"
                        aria-label="delete"
                        value={index}
                        onClick={() => deleteHandle(index)}
                    >
                        <FontAwesomeIcon size="2x" icon={faTrashAlt} />
                    </button>
                </div>
            </div>
        </li>
    );
}

export default memo(Playlist);
