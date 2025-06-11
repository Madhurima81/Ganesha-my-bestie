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