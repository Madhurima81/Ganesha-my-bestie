import { useState, useEffect } from 'react';

/**
 * useImagePreload - Custom hook for preloading images
 * 
 * @param {Array|string} imageSources - Array of image URLs or single image URL
 * @param {Object} options - Configuration options
 * @param {boolean} options.sequential - Whether to load images sequentially
 * @param {function} options.onProgress - Callback for loading progress
 * @param {function} options.onComplete - Callback when all images are loaded
 * @param {function} options.onError - Callback when an image fails to load
 * @returns {Object} Loading state and progress information
 */
const useImagePreload = (imageSources, {
  sequential = false,
  onProgress = null,
  onComplete = null,
  onError = null
} = {}) => {
  // Convert string to array if single image URL is provided
  const sources = Array.isArray(imageSources) ? imageSources : [imageSources];
  
  // Initialize state
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState([]);
  const [loadedImages, setLoadedImages] = useState({});
  
  // Effect to preload images
  useEffect(() => {
    // Skip if no images to load
    if (!sources || sources.length === 0) {
      setLoaded(true);
      setLoading(false);
      setProgress(100);
      if (onComplete) onComplete([]);
      return;
    }
    
    // Reset state when sources change
    setLoaded(false);
    setLoading(true);
    setProgress(0);
    setErrors([]);
    setLoadedImages({});
    
    let canceled = false;
    let loadedCount = 0;
    const totalImages = sources.length;
    const newErrors = [];
    const newLoadedImages = {};
    
    // Function to handle image load
    const handleImageLoad = (src, img) => {
      if (canceled) return;
      
      loadedCount++;
      newLoadedImages[src] = img;
      
      // Update progress
      const newProgress = Math.round((loadedCount / totalImages) * 100);
      setProgress(newProgress);
      setLoadedImages({ ...newLoadedImages });
      
      // Call progress callback
      if (onProgress) {
        onProgress({
          loaded: loadedCount,
          total: totalImages,
          percentage: newProgress,
          currentSrc: src
        });
      }
      
      // Check if all images are loaded
      if (loadedCount === totalImages) {
        setLoaded(true);
        setLoading(false);
        if (onComplete) onComplete(Object.keys(newLoadedImages));
      }
    };
    
    // Function to handle image error
    const handleImageError = (src, error) => {
      if (canceled) return;
      
      newErrors.push({ src, error });
      setErrors([...newErrors]);
      
      // Call error callback
      if (onError) {
        onError({ src, error });
      }
      
      // Still increment loaded count to continue progress
      loadedCount++;
      
      // Update progress
      const newProgress = Math.round((loadedCount / totalImages) * 100);
      setProgress(newProgress);
      
      // Check if all images are loaded (including errors)
      if (loadedCount === totalImages) {
        setLoaded(true);
        setLoading(false);
        if (onComplete) onComplete(Object.keys(newLoadedImages));
      }
    };
    
    // Load images sequentially
    if (sequential) {
      let currentIndex = 0;
      
      const loadNextImage = () => {
        if (canceled || currentIndex >= sources.length) return;
        
        const src = sources[currentIndex];
        currentIndex++;
        
        const img = new Image();
        img.onload = () => {
          handleImageLoad(src, img);
          loadNextImage();
        };
        img.onerror = (error) => {
          handleImageError(src, error);
          loadNextImage();
        };
        img.src = src;
      };
      
      loadNextImage();
    }
    // Load images in parallel
    else {
      sources.forEach(src => {
        const img = new Image();
        img.onload = () => handleImageLoad(src, img);
        img.onerror = (error) => handleImageError(src, error);
        img.src = src;
      });
    }
    
    // Cleanup function
    return () => {
      canceled = true;
    };
  }, [sources, sequential, onProgress, onComplete, onError]);
  
  // Preload a single image manually
  const preloadImage = (src) => {
    return new Promise((resolve, reject) => {
      // Skip if already loaded
      if (loadedImages[src]) {
        resolve(loadedImages[src]);
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => ({ ...prev, [src]: img }));
        resolve(img);
      };
      img.onerror = (error) => {
        setErrors(prev => [...prev, { src, error }]);
        reject(error);
      };
      img.src = src;
    });
  };
  
  // Check if a specific image is loaded
  const isImageLoaded = (src) => {
    return !!loadedImages[src];
  };
  
  // Get a loaded image element
  const getLoadedImage = (src) => {
    return loadedImages[src] || null;
  };
  
  return {
    loaded,          // boolean: whether all images are loaded
    loading,         // boolean: whether any images are still loading
    progress,        // number: percentage of images loaded (0-100)
    errors,          // array: list of loading errors
    loadedImages,    // object: map of loaded image elements by src
    preloadImage,    // function: manually preload a single image
    isImageLoaded,   // function: check if a specific image is loaded
    getLoadedImage   // function: get a loaded image element
  };
};

export default useImagePreload;