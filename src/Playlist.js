import React, { memo, Fragment, useState, useEffect } from 'react';
import defaultImage from "./defaultImage.jpg";

export function Playlist(props) {
    const {onRemove, onLoad} = props;
    const [playlist, setPlaylist] = useState([]);
    const [mutag] = useState(window.mutag);
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
        loadFileToPlaylist(files).then(() => {
            event.target.value = '';
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

    function playListItem(event) {
        let index = parseInt(event.target.value);
        if (event.target.ariaLabel === "play") {
            setTrackIndex(index); //probably unnecessary since on parent rerender, current index will be given
            props.onPlay(index);
        } else if (event.target.ariaLabel === "delete") deleteListItem(index);
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
        <div className="buttons d-flex justify-content-center">
            <div className="list-button">
                <input id="addNewFile"
                    type="file"
                    accept="audio/*"
                    className="inputfile d-none"
                    multiple
                    onChange={addNewFile}></input>
                <label htmlFor="addNewFile" ><i className="fas fa-plus-square fa-4x"></i></label>
            </div>
            <div className="list-button" onClick={clearPlaylist}>
                <i className="far fa-trash-alt fa-4x"></i>
            </div>
        </div>
        <ul id="music-list" className="playlist container" onClickCapture={playListItem}>
            {playlist.map((item, index) => {
                return buildTrackItem(item, index, trackIndex);
            })}
        </ul>
    </Fragment>
    )

}

// todo: instead of event on ul, give event on each button; make into component and use memo for list rerender
function buildTrackItem(track, index, activeIndex) {
    return (<li className={`playlist-item ${activeIndex === index ? " active" : ""}`}
        key={index}
        value={index}>
        <div className="row">
            <div className="col-3 playlist-item-image">
                <img src={track.image} alt={track.name} />
            </div>
            <div className="col-7 playlist-item-details">
                <h4 className="text-wrap">{track.name}</h4>
                <h5 className="text-wrap">{track.artist}</h5>
            </div>
            <div className="col-2 playlist-item-button d-flex flex-column">
                <button className="player-button far fa-play-circle fa-2x" aria-label="play" value={index}></button>
                <button className="player-button far fa-trash-alt fa-2x" aria-label="delete" value={index}></button>
            </div>
        </div>
    </li>);
}

export default memo(Playlist);