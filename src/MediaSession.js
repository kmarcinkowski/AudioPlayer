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

    useEffect(() => bindActionHandler('play', onPlay), [onPlay, bindActionHandler]);
    useEffect(() => bindActionHandler('pause', onPause), [onPause, bindActionHandler]);
    useEffect(() => bindActionHandler('nexttrack', onNextTrack), [onNextTrack, bindActionHandler]);
    useEffect(() => bindActionHandler('previoustrack', onPreviousTrack), [onPreviousTrack,bindActionHandler]);
    useEffect(() => bindActionHandler('seekbackward', onSeekBackward), [onSeekBackward,bindActionHandler]);
    useEffect(() => bindActionHandler('seekforward', onSeekForward), [onSeekForward,bindActionHandler]);
    useEffect(() => bindActionHandler('seekto', onSeekTo), [onSeekTo,bindActionHandler]);
    useEffect(() => bindActionHandler('skipad', onSkipAd), [onSkipAd, bindActionHandler]);
    useEffect(() => bindActionHandler('stop', onStop), [onStop, bindActionHandler]);

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
  

