import { useState, useEffect, useRef } from 'react';

/**
 * useAudio - Custom hook for audio playback control
 * 
 * @param {string} src - URL of the audio file
 * @param {Object} options - Audio options
 * @param {boolean} options.autoPlay - Whether to auto-play the audio
 * @param {boolean} options.loop - Whether to loop the audio
 * @param {number} options.volume - Volume level (0-1)
 * @param {function} options.onEnded - Callback when audio ends
 * @returns {Object} Audio controls and state
 */
const useAudio = (src, {
  autoPlay = false,
  loop = false,
  volume = 1,
  onEnded = () => {}
} = {}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoaded, setIsLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState(null);
  
  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(src);
    
    // Set up audio properties
    audio.autoplay = autoPlay;
    audio.loop = loop;
    audio.volume = volume;
    
    // Set up event listeners
    const handleCanPlay = () => {
      setIsLoaded(true);
      setDuration(audio.duration);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded();
    };
    
    const handleError = (e) => {
      setError(`Error loading audio: ${e.message}`);
    };
    
    // Add event listeners
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Save reference
    audioRef.current = audio;
    
    // Clean up
    return () => {
      audio.pause();
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [src, autoPlay, loop, volume, onEnded]);
  
  // Play audio
  const play = () => {
    if (audioRef.current && isLoaded) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          setError(`Failed to play: ${err.message}`);
        });
    }
  };
  
  // Pause audio
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  // Toggle play/pause
  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };
  
  // Set current time (seek)
  const seek = (time) => {
    if (audioRef.current && isLoaded) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  // Set volume
  const setAudioVolume = (level) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(1, Math.max(0, level));
    }
  };
  
  return {
    isPlaying,
    isLoaded,
    duration,
    currentTime,
    error,
    play,
    pause,
    toggle,
    seek,
    setVolume: setAudioVolume
  };
};

export default useAudio;