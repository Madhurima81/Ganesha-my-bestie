// OrientationManager.jsx - Handle device rotation
export const OrientationManager = ({ children, preferredOrientation = 'landscape' }) => {
  const [orientation, setOrientation] = useState(window.orientation);
  
  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.orientation);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Try to lock orientation (only works in fullscreen)
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock(preferredOrientation).catch(() => {});
    }
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
  
  if (orientation === 0 || orientation === 180) {
    return <RotateDevicePrompt />;
  }
  
  return children;
};