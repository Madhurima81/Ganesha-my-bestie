import React, { useState, useEffect } from 'react';
import '../../styles/components.css';

/**
 * InteractiveElement - A component for interactive elements with visual cues
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be rendered inside
 * @param {string} props.tooltip - Text to show as a tooltip
 * @param {boolean} props.showInitialHint - Whether to show a hint initially
 * @param {function} props.onInteract - Function called when element is interacted with
 * @param {string} props.className - Additional CSS classes
 */
const InteractiveElement = ({
  children,
  tooltip,
  showInitialHint = false,
  onInteract,
  className = '',
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHint, setShowHint] = useState(showInitialHint);
  
  // Show hint after delay if not interacted with
  useEffect(() => {
    if (!hasInteracted && !showInitialHint) {
      const timer = setTimeout(() => {
        setShowHint(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [hasInteracted, showInitialHint]);
  
  const handleInteraction = () => {
    setIsPressed(true);
    
    // Reset pressed state after animation
    setTimeout(() => {
      setIsPressed(false);
    }, 200);
    
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowHint(false);
    }
    
    if (onInteract) {
      onInteract();
    }
  };
  
  return (
    <div
      className={`interactive-element ${isPressed ? 'pressed' : ''} ${!hasInteracted ? 'new' : ''} ${className}`}
      onClick={handleInteraction}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleInteraction}
      {...rest}
    >
      {children}
      
      {(isHovered || showHint) && tooltip && (
        <div className="tooltip" style={{ 
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default InteractiveElement;