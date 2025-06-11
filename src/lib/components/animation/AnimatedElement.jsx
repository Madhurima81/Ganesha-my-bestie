import React, { useState, useEffect } from 'react';
import '../../styles/animations.css';

/**
 * AnimatedElement - A wrapper component that adds animations to any element
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be animated
 * @param {string} props.animation - Animation name (e.g. 'fade-in', 'slide-in-left')
 * @param {number} props.duration - Animation duration in seconds
 * @param {string} props.timing - Animation timing function
 * @param {number} props.delay - Animation delay in seconds
 * @param {string|number} props.iteration - Animation iteration count
 * @param {string} props.direction - Animation direction
 * @param {string} props.fillMode - Animation fill mode
 * @param {boolean} props.playOnMount - Whether to play animation when component mounts
 * @param {boolean} props.playOnVisible - Whether to play animation when element becomes visible
 * @param {function} props.onAnimationEnd - Callback when animation ends
 * @param {string} props.className - Additional CSS classes
 */
const AnimatedElement = ({
  children,
  animation = 'fade-in',
  duration = 0.5,
  timing = 'ease',
  delay = 0,
  iteration = 1,
  direction = 'normal',
  fillMode = 'forwards',
  playOnMount = true,
  playOnVisible = false,
  onAnimationEnd,
  className = '',
  style = {},
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(playOnMount);
  
  // Set up intersection observer for playOnVisible
  useEffect(() => {
    if (!playOnVisible) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, no need to observe anymore
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    );
    
    // Get the current element
    const element = document.querySelector(`.animated-${animation}`);
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [playOnVisible, animation]);
  
  // Determine if should animate
  useEffect(() => {
    if (playOnVisible && isVisible) {
      setShouldAnimate(true);
    } else if (playOnMount) {
      setShouldAnimate(true);
    }
  }, [playOnMount, playOnVisible, isVisible]);
  
  // Handle animation end
  const handleAnimationEnd = (e) => {
    if (onAnimationEnd) {
      onAnimationEnd(e);
    }
  };
  
  // CSS variables for animation properties
  const animationStyle = {
    '--animation-duration': `${duration}s`,
    '--animation-timing': timing,
    '--animation-delay': `${delay}s`,
    '--animation-iteration': iteration,
    '--animation-direction': direction,
    '--animation-fill-mode': fillMode,
    ...style
  };
  
  return (
    <div
      className={`animated-${animation} ${shouldAnimate ? `animate-${animation}` : ''} ${className}`}
      style={animationStyle}
      onAnimationEnd={handleAnimationEnd}
      {...rest}
    >
      {children}
    </div>
  );
};

export default AnimatedElement;