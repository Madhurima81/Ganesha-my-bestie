// CacheManager.jsx - Manages local caching
export const CacheManager = ({ children }) => {
  useEffect(() => {
    // Precache important assets
    if ('caches' in window) {
      caches.open('game-assets-v1').then(cache => {
        cache.addAll([
          '/images/backgrounds/',
          '/sounds/effects/',
          '/fonts/'
        ]);
      });
    }
  }, []);
  
  return children;
};
