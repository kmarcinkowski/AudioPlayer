import React from "react";
import Player, { TRACK_DEFAULT } from "./Player";
import Playlist from "./Playlist";

class PlayerContainer extends React.Component {

    listRef;
    playerRef;

    constructor(props) {
        super(props);
        this.playlistLoadHandler = this.playlistLoaded.bind(this);
        this.playTrackHandler = this.playTrack.bind(this);
        this.stopTrackHandler = this.stopTrack.bind(this);
        this.nextTrackHandler = this.nextTrack.bind(this);
        this.previousTrackHandler = this.previousTrack.bind(this);
        this.state = {
            playList: [],
            currentTrackIndex: -1,
            currentTrack: TRACK_DEFAULT,
            trackCount: 0,
        };
    };

    playlistLoaded(playlist) {
        if (this.state.currentTrackIndex === -1 && 
            this.state.playList.length === 0 &&
            playlist.length !== 0)
            this.setState({
                playList: playlist, 
                currentTrackIndex: 0,
                currentTrack: playlist[0],
                trackCount: playlist.length,

            })
        else 
            this.setState({ 
                ...this.state, 
                playList: playlist, 
                trackCount: playlist.length
            })
    };

    playTrack(index) {
        this.setPlayTrack(index);
        this.setPlay();
    }

    setPlayTrack(index) {
        this.setState({
            ...this.state,
            currentTrack: this.state.playList[index],
            currentTrackIndex: index
        });
    }

    stopTrack(index) {
        this.setState({
            ...this.state,
            currentTrack: TRACK_DEFAULT,
            currentTrackIndex: -1
        })
    }

    nextTrack(){
        let nextIndex = this.state.currentTrackIndex + 1;
        if (nextIndex === this.state.trackCount) 
            this.setPlayTrack(0)
        else this.setPlayTrack(nextIndex);
    }

    previousTrack(){
        let previousIndex = this.state.currentTrackIndex - 1;
        if (previousIndex > -1) 
            this.setPlayTrack(previousIndex);
        else this.setPlayTrack(this.state.trackCount - 1)
    }

    render() {
        return (
        <div className="container-fluid">
            <div className="row">
                <div className="player col-xl-8 col-lg-6 col-md-12">
                    <Player
                        track={this.state.currentTrack}
                        trackCount={this.state.trackCount}
                        trackIndex={this.state.currentTrackIndex} 
                        onPreviousTrack={this.previousTrackHandler}
                        onNextTrack={this.nextTrackHandler}
                        setPlay={param => this.setPlay = param}/>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12" style={{ paddingRight: "0px" }}>
                    <Playlist
                        trackIndex={this.state.currentTrackIndex}
                        onLoad={this.playlistLoadHandler}
                        onPlay={this.playTrackHandler}
                        onRemove={this.stopTrackHandler} />
                </div>
            </div>
        </div>
        )
    }
}

export default PlayerContainer;