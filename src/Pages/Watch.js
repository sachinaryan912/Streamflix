import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Watch.css'; // Import the CSS file for styling

const Watch = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const videoKey = queryParams.get('key'); // Get the key from the query params

  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [seekBarValue, setSeekBarValue] = useState(0);
  const [flag,setFlag]=useState(false);
  useEffect(()=>{
    setTimeout(()=>{setFlag(!flag)},3000)
  },[])

  useEffect(() => {
    console.log("useeffect running");
    
    // Load the IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: videoKey, 
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          fs: 0,
          iv_load_policy: 3,
          autoplay: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    };
    // onPlayerReady();
    
  }, [videoKey,flag]);

  const onPlayerReady = (event) => {
    event.target.playVideo();
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const toggleMuteUnmute = () => {
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const handleSeekBarChange = (e) => {
    const value = e.target.value;
    setSeekBarValue(value);
    const duration = playerRef.current.getDuration();
    const seekTime = duration * (value / 100);
    playerRef.current.seekTo(seekTime);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        // Check if the player object is defined and has the methods
        const currentTime = playerRef.current.getCurrentTime
          ? playerRef.current.getCurrentTime()
          : 0; // Default to 0 if the method is not available
        const duration = playerRef.current.getDuration
          ? playerRef.current.getDuration()
          : 0; // Default to 0 if the method is not available
        
        if (duration > 0) {
          setSeekBarValue((currentTime / duration) * 100);
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
}, []);

  return (
    <div className="video-container">
      <div id="player"></div>
      <button className="playPause" onClick={togglePlayPause}>
        {isPlaying ? (
          <i className="fas fa-pause"></i>
        ) : (
          <i className="fas fa-play"></i>
        )}
      </button>
      <div className="seek-bar">
        <input
          type="range"
          value={seekBarValue}
          onChange={handleSeekBarChange}
          step="1"
          min="0"
        />
      </div>
      <button className="button muteButton" onClick={toggleMuteUnmute}>
        {isMuted ? (
          <i className="fas fa-volume-mute"></i>
        ) : (
          <i className="fas fa-volume-up"></i>
        )}
      </button>
    </div>
  );
};

export default Watch;
