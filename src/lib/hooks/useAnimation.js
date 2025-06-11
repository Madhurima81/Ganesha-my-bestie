// useAnimation.js - Custom hook for animations
import { useCallback } from 'react';

/**
 * Custom hook for handling animations
 * @returns {Object} Animation methods
 */
const useAnimation = () => {
  /**
   * Plays an animation by adding and removing a class
   * @param {string} animationType - The type of animation to play
   * @param {string} elementId - The ID of the element to animate
   * @param {number} duration - Duration in milliseconds
   * @param {Object} options - Additional options
   * @returns {Promise} Promise that resolves when animation completes
   */
  const playAnimation = useCallback((animationType, elementId, duration, options = {}) => {
    return new Promise((resolve) => {
      const element = document.getElementById(elementId);
      if (!element) {
        console.warn(`Element with ID '${elementId}' not found.`);
        resolve(false);
        return;
      }

      // Map animation type to class name
      const animationClasses = {
        transform: 'transform-active',
        slide: 'slide-in',
        pulse: 'pulse-animation',
        fade: 'fade-animation',
        bounce: 'bounce-animation',
        sparkle: 'sparkle-animation',
      };

      const className = animationClasses[animationType] || animationType;

      // Add animation class
      element.classList.add(className);
      
      // Apply any custom styles if provided
      if (options.styles) {
        Object.entries(options.styles).forEach(([property, value]) => {
          element.style[property] = value;
        });
      }

      // Set CSS variables for randomization if needed
      if (options.randomize) {
        Object.entries(options.randomize).forEach(([variable, config]) => {
          const { min, max } = config;
          const randomValue = min + Math.random() * (max - min);
          element.style.setProperty(`--random-${variable}`, `${randomValue}px`);
        });
      }

      // Remove class after animation duration
      setTimeout(() => {
        element.classList.remove(className);
        
        // Reset styles if requested
        if (options.resetStyles) {
          Object.keys(options.styles || {}).forEach((property) => {
            element.style[property] = '';
          });
        }
        
        // Call onComplete callback if provided
        if (options.onComplete) {
          options.onComplete();
        }
        
        resolve(true);
      }, duration);
    });
  }, []);

  /**
   * Creates water ripple effect at specific coordinates
   * @param {string} containerId - The ID of the container element
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  const createRippleEffect = useCallback((containerId, x, y) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const ripple = document.createElement('div');
    ripple.className = 'water-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    container.appendChild(ripple);
    
    // Remove ripple element after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 2000);
  }, []);

  /**
   * Shows a hint indicator on an element
   * @param {string} elementId - The ID of the element
   * @param {number} duration - Duration in milliseconds
   */
  const showInteractiveHint = useCallback((elementId, duration = 3000) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Get element position
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create hint element
    const hint = document.createElement('div');
    hint.className = 'interactive-hint';
    hint.style.left = `${centerX - 20}px`;
    hint.style.top = `${centerY - 20}px`;
    
    document.body.appendChild(hint);
    
    // Remove hint after duration
    setTimeout(() => {
      hint.remove();
    }, duration);
  }, []);

  return {
    playAnimation,
    createRippleEffect,
    showInteractiveHint
  };
};

export default useAnimation;