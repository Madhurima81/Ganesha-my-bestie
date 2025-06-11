import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

// Create the context
const AudioContext = createContext();

// Provider Component
function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const audioRef = useRef(null);
  
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  const playSound = (soundSource, options = {}) => {
    const { volume = 1.0, loop = false, onEnd = null } = options;
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = soundSource;
      audioRef.current.volume = volume;
      audioRef.current.loop = loop;
      
      if (onEnd && typeof onEnd === 'function') {
        audioRef.current.onended = onEnd;
      }
      
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setCurrentSound(soundSource);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    }
  };
  
  const stopSound = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentSound(null);
    }
  };
  
  return (
    <AudioContext.Provider value={{
      isPlaying,
      currentSound,
      playSound,
      stopSound
    }}>
      {children}
    </AudioContext.Provider>
  );
}

// Custom Hook
function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

export { AudioProvider, useAudio, AudioContext };