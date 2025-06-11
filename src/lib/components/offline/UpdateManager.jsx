// UpdateManager.jsx - Handles PWA updates
export const UpdateManager = ({ children }) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      });
    }
  }, []);
  
  if (updateAvailable) {
    return (
      <UpdatePrompt onUpdate={() => window.location.reload()} />
    );
  }
  
  return children;
};
