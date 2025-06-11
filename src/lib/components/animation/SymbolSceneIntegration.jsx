// lib/components/animation/SymbolSceneIntegration.jsx
import React, { useState, useEffect, useRef } from 'react';
import './SymbolSceneIntegration.css';

const SymbolSceneIntegration = ({
  // Required props
  show = false,
  symbolImage,
  title,
  description,
  sourceElement, // The element that triggered this (e.g., 'lotus', 'elephant')
  onClose,
  
  // Optional customization
  animationDuration = 2500,
  symbolScale = 1.5, // How much larger the symbol grows
  glowColor = '#ffd700', // Gold glow
  particleCount = 20,
  
  // Audio options
  playSounds = true,
  growSound = '/assets/sounds/symbol-grow.mp3',
  completeSound = '/assets/sounds/symbol-complete.mp3',
}) => {
  const [animationStage, setAnimationStage] = useState('hidden');
  const [sourcePosition, setSourcePosition] = useState({ x: 0, y: 0 });
  const symbolRef = useRef(null);
  
  // Find the source element and get its position
  useEffect(() => {
    if (show && sourceElement) {
      // Find the element that triggered this
      const element = document.querySelector(`.${sourceElement}`) || 
                     document.querySelector(`#${sourceElement}`) ||
                     document.querySelector(`[data-element="${sourceElement}"]`);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        setSourcePosition({
          x: centerX,
          y: centerY
        });
      }

      
      
      // Start animation sequence
      playSound(growSound);
      setAnimationStage('emerging');
      
      // Animation sequence
      const emergeTimer = setTimeout(() => {
        setAnimationStage('growing');
        
        const growTimer = setTimeout(() => {
          setAnimationStage('floating');
          playSound(completeSound);
          
          const floatTimer = setTimeout(() => {
            setAnimationStage('complete');
          }, animationDuration / 3);
          
          return () => clearTimeout(floatTimer);
        }, animationDuration / 3);
        
        return () => clearTimeout(growTimer);
      }, animationDuration / 3);
      
      return () => clearTimeout(emergeTimer);
    }
  }, [show, sourceElement, animationDuration]);

  // Second useEffect (NEW - separate and outside)
useEffect(() => {
  if (!show) {
    setAnimationStage('hidden');
  }
}, [show]);

  
  const playSound = (src) => {
    if (!playSounds || !src) return;
    const audio = new Audio(src);
    audio.play();
  };
  
if (!show) return null;

  return (
    <div className="symbol-scene-integration-overlay">
      {/* Background overlay */}
      <div 
        className={`integration-background stage-${animationStage}`}
        onClick={animationStage === 'complete' ? onClose : undefined}
      />
      
      {/* Symbol that grows from source element */}
// Update the integrated-symbol section
<div 
  ref={symbolRef}
  className={`integrated-symbol stage-${animationStage}`}
  style={{
    '--source-x': `${sourcePosition.x}px`,
    '--source-y': `${sourcePosition.y}px`,
    '--symbol-scale': 2.5, // Make it bigger
    '--glow-color': glowColor,
    '--animation-duration': `${animationDuration}ms`,
  }}
  onClick={animationStage === 'complete' ? onClose : undefined} // Add click to close
>
        {/* Main symbol image */}
        <img 
          src={symbolImage} 
          alt={title}
          className="symbol-image"
        />
        
        {/* Magical particles emanating from symbol */}
        <div className="symbol-particles">
          {Array.from({ length: particleCount }).map((_, index) => (
            <div 
              key={index}
              className="particle"
              style={{
                '--delay': `${Math.random() * 2}s`,
                '--duration': `${1 + Math.random() * 2}s`,
                '--angle': `${(360 / particleCount) * index}deg`,
                '--distance': `${50 + Math.random() * 100}px`,
              }}
            />
          ))}
        </div>
        
        {/* Ripple effect from source */}
        <div className="source-ripples">
          {[1, 2, 3].map((ripple) => (
            <div 
              key={ripple}
              className="ripple"
              style={{
                '--ripple-delay': `${ripple * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Information panel that slides in */}

      
      {/* Connecting line from source to symbol */}
      <div className={`connection-line stage-${animationStage}`} />
    </div>
  );
};

export default SymbolSceneIntegration;