import React, { memo, Fragment, useState, useEffect } from 'react';
import defaultImage from "./defaultImage.jpg";
import ProgressBar from './ProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPlusSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export function Playlist(props) {
    const {onRemove, onLoad} = props;
    const [playlist, setPlaylist] = useState([]);
    const [mutag] = useState(window.mutag);
    const [showProgress, setShowProgress] = useState(false);
    let [trackIndex, setTrackIndex] = useState(-1);
  
    useEffect(() => {
        setTrackIndex(props.trackIndex);
    }, [props.trackIndex]);

    useEffect(()=>{
        onLoad(playlist);
    }, [playlist, onLoad]);

    const clearPlaylist = () =>{
        playlist.forEach(track => {
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
            event.target.value = '';
            setShowProgress(false);
        });
    }

    // TODO rebuild to return list of promises and await for all of them
    async function loadFileToPlaylist(files) {
        let playlistArray = [];
        for (const file of files) {
            await mutag.fetch(file).then(tags => {
                let newTrack = {
                    name: tags.TIT2 ? tags.TIT2 : file.name,
                    artist: tags.TPE1,
                    path: window.URL.createObjectURL(file),
                    image: tags.APIC ? window.URL.createObjectURL(tags.APIC) : window.URL.createObjectURL({ defaultImage })
                }
                if (tags.TALB) newTrack.album = tags.TALB;
                playlistArray.push(newTrack);
            }).catch(error => {
                alert(error);
                let newTrack = {
                    name: file.name,
                    path: window.URL.createObjectURL(file),
                    image: window.URL.createObjectURL({ defaultImage })
                }
                playlistArray.push(newTrack);
            })
        }
        setPlaylist([...playlist, ...playlistArray]);
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

    return (<Fragment>
        <ProgressBar show={showProgress}/>
        <div className="buttons d-flex justify-content-center">
            <div className="list-button">
                <input id="addNewFile"
                    type="file"
                    accept="audio/*"
                    className="inputfile d-none"
                    multiple
                    onChange={addNewFile}></input>
                <label htmlFor="addNewFile" >
                    <FontAwesomeIcon size='4x' icon={faPlusSquare}  />
                </label>
            </div>
            <div className="list-button" onClick={clearPlaylist}>
                <FontAwesomeIcon size='4x' icon={faTrashAlt}  />
            </div>
        </div>
        <ul id="music-list" className="playlist container" >
            {playlist.map((item, index) => {
                return buildTrackItem(item, index, trackIndex, deleteListItem, playListItem);
            })}
        </ul>
    </Fragment>
    )
}

function buildTrackItem(track, index, activeIndex, deleteHandle, playHandle) {
    return (<li className={`playlist-item ${activeIndex === index ? " active" : ""}`}
        key={index}
        value={index}>
        <div className="row align-items-center">
            <div className="col-3 playlist-item-image">
                <img src={track.image} alt={track.name} />
            </div>
            <div className="col-7 playlist-item-details">
                <h4 className="text-wrap">{track.name}</h4>
                <h5 className="text-wrap">{track.artist}</h5>
            </div>
            <div className="col-2 playlist-item-button d-flex flex-column">
                <button className="player-button" aria-label="play" value={index} onClick={()=>playHandle(index)}>
                    <FontAwesomeIcon size='2x' icon={faPlayCircle}  />
                </button>
                <button className="player-button" aria-label="delete" value={index} onClick={()=>deleteHandle(index)}>
                    <FontAwesomeIcon size='2x' icon={faTrashAlt}  />
                </button>
            </div>
        </div>
    </li>);
}

export default memo(Playlist);