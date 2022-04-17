import { useCallback, useEffect, useState } from "react";


// interface MediaSessionHandleOptions {
//     onPlay ? : () => void;
//     onPause ? : () => void;
//     onSeekBackward ? : () => void;
//     onSeekForward ? : () => void;
//     onPreviousTrack ? : () => void;
//     onNextTrack ? : () => void;
//     onSeekTo ? : () => void;
//     onSkipAd ? : () => void;
//     onStop ? : () => void;
// }

export default function MediaSession(handlers) {
    const {
        onPlay,
        onPause,
        onSeekBackward,
        onSeekForward,
        onPreviousTrack,
        onNextTrack,
        onSeekTo,
        onSkipAd,
        onStop,
    } = handlers;

    const [isMediaSessionAvailable] = useState(
        window !== 'undefined' && ('mediaSession' in window.navigator)
    )

    const [mediaSession] = useState(window.navigator.mediaSession);
    
    const bindActionHandler = useCallback((action, callback) => {
        if (!isMediaSessionAvailable || !callback)
            return;

        mediaSession.setActionHandler(action, callback);
    
        return () => {
            mediaSession.setActionHandler(action, null);
        };
    },[isMediaSessionAvailable, mediaSession]);

    useEffect(() => bindActionHandler('play', onPlay), [onPlay]);
    useEffect(() => bindActionHandler('pause', onPause), [onPause]);
    useEffect(() => bindActionHandler('nexttrack', onNextTrack), [onNextTrack]);
    useEffect(() => bindActionHandler('previoustrack', onPreviousTrack), [onPreviousTrack,]);
    useEffect(() => bindActionHandler('seekbackward', onSeekBackward), [onSeekBackward,]);
    useEffect(() => bindActionHandler('seekforward', onSeekForward), [onSeekForward,]);
    useEffect(() => bindActionHandler('seekto', onSeekTo), [onSeekTo]);
    useEffect(() => bindActionHandler('skipad', onSkipAd), [onSkipAd]);
    useEffect(() => bindActionHandler('stop', onStop), [onStop]);

    return;
};

export const useMediaMeta = ({
    name,
    album,
    artist,
    image,
  }) => {      
      
      window.navigator.mediaSession.metadata = new MediaMetadata({
        title: name,
        album,  
        artist,
        artwork:[{
            src: image,
            sizes: '500x500'
        }]
      });
  };
  

