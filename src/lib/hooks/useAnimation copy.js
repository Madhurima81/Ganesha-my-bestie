import { useState, useCallback } from 'react';

/**
 * useAnimation - Hook for controlling animations
 * 
 * @param {Object} options
 * @param {string} options.initialAnimation - Initial animation to apply
 * @param {boolean} options.autoPlay - Whether to auto-play the animation
 * @param {function} options.onComplete - Callback when animation completes
 * @returns {Object} Animation controls and state
 */
const useAnimation = ({
  initialAnimation = '',
  autoPlay = false,
  onComplete = () => {}
} = {}) => {
  const [animation, setAnimation] = useState(initialAnimation);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isComplete, setIsComplete] = useState(false);
  
  // Play animation
  const play = useCallback((animationName) => {
    if (animationName) {
      setAnimation(animationName);
    }
    setIsPlaying(true);
    setIsComplete(false);
  }, []);
  
  // Stop animation
  const stop = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  // Handle animation end
  const handleAnimationEnd = useCallback(() => {
    setIsPlaying(false);
    setIsComplete(true);
    onComplete();
  }, [onComplete]);
  
  // Change animation
  const changeAnimation = useCallback((newAnimation) => {
    setAnimation(newAnimation);
    setIsComplete(false);
  }, []);
  
  // Reset the animation (stops and resets completion state)
  const reset = useCallback(() => {
    setIsPlaying(false);
    setIsComplete(false);
  }, []);
  
  return {
    animation,
    isPlaying,
    isComplete,
    play,
    stop,
    reset,
    changeAnimation,
    handleAnimationEnd
  };
};

export default useAnimation;