import React, { Fragment, useState, useEffect, useCallback, useRef } from "react";
import defaultPicture from "./defaultImage.jpg"
import MediaSession, {useMediaMeta} from "./MediaSession";  

export const TRACK_DEFAULT = {
	name: "Track Name",
	artist: "Artist",
	image: defaultPicture,
	path: undefined
}

const DEFAULT_TIME = "00:00";
// TODO add mediasession (either mine or from npm); add loop, repeat options	
function Player({ track, ...other }) {

	let intervalID = useRef(null); //to state
	let volumeSlider = useRef();
	let seekSlider = useRef();
	const {onNextTrack, onPreviousTrack} = other;
	const audioPlayer = useRef(new Audio());
	const [trackIndex, setTrackIndex] = useState(-1);
	const [trackCount, setTrackCount] = useState(0);
	const [currentTrack, setCurrentTrack] = useState(TRACK_DEFAULT);
	const [isPlaying, setPlaying] = useState(false);
	const [currentTime, setTime] = useState(DEFAULT_TIME);
	const [trackDuration, setTrackDurationState] = useState(DEFAULT_TIME);

	useEffect(() => {
		let player = audioPlayer.current;
		player.addEventListener('ended', onNextTrackHandle);
		other.setPlay(onPlay);
		return () => {
			player.removeEventListener('ended', onNextTrackHandle);
			onStopTrack();
			resetTrackDisplay();
			player.removeAttribute('src');
			player.load();
		};
	}, []);

	const onPause = useCallback(() => {
		audioPlayer.current.pause();
		clearInterval(intervalID.current);
		setPlaying(false); 
	}, [audioPlayer, intervalID]);

	useEffect(() => {
		let wasPlaying = isPlaying;
		onPause();
		resetTrackDisplay();
		setCurrentTrack(track);
		setTrackIndex(other.trackIndex);
		if (track.path === undefined) {
			audioPlayer.current.removeAttribute('src');
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useMediaMeta(TRACK_DEFAULT);
		} 
		else {
			audioPlayer.current.src = track.path;
			// eslint-disable-next-line react-hooks/rules-of-hooks
			useMediaMeta(track);
		}
		audioPlayer.current.load()
		setTrackDuration();
		if (wasPlaying && other.trackIndex >= 0) onPlay();
	}, [audioPlayer, onPause, track, other.trackIndex]);

	useEffect(() => {
		setTrackCount(other.trackCount);
	}, [other.trackCount]);

	const onPlay = useCallback(() => {
		let trackInterval = setInterval(setTrackDuration, 1000);
		setPlaying(true);
		audioPlayer.current.play()
		intervalID.current = trackInterval;
	},[audioPlayer, intervalID]);

	const onStopTrack = useCallback(() => {
		onPause();
		audioPlayer.current.currentTime = 0;
		seekSlider.current.value = 0;
		setTime(DEFAULT_TIME);
	},[audioPlayer, onPause]);

	const resetTrackDisplay = () => {
		audioPlayer.current.currentTime = 0;
		seekSlider.current.value = 0;
		setCurrentTrack(TRACK_DEFAULT);
		setTrackDurationState(DEFAULT_TIME);
		setTime(DEFAULT_TIME);
	}

	const onNextTrackHandle = useCallback(() => {
		onNextTrack();
	}, [onNextTrack]);

	const onPreviousTrackHandle = useCallback(() => {
		onPreviousTrack();
	}, [onPreviousTrack]);

	const playpauseTrack = () => {
		if (audioPlayer.current.src) {
			if (isPlaying) onPause();
			else onPlay();
		}
	}

	/** Calculate the seek position by the percentage of the seek slider 
	 * and get the relative duration to the track
	 */
	const seektTo = () => {
	
    	let seekto = audioPlayer.current.duration * (seekSlider.current.value / 100);
    	// Set the current track position to the calculated seek position 
    	audioPlayer.current.currentTime = seekto;
		if (!isPlaying) {
			let currentTimeString = timeToString(seekto);
			setTime(currentTimeString);
		}
	}

	const onVolumeChange = () => {
		audioPlayer.current.volume = volumeSlider.current.value / 100;
	}

	/** Converts time in seconds to string.
	 * 
	 * @param {number} time 
	 * @returns String representing time in mm:ss format
	 */
	const timeToString = (time) => {
		let currentMinutes = Math.floor(time / 60);
		let currentSeconds = Math.floor(time - currentMinutes * 60);
		let currentTimeString = currentMinutes.toString().padStart(2, "0") + ":" + currentSeconds.toString().padStart(2, "0");
		return currentTimeString;	
	}

	const setTrackDuration = () => {
		let seekPosition = 0;

		// Check if the current track duration is a legible number 
		if (!isNaN(audioPlayer.current.duration)) {
			let duration = audioPlayer.current.duration;
			let currentTime = audioPlayer.current.currentTime;

			seekPosition = currentTime * (100 / duration);
			seekSlider.current.value = seekPosition;

			let currentTimeString = timeToString(currentTime);
			let trackDurationString = timeToString(duration);

			setTrackDurationState(trackDurationString);
			setTime(currentTimeString);
		}
	}

	return (<Fragment>
		<MediaSession 
			onPlay={onPlay} 
			onPause={onPause} 
			onNextTrack={onNextTrackHandle} 
			onPreviousTrack={onPreviousTrackHandle}
			onStop={onStopTrack}
			></MediaSession>
		{/* Define the section for displaying details */}
		<audio ref={audioPlayer}></audio>
		<div className="details">
			<div className="now-playing">{`PLAYING ${trackIndex + 1} OF ${trackCount}`}</div>
			<img src={currentTrack.image} className="track-art" alt="Track art"></img>
			<div className="track-name" title={currentTrack.name}>{currentTrack.name}</div>
			<div className="track-artist">{currentTrack.artist}</div>
		</div>

		{/* Define the section for displaying track buttons */}
		<div className="buttons">
			<div className="prev-track" onClick={onPreviousTrackHandle}>
				<i className="fa fa-step-backward fa-2x"></i>
			</div>
			<div className="playpause-track" onClick={playpauseTrack}>
				<i className={`fa fa-5x ${isPlaying ? "fa-pause-circle" : "fa-play-circle"}`}></i>
			</div>
			<div className="next-track" onClick={onNextTrackHandle}>
				<i className="fa fa-step-forward fa-2x"></i>
			</div>
			<div className="stop-track" onClick={onStopTrack}>
				<i className="fa fa-stop-circle fa-2x"></i>
			</div>
		</div>

		{/* Define the section for displaying the seek slider*/}
		<div className="slider_container">
			<div className="current-time">{currentTime}</div>
			<input id="seekSlider" ref={seekSlider} type="range" min="1" max="100" defaultValue="1" className="seek_slider" onChange={seektTo}></input>
			<div className="total-duration">{trackDuration}</div>
		</div>

		{/* Define the section for displaying the volume slider*/}
		<div className="slider_container">
			<i className="fa fa-volume-down"></i>
			<input ref={volumeSlider} type="range" min="1" max="100" defaultValue="100" className="volume_slider" onChange={onVolumeChange}></input>
			<i className="fa fa-volume-up"></i>
		</div>
	</Fragment>);
}

export default Player;
