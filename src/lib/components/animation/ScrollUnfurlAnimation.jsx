import React, { useEffect, useState } from 'react';
import './ScrollUnfurlAnimation.css';
import SparkleAnimation from './SparkleAnimation';

/**
 * ScrollUnfurlAnimation - Animated scroll component for displaying educational content
 * 
 * @param {Object} props
 * @param {string|React.ReactNode} props.scrollContent - Content to display (can be JSX or image URL)
 * @param {string} props.character - Character to display ("both", "ganesha", "mooshika", or "none")
 * @param {string} props.animation - Animation style ("unfurl", "pop")
 * @param {boolean} props.showSparkle - Whether to show sparkle effects
 * @param {Function} props.onAnimationComplete - Callback when animation completes
 * @param {Object} props.buttonProps - Properties for the button
 * @returns {JSX.Element}
 */
const ScrollUnfurlAnimation = ({ 
  scrollContent, 
  character = "both", 
  animation = "unfurl", 
  showSparkle = true,
  onAnimationComplete = () => {},
  buttonProps = { text: "I understand!", onClick: () => {} }
}) => {
  const [animationState, setAnimationState] = useState('entering');
  
  // Handle animation completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('visible');
      onAnimationComplete();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);
  
  // Determine what content to render based on the type of scrollContent
  const renderContent = () => {
    // If scrollContent is a string (URL), render an image
    if (typeof scrollContent === 'string') {
      return (
        <div className="scroll-image-container">
          <img 
            src={scrollContent} 
            alt="Symbol Information"
            className="scroll-image"
          />
        </div>
      );
    }
    
    // If it's already a React element, render it directly
    return scrollContent;
  };
  
  // Render the appropriate character
  const renderCharacter = () => {
    switch(character) {
      case 'ganesha':
        return (
          <div className="scroll-character ganesha">
            <div className="character-image ganesha"></div>
          </div>
        );
      case 'mooshika':
        return (
          <div className="scroll-character mooshika">
            <div className="character-image mooshika"></div>
          </div>
        );
      case 'both':
        return (
          <div className="scroll-characters">
            <div className="scroll-character ganesha">
              <div className="character-image ganesha"></div>
            </div>
            <div className="scroll-character mooshika">
              <div className="character-image mooshika"></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="scroll-animation-container">
      {/* Characters */}
      {renderCharacter()}
      
      {/* Scroll with animation */}
      <div 
        className={`scroll ${animation} ${animationState}`}
        onAnimationEnd={() => {
          if (animationState === 'entering') {
            setAnimationState('visible');
          }
        }}
      >
        {/* Content area */}
        <div className="scroll-content">
          {renderContent()}
          
          {/* Sparkle effect */}
          {showSparkle && animationState === 'visible' && (
            <SparkleAnimation
              type="star"
              count={20}
              color="gold"
              size={8}
              duration={2000}
              fadeOut={true}
              area="full"
            />
          )}
        </div>
        
        {/* Button */}
        <button 
          className={`scroll-button ${animationState === 'visible' ? 'visible' : ''}`}
          onClick={buttonProps.onClick}
          disabled={animationState !== 'visible'}
        >
          {buttonProps.text}
        </button>
      </div>
    </div>
  );
};

export default ScrollUnfurlAnimation;