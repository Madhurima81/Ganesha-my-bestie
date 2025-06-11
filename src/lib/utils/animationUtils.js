/**
 * Animation utility functions
 */

/**
 * Adds an animation class to an element and removes it after animation completes
 * 
 * @param {HTMLElement} element - DOM element to animate
 * @param {string} animationClass - CSS animation class to add
 * @param {Object} options - Animation options
 * @param {number} options.duration - Animation duration in milliseconds
 * @param {function} options.onComplete - Callback function when animation completes
 * @returns {function} Function to cancel the animation
 */
export const animateElement = (element, animationClass, { 
    duration = 1000, 
    onComplete = () => {} 
  } = {}) => {
    if (!element) {
      console.warn('Cannot animate null element');
      return () => {};
    }
    
    // Add animation class
    element.classList.add(`animate-${animationClass}`);
    
    // Set CSS variables for animation properties
    element.style.setProperty('--animation-duration', `${duration / 1000}s`);
    
    // Set up animation end listener
    const handleAnimationEnd = () => {
      element.classList.remove(`animate-${animationClass}`);
      element.removeEventListener('animationend', handleAnimationEnd);
      onComplete();
    };
    
    element.addEventListener('animationend', handleAnimationEnd);
    
    // Return function to cancel animation
    return () => {
      element.classList.remove(`animate-${animationClass}`);
      element.removeEventListener('animationend', handleAnimationEnd);
    };
  };
  
  /**
   * Creates a sequence of animations
   * 
   * @param {Array} sequence - Array of animation steps
   * @param {HTMLElement} sequence[].element - Element to animate
   * @param {string} sequence[].animation - Animation class
   * @param {number} sequence[].duration - Duration in milliseconds
   * @param {number} sequence[].delay - Delay before animation in milliseconds
   * @returns {function} Function to cancel the sequence
   */
  export const animateSequence = (sequence) => {
    if (!sequence || !Array.isArray(sequence) || sequence.length === 0) {
      return () => {};
    }
    
    let isCancelled = false;
    const cancelFunctions = [];
    
    // Process each step in the sequence
    const runSequence = (index = 0) => {
      if (isCancelled || index >= sequence.length) return;
      
      const { element, animation, duration = 1000, delay = 0 } = sequence[index];
      
      // Wait for delay, then animate
      setTimeout(() => {
        if (isCancelled) return;
        
        const cancelFn = animateElement(element, animation, {
          duration,
          onComplete: () => {
            if (!isCancelled) {
              runSequence(index + 1);
            }
          }
        });
        
        cancelFunctions.push(cancelFn);
      }, delay);
    };
    
    // Start the sequence
    runSequence();
    
    // Return function to cancel all animations
    return () => {
      isCancelled = true;
      cancelFunctions.forEach(cancel => cancel());
    };
  };
  
  /**
   * Animate elements as they enter the viewport
   * 
   * @param {string} selector - CSS selector for elements to animate
   * @param {string} animation - Animation class to apply
   * @param {Object} options - Animation options
   * @param {number} options.threshold - Visibility threshold (0-1)
   * @param {number} options.rootMargin - Margin around root
   * @param {boolean} options.once - Whether to animate only once
   */
  export const animateOnScroll = (selector, animation, {
    threshold = 0.1,
    rootMargin = '0px',
    once = true
  } = {}) => {
    const elements = document.querySelectorAll(selector);
    
    if (!elements.length) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(`animate-${animation}`);
            
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove(`animate-${animation}`);
          }
        });
      },
      { threshold, rootMargin }
    );
    
    elements.forEach(element => {
      observer.observe(element);
    });
    
    return observer;
  };