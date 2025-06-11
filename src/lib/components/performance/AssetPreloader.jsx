// AssetPreloader.jsx - Load images before scene starts
export const AssetPreloader = ({ assets, onComplete, children }) => {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const loadAssets = async () => {
      const total = assets.length;
      let loadedCount = 0;
      
      for (const asset of assets) {
        const img = new Image();
        img.src = asset;
        await img.decode();
        loadedCount++;
        setProgress((loadedCount / total) * 100);
      }
      
      setLoaded(true);
      onComplete?.();
    };
    
    loadAssets();
  }, [assets]);
  
  if (!loaded) {
    return <LoadingBar progress={progress} />;
  }
  
  return children;
};

// SceneTransition.jsx - Smooth transitions between scenes
export const SceneTransition = ({ children, transitionType = 'fade' }) => {
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  useEffect(() => {
    setTimeout(() => setIsTransitioning(false), 300);
  }, []);
  
  return (
    <div className={`scene-transition ${transitionType} ${isTransitioning ? 'transitioning' : ''}`}>
      {children}
    </div>
  );
};