// lib/components/animation/PopupBookPage.jsx
import React, { useState, useEffect } from 'react';
import './PopupBookPage.css';

const PopupBookPage = ({
  // Required props
  show = false,
  symbolImage,
  title,
  description,
  onClose,
  
  // Optional customization
  backgroundColor = '#f9f3e5', // Papyrus color
  accentColor = '#ffd700',     // Gold accent
  popupHeight = 150,           // Height the element pops up in pixels
  animationDuration = 1200,    // Total animation time in ms
  backgroundImage = null,      // Optional background image
  
  // Audio options
  playSounds = true,
  openSound = '/assets/sounds/page-open.mp3',
  popSound = '/assets/sounds/popup.mp3',
  
  // Optional render props
  renderAdditionalContent = null,
}) => {
  // State to track animation stages
  const [animationStage, setAnimationStage] = useState('closed');
  const [audio, setAudio] = useState(null);
  
  // Play sound effect helper
  const playSound = (src) => {
    if (!playSounds) return;
    
    const sound = new Audio(src);
    sound.play();
    setAudio(sound);
  };
  
  // Animation sequence
  useEffect(() => {
    if (show) {
      // Start page opening
      setAnimationStage('opening');
      playSound(openSound);
      
      // Sequence of animations
      const pageOpenTimer = setTimeout(() => {
        setAnimationStage('page-open');
        
        // Start popup animation after page is open
        const popupTimer = setTimeout(() => {
          setAnimationStage('popping-up');
          playSound(popSound);
          
          // Complete animation
          const completeTimer = setTimeout(() => {
            setAnimationStage('complete');
          }, animationDuration / 3);
          
          return () => clearTimeout(completeTimer);
        }, animationDuration / 3);
        
        return () => clearTimeout(popupTimer);
      }, animationDuration / 3);
      
      return () => clearTimeout(pageOpenTimer);
    } else {
      setAnimationStage('closed');
    }
    
    // Cleanup audio on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [show, animationDuration, openSound, popSound, playSounds]);
  
  if (!show && animationStage === 'closed') return null;
  
  return (
    <div className="popup-book-overlay">
      <div 
        className="popup-book-container"
        style={{ backgroundColor }}
      >
        {/* Left page - static */}
        <div className="popup-book-page left-page">
          {backgroundImage && (
            <img 
              src={backgroundImage} 
              alt="Background"
              className="page-background-image"
            />
          )}
        </div>
        
        {/* Right page - animates open */}
        <div className={`popup-book-page right-page stage-${animationStage}`}>
          <div className="page-content">
            <h2 className="popup-title">{title}</h2>
            
            <div className="popup-image-container">
              {/* Main popup element */}
              <div 
                className={`popup-element stage-${animationStage}`}
                style={{ 
                  '--popup-height': `${popupHeight}px`,
                  '--accent-color': accentColor,
                }}
              >
                <img 
                  src={symbolImage} 
                  alt={title}
                  className="popup-symbol-image"
                />
                
                {/* 3D sides of the popup element */}
                <div className="popup-sides">
                  <div className="popup-side left-side"></div>
                  <div className="popup-side right-side"></div>
                  <div className="popup-side bottom-side"></div>
                  <div className="popup-side top-side"></div>
                </div>
                
                {/* Shadow that grows as element pops up */}
                <div className="popup-shadow"></div>
              </div>
            </div>
            
            <div className="popup-description">
              <p>{description}</p>
            </div>
            
            {/* Optional additional content */}
            {renderAdditionalContent && renderAdditionalContent()}
            
            {/* Continue button */}
            <button 
              className={`popup-continue-button stage-${animationStage}`}
              onClick={onClose}
              disabled={animationStage !== 'complete'}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupBookPage;