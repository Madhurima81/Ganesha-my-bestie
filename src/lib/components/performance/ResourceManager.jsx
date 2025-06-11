// ResourceManager.jsx - Manages memory usage
export const ResourceManager = ({ children, maxMemory = 50 }) => {
  useEffect(() => {
    const checkMemory = () => {
      if (performance.memory) {
        const usedMB = performance.memory.usedJSHeapSize / 1024 / 1024;
        if (usedMB > maxMemory) {
          console.warn('High memory usage:', usedMB);
          // Clear unused resources
        }
      }
    };
    
    const interval = setInterval(checkMemory, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return children;
};
