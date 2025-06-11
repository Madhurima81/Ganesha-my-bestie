// src/components/chant/ChantLearning.jsx
import React, { useState, useRef } from 'react';
import { useGameContext } from '../../context/GameContext';
import './ChantLearning.css';

const ChantLearning = ({ chant, audioSrc, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [practiceMode, setPracticeMode] = useState(false);
  const audioRef = useRef(null);
  const { updateProgress } = useGameContext();
  
  // Handle audio playback and line highlighting
  const handlePlayPause = () => {
    const audio = audioRef.current;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.error('Error playing audio:', e));
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Set up audio time update to highlight current line
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    
    // Find the current line based on audio timestamp
    const lineIndex = chant.lines.findIndex(line => 
      audio.currentTime >= line.startTime && 
      audio.currentTime < line.endTime
    );
    
    if (lineIndex !== -1 && lineIndex !== currentLine) {
      setCurrentLine(lineIndex);
      
      // Update progress
      const progress = Math.round((lineIndex / (chant.lines.length - 1)) * 100);
      updateProgress('chant', progress);
    }
  };
  
  // Handle audio ended
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentLine(0);
    
    // If in practice mode, consider it complete
    if (practiceMode) {
      onComplete && onComplete();
    }
  };
  
  // Toggle practice mode
  const togglePracticeMode = () => {
    setPracticeMode(!practiceMode);
    setCurrentLine(0);
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  return (
    <div className="chant-learning-container">
      <h2>{chant.title}</h2>
      
      <div className="chant-content">
        {chant.lines.map((line, index) => (
          <div 
            key={index}
            className={`chant-line ${currentLine === index ? 'active' : ''} ${practiceMode && index < currentLine ? 'completed' : ''}`}
            onClick={() => {
              if (practiceMode) {
                setCurrentLine(index);
              }
            }}
          >
            <div className="original-text">{line.text}</div>
            <div className="translation">{line.translation}</div>
          </div>
        ))}
      </div>
      
      <audio 
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />
      
      <div className="chant-controls">
        <button className="mode-button" onClick={togglePracticeMode}>
          {practiceMode ? 'Listen Mode' : 'Practice Mode'}
        </button>
        
        <button className="play-button" onClick={handlePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
};

export default ChantLearning;