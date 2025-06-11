import React, { useEffect, useState } from 'react';
import '../../styles/components.css';

/**
 * Popup - A reusable popup/modal component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the popup is visible
 * @param {function} props.onClose - Function called when popup is closed
 * @param {string} props.title - Popup title
 * @param {React.ReactNode} props.children - Popup content
 * @param {boolean} props.closeOnBackdrop - Whether clicking backdrop closes popup
 * @param {string} props.className - Additional CSS classes
 */
const Popup = ({
  isOpen,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
  className = '',
  ...rest
}) => {
  const [animationState, setAnimationState] = useState('closed');
  
  useEffect(() => {
    if (isOpen && animationState === 'closed') {
      setAnimationState('opening');
      
      // Start enter animation
      setTimeout(() => {
        setAnimationState('open');
      }, 10); // Small delay for the CSS transition to work
    } else if (!isOpen && (animationState === 'open' || animationState === 'opening')) {
      setAnimationState('closing');
      
      // Wait for exit animation to complete
      setTimeout(() => {
        setAnimationState('closed');
      }, 300); // Match CSS transition duration
    }
  }, [isOpen, animationState]);
  
  if (animationState === 'closed') {
    return null;
  }
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };
  
  return (
    <div 
      className={`popup-overlay ${animationState} ${className}`}
      onClick={handleBackdropClick}
      style={{ 
        opacity: animationState === 'opening' || animationState === 'closing' ? 0 : 1
      }}
      {...rest}
    >
      <div 
        className="popup-container"
        style={{ 
          transform: animationState === 'opening' || animationState === 'closing' 
            ? 'scale(0.9)' 
            : 'scale(1)'
        }}
      >
        {title && (
          <div className="popup-header">
            <h2>{title}</h2>
          </div>
        )}
        
        <div className="popup-content">
          {children}
        </div>
        
        <div className="popup-footer">
          <button 
            className="game-button game-button-primary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;