// MooshikaAnimation.jsx
import React, { useState, useEffect } from 'react';
import './MooshikaAnimation.css';

/**
 * Mooshika (Mouse) Animation Component
 * Creates a mouse character that scurries across the screen with various configurable options
 * 
 * @param {string} direction - Direction of movement: "left-to-right", "right-to-left", "top-to-bottom", "bottom-to-top"
 * @param {string} speed - Animation speed: "slow", "normal", "fast", "veryFast"
 * @param {string} path - Movement path: "straight", "zigzag", "arc", "wave"
 * @param {function} onComplete - Callback function when animation completes
 * @param {number|string} repeat - Number of times to repeat animation (0 = once, "infinite" = loop forever)
 * @param {number} delay - Delay before animation starts (ms)
 * @param {string} color - Color of the mouse character
 * @returns {JSX.Element}
 */
const MooshikaAnimation = ({ 
  direction = 'left-to-right', 
  speed = 'normal',
  path = 'straight',
  onComplete = () => {},
  repeat = 0,
  delay = 0,
  color = '#999999'
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationCount, setAnimationCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  // Map speed prop to actual duration
  const speedMap = {
    slow: 5000,
    normal: 3000,
    fast: 1500,
    veryFast: 800
  };
  
  // Determine animation class based on direction and path
  const getAnimationClass = () => {
    const directionClass = `mooshika-${direction}`;
    const pathClass = path !== 'straight' ? `mooshika-path-${path}` : '';
    return `${directionClass} ${pathClass}`;
  };
  
  // Calculate animation duration
  const duration = speedMap[speed] || speedMap.normal;
  
  // Start animation after optional delay
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsAnimating(true);
      
      // When animation ends
      const endTimer = setTimeout(() => {
        setIsAnimating(false);
        setAnimationCount(prev => prev + 1);
        
        // Call the completion callback
        onComplete();
      }, duration);
      
      return () => clearTimeout(endTimer);
    }, delay);
    
    return () => clearTimeout(startTimer);
  }, [delay, duration, onComplete]);
  
  // Handle repeat logic
  useEffect(() => {
    // If we need to repeat and animation just completed
    if (animationCount > 0 && (repeat === 'infinite' || animationCount < repeat)) {
      // First hide the character
      setIsVisible(false);
      
      // Then reset position and show again
      const resetTimer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
        
        // When repeat animation ends
        const endRepeatTimer = setTimeout(() => {
          setIsAnimating(false);
          setAnimationCount(prev => prev + 1);
        }, duration);
        
        return () => clearTimeout(endRepeatTimer);
      }, 1000); // 1 second pause between repeats
      
      return () => clearTimeout(resetTimer);
    }
  }, [animationCount, repeat, duration]);
  
  // If not animating and not set to repeat or already finished repeating, return null
  if (!isVisible || (!isAnimating && animationCount > 0 && animationCount >= repeat && repeat !== 'infinite')) {
    return null;
  }
  
  // Determine the starting position based on direction
  const getInitialPosition = () => {
    switch(direction) {
      case 'right-to-left':
        return { right: '-50px', top: '50%', transform: 'scaleX(-1)' };
      case 'top-to-bottom':
        return { top: '-50px', left: '50%', transform: 'rotate(90deg)' };
      case 'bottom-to-top':
        return { bottom: '-50px', left: '50%', transform: 'rotate(-90deg)' };
      case 'left-to-right':
      default:
        return { left: '-50px', top: '50%' };
    }
  };
  
  const initialPosition = getInitialPosition();
  
  return (
    <div 
      className={`mooshika-container ${isAnimating ? getAnimationClass() : ''}`}
      style={{ 
        '--animation-duration': `${duration}ms`,
        ...initialPosition
      }}
    >
      <div className="mooshika-character">
        <div 
          className="mooshika-body"
          style={{ backgroundColor: color }}
        ></div>
        <div 
          className="mooshika-ears"
          style={{ backgroundColor: color }}
        ></div>
        <div 
          className="mooshika-tail"
          style={{ backgroundColor: color }}
        ></div>
        <div className="mooshika-feet"></div>
      </div>
    </div>
  );
};

export default MooshikaAnimation;