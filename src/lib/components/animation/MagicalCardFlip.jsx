// lib/components/animation/MagicalCardFlip.jsx
import React, { useState, useEffect } from 'react';
import './MagicalCardFlip.css';

const MagicalCardFlip = ({
  // Required props
  show = false,
  frontImage = null,
  backImage,
  title,
  stars = 0,
  onClose,
  
  // Optional customization
  frontColor = '#6b4ce6',       // Purple front
  backColor = '#ffd700',        // Gold back
  cardWidth = 300,              // Width in pixels
  cardHeight = 400,             // Height in pixels
  animationDuration = 1500,     // Total animation time in ms
  autoFlip = true,              // Auto flip after delay
  autoFlipDelay = 1200,         // Delay before auto flip
  
  // Audio options
  playSounds = true,
  appearSound = '/assets/sounds/card-appear.mp3',
  flipSound = '/assets/sounds/card-flip.mp3',
  
  // Optional content
  children,
  renderBackContent = null,
}) => {
  // State to track animation stages
  const [animationStage, setAnimationStage] = useState('hidden');
  const [isFlipped, setIsFlipped] = useState(false);
  const [audio, setAudio] = useState(null);
  
  // Play sound effect helper
  const playSound = (src) => {
    if (!playSounds) return;
    
    const sound = new Audio(src);
    sound.play();
    setAudio(sound);
  };
  
  // Handle animation sequence
  useEffect(() => {
    if (show) {
      // Card appears
      setAnimationStage('appear');
      playSound(appearSound);
      
      // Auto flip card after delay if enabled
      let flipTimer;
      if (autoFlip) {
        flipTimer = setTimeout(() => {
          setIsFlipped(true);
          playSound(flipSound);
        }, autoFlipDelay);
      }
      
      // Set final state after animations complete
      const finalTimer = setTimeout(() => {
        setAnimationStage('complete');
      }, animationDuration);
      
      return () => {
        clearTimeout(flipTimer);
        clearTimeout(finalTimer);
      };
    } else {
      setAnimationStage('hidden');
      setIsFlipped(false);
    }
    
    // Cleanup audio on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [show, autoFlip, autoFlipDelay, animationDuration, appearSound, flipSound]);
  
  // Handle manual flip
  const handleFlip = () => {
  if (!isFlipped) {  // ← SIMPLIFIED CONDITION
      setIsFlipped(true);
      playSound(flipSound);
    }
  };
  
  if (!show && animationStage === 'hidden') return null;
  
  return (
    <div className="magical-card-overlay">
      <div 
        className={`magical-card-container stage-${animationStage}`}
        style={{
          '--card-width': `${cardWidth}px`,
          '--card-height': `${cardHeight}px`,
          '--front-color': frontColor,
          '--back-color': backColor,
          '--animation-duration': `${animationDuration / 1000}s`,
        }}
      >
        {/* Card with flip animation */}
        <div 
          className={`magical-card ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <div className="card-face card-front">
            {frontImage ? (
              <img 
                src={frontImage} 
                alt="Card front"
                className="card-image card-front-image"
              />
            ) : (
              <>
                <div className="card-question-mark">?</div>
                <div className="card-subtitle">Tap to reveal</div>
                {children}
              </>
            )}
          </div>
          
          {/* Back of card */}
          <div className="card-face card-back">
            <div className="card-back-content">
              <img 
                src={backImage} 
                alt={title}
                className="card-image card-back-image"
              />
              
              <h2 className="card-title">{title}</h2>
              
              {/* Star rating */}
              <div className="card-stars">
                {Array.from({ length: stars }).map((_, index) => (
                  <div key={index} className="card-star">⭐</div>
                ))}
              </div>
              
              {/* Custom back content if provided */}
              {renderBackContent && renderBackContent()}
              
              {/* Continue button only shown after flip */}
              <button 
                className="card-continue-button"
                onClick={onClose}
              >
                Continue
              </button>
            </div>
          </div>
          
          {/* Magic particles effect */}
          <div className="magic-particles">
            {Array.from({ length: 15 }).map((_, index) => (
              <div 
                key={index} 
                className="particle"
                style={{
                  '--delay': `${Math.random() * 0.5}s`,
                  '--duration': `${1 + Math.random() * 1.5}s`,
                  '--size': `${3 + Math.random() * 7}px`,
                  '--x-pos': `${-50 + Math.random() * 100}%`,
                  '--y-pos': `${-50 + Math.random() * 100}%`,
                  '--color': `hsl(${40 + Math.random() * 40}, 100%, 60%)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagicalCardFlip;