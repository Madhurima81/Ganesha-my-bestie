import { useState, useEffect } from 'react';

/**
 * useResponsiveLayout - Custom hook for responsive design
 * 
 * Provides information about the current viewport size and orientation
 * 
 * @returns {Object} Layout information
 * @returns {number} returns.width - Current viewport width
 * @returns {number} returns.height - Current viewport height
 * @returns {boolean} returns.isPortrait - Whether device is in portrait mode
 * @returns {boolean} returns.isMobile - Whether viewport is mobile-sized
 * @returns {boolean} returns.isTablet - Whether viewport is tablet-sized
 * @returns {boolean} returns.isDesktop - Whether viewport is desktop-sized
 */
const useResponsiveLayout = () => {
  // Initialize with current window dimensions
  const [layout, setLayout] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isPortrait: window.innerHeight > window.innerWidth,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024
  });
  
  useEffect(() => {
    // Function to update layout on resize
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setLayout({
        width,
        height,
        isPortrait: height > width,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };
    
    // Add event listeners
    window.addEventListener('resize', updateLayout);
    window.addEventListener('orientationchange', updateLayout);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('orientationchange', updateLayout);
    };
  }, []);
  
  return layout;
};

export default useResponsiveLayout;