// CoachCharacter.jsx - Fully corrected version
import React, { useState, useEffect, useRef } from 'react';
import './CoachCharacter.css'; // Make sure to import the CSS file

/**
 * CoachCharacter Component
 * An animated character that guides users through interactions
 */
const CoachCharacter = ({
  enabled = true,
  characterImage = null,
  targetPosition = null,
  message = '',
  showMessage = false,
  animation = 'idle',
  onAnimationComplete = () => {},
  size = 'medium',  // small, medium, large
  position = { bottom: '20px', right: '20px' },
  zIndex = 1000
}) => {
  const [currentPosition, setCurrentPosition] = useState(position);
  const [messagePosition, setMessagePosition] = useState({}); // Added missing state
  const [isMoving, setIsMoving] = useState(false);
  const [isPointing, setIsPointing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const animationRef = useRef(null);
  
  // Size mappings
  const sizeMap = {
    small: { width: '80px', height: '80px' },
    medium: { width: '120px', height: '120px' },
    large: { width: '160px', height: '160px' }
  };
  
  const characterSize = sizeMap[size] || sizeMap.medium;
  
  // Calculate the best position for the coach character relative to the target
  const calcCharacterPosition = () => {
    if (!targetPosition) return { position: position, messagePosition: {} };
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Larger offset for mobile devices to prevent covering the target
    const offsetDistance = Math.min(viewportWidth, viewportHeight) * 0.25;
    
    // Calculate the best position to place coach without covering target
    // Default position (right side of target)
    let newX = targetPosition.x + offsetDistance;
    let newY = targetPosition.y;
    
    // Check if target is in different quadrants of the screen
    const isRight = targetPosition.x > viewportWidth * 0.6;
    const isLeft = targetPosition.x < viewportWidth * 0.4;
    const isTop = targetPosition.y < viewportHeight * 0.4;
    const isBottom = targetPosition.y > viewportHeight * 0.6;
    
    // Place coach based on target position to avoid covering content
    if (isRight) {
      // Target on right, place coach on left
      newX = targetPosition.x - offsetDistance;
    }
    
    if (isTop) {
      // Target on top, place coach below
      newY = targetPosition.y + offsetDistance * 0.7;
    } else if (isBottom) {
      // Target on bottom, place coach above
      newY = targetPosition.y - offsetDistance * 0.7;
    }
    
    // Ensure coach stays within viewport
    newX = Math.max(50, Math.min(viewportWidth - 50, newX));
    newY = Math.max(50, Math.min(viewportHeight - 50, newY));
    
    // Point the message correctly toward the target
    let msgPosition = {};
    if (newX < targetPosition.x) {
      // Coach is left of target
      msgPosition = { right: '-50px', left: 'auto', top: '30%' };
    } else if (newX > targetPosition.x) {
      // Coach is right of target
      msgPosition = { left: '-50px', right: 'auto', top: '30%' };
    } else if (newY < targetPosition.y) {
      // Coach is above target
      msgPosition = { bottom: '-40px', top: 'auto' };
    } else {
      // Coach is below target
      msgPosition = { top: '-40px', bottom: 'auto' };
    }
    
    return {
      position: {
        left: `${newX}px`,
        top: `${newY}px`,
        transform: `translate(-50%, -50%)`
      },
      messagePosition: msgPosition
    };
  };
  
  // Handle movement to target position
  useEffect(() => {
    if (!enabled || !targetPosition) return;
    
    const { position, messagePosition } = calcCharacterPosition();
    setCurrentPosition(position);
    setMessagePosition(messagePosition);
    setIsMoving(true);
    
    // After moving, show pointing animation
    const movementTimer = setTimeout(() => {
      setIsMoving(false);
      setIsPointing(true);
      
      // Reset pointing after a delay
      const pointingTimer = setTimeout(() => {
        setIsPointing(false);
        onAnimationComplete();
      }, 2000);
      
      return () => clearTimeout(pointingTimer);
    }, 1000);
    
    return () => clearTimeout(movementTimer);
  }, [enabled, targetPosition, onAnimationComplete]);
  
  // Don't render if disabled or explicitly hidden
  if (!enabled || !isVisible) return null;
  
  // Different animations based on state
  const getAnimation = () => {
    if (isMoving) return 'coach-moving';
    if (isPointing) return 'coach-pointing';
    return `coach-${animation}`;
  };
  
  // Handle touch/click on coach to dismiss
  const handleCoachClick = () => {
    // Animate out
    setIsVisible(false);
    onAnimationComplete();
  };
  
  return (
    <div
      className={`coach-character ${getAnimation()}`}
      style={{
        ...currentPosition,
        zIndex,
      }}
      onClick={handleCoachClick} // Allow dismissing by clicking
      onTouchEnd={handleCoachClick} // Support touch devices
    >
      {/* Character Image */}
      <div 
        className="coach-image"
        style={{
          width: characterSize.width,
          height: characterSize.height,
          backgroundImage: `url(${characterImage})`,
        }}
      />
      
      {/* Optional speech bubble */}
      {showMessage && message && (
        <div 
          className="coach-message"
          style={{
            ...messagePosition, // Apply calculated position
          }}
        >
          {message}
          <div className="message-pointer" />
        </div>
      )}
      
      {/* Pointer animation when pointing */}
      {isPointing && (
        <div className="coach-pointer" />
      )}
    </div>
  );
};

export default CoachCharacter;